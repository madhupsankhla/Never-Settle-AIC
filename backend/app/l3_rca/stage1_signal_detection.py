"""
Stage 1: Signal Detection — Data-Driven.
Computes rolling per-segment baseline (mean ± 2σ over trailing 8 weeks)
from real weekly conversion/footfall series, plus an absolute materiality floor.
Includes weather-adjusted footfall residual detection (Build Guide Section 6).
"""
from typing import Dict, Any, List, Optional
import numpy as np
import pandas as pd
import statsmodels.api as sm


def detect_signal(
    current_value: float,
    historical_series: List[float],
    materiality_floor_pct: float = 5.0,
    z_cutoff: float = 2.0
) -> Dict[str, Any]:
    """
    Detects whether current KPI observation is a statistically and commercially material anomaly.
    Legacy interface — accepts pre-computed values for backward compatibility.
    """
    hist = np.array(historical_series, dtype=float)
    if len(hist) < 3:
        baseline_mean = float(np.mean(hist)) if len(hist) > 0 else current_value
        return {
            "current_value": round(current_value, 2),
            "baseline_mean": round(baseline_mean, 2),
            "baseline_std": 0.0,
            "z_score": 0.0,
            "pct_change": 0.0,
            "abs_change_value": 0.0,
            "is_statistically_significant": False,
            "is_material": False,
            "is_sparse_history": True
        }

    mean = float(np.mean(hist))
    std = float(np.std(hist, ddof=1)) if len(hist) > 1 else 0.0

    abs_change = current_value - mean
    pct_change = (abs_change / mean * 100.0) if mean != 0 else 0.0

    z_score = (abs_change / std) if std > 0 else 0.0

    is_stat_sig = abs(z_score) >= z_cutoff
    is_material_magnitude = abs(pct_change) >= materiality_floor_pct

    # Must satisfy both statistical significance (z >= 2.0) and business materiality floor (e.g. 5%)
    is_material = is_stat_sig and is_material_magnitude

    return {
        "current_value": round(current_value, 2),
        "baseline_mean": round(mean, 2),
        "baseline_std": round(std, 2),
        "z_score": round(float(z_score), 2),
        "pct_change": round(float(pct_change), 2),
        "abs_change_value": round(float(abs_change), 2),
        "is_statistically_significant": is_stat_sig,
        "is_material": is_material,
        "is_sparse_history": False
    }


def detect_signal_from_series(
    weekly_series: pd.DataFrame,
    target_week: int,
    target_year: int = 2026,
    z_cutoff: float = 2.0,
    materiality_floor_pct: float = 5.0,
    trailing_weeks: int = 8
) -> Dict[str, Any]:
    """
    Compute signal detection from a real weekly conversion-rate series.
    Uses rolling 8-week trailing mean/std with .shift(1) — exactly as Build Guide Section 1.

    Args:
        weekly_series: DataFrame with columns [iso_year, iso_week, conversion_rate]
        target_week: ISO week number to evaluate
        target_year: ISO year
        z_cutoff: z-score threshold for statistical significance
        materiality_floor_pct: minimum pct change for business materiality

    Returns:
        Same dict structure as detect_signal, plus rolling_mean, rolling_std history.
    """
    df = weekly_series.copy().sort_values(["iso_year", "iso_week"]).reset_index(drop=True)

    # Compute trailing rolling stats (shifted so current week is NOT in its own baseline)
    df["conv_roll_mean"] = df["conversion_rate"].rolling(trailing_weeks, min_periods=4).mean().shift(1)
    df["conv_roll_std"] = df["conversion_rate"].rolling(trailing_weeks, min_periods=4).std().shift(1)
    df["conv_z"] = (df["conversion_rate"] - df["conv_roll_mean"]) / df["conv_roll_std"]

    # Find the target week row
    target_mask = (df["iso_week"] == target_week) & (df["iso_year"] == target_year)
    if not target_mask.any():
        return detect_signal(0.0, [], materiality_floor_pct, z_cutoff)

    row = df.loc[target_mask].iloc[0]
    current_val = float(row["conversion_rate"])
    roll_mean = float(row["conv_roll_mean"]) if pd.notna(row["conv_roll_mean"]) else current_val
    roll_std = float(row["conv_roll_std"]) if pd.notna(row["conv_roll_std"]) else 0.0
    z_score = float(row["conv_z"]) if pd.notna(row["conv_z"]) else 0.0

    pct_change = ((current_val - roll_mean) / roll_mean * 100.0) if roll_mean != 0 else 0.0

    is_stat_sig = abs(z_score) >= z_cutoff
    is_material = is_stat_sig and abs(pct_change) >= materiality_floor_pct

    return {
        "current_value": round(current_val, 4),
        "baseline_mean": round(roll_mean, 4),
        "baseline_std": round(roll_std, 4),
        "z_score": round(z_score, 2),
        "pct_change": round(pct_change, 2),
        "abs_change_value": round(current_val - roll_mean, 4),
        "is_statistically_significant": is_stat_sig,
        "is_material": is_material,
        "is_sparse_history": False,
        "rolling_series": df[["iso_year", "iso_week", "conversion_rate", "conv_roll_mean", "conv_z"]].to_dict("records")
    }


def detect_footfall_signal(
    footfall_series: pd.DataFrame,
    weather_df: pd.DataFrame,
    region: str,
    target_week: int,
    target_year: int = 2026,
    z_cutoff: float = 2.0
) -> Dict[str, Any]:
    """
    Weather-adjusted footfall signal detection (Build Guide Section 6).
    1. Merge footfall with weather data.
    2. OLS: footfall ~ temperature + precipitation + is_weekend → get residuals.
    3. Compute rolling z-score on residuals.

    Returns footfall_status dict + weather model diagnostics.
    """
    ff = footfall_series.copy()
    wx = weather_df.copy()

    # Ensure date columns are datetime
    ff["date"] = pd.to_datetime(ff["date"])
    wx["date"] = pd.to_datetime(wx["date"])

    # Filter weather to region
    wx = wx[wx["region"] == region].copy()

    # Merge
    merged = ff.merge(wx[["date", "temperature", "precipitation_mm"]], on="date", how="left")
    merged["is_weekend"] = merged["date"].dt.dayofweek.isin([5, 6]).astype(int)

    # Drop NaN rows
    clean = merged.dropna(subset=["temperature", "precipitation_mm", "entries_count"])

    if len(clean) < 10:
        return {
            "footfall_change_pct": 0.0,
            "footfall_z_score": 0.0,
            "is_traffic_problem": False,
            "is_weather_adjusted": False,
            "weather_r_squared": 0.0
        }

    # OLS regression
    X = clean[["temperature", "precipitation_mm", "is_weekend"]]
    X = sm.add_constant(X)
    y = clean["entries_count"].astype(float)

    model = sm.OLS(y, X).fit()
    clean = clean.copy()
    clean["residual"] = model.resid
    clean["predicted"] = model.fittedvalues

    # Weekly aggregation of residuals
    clean["iso_year"] = clean["date"].dt.isocalendar().year.astype(int)
    clean["iso_week"] = clean["date"].dt.isocalendar().week.astype(int)
    weekly_resid = clean.groupby(["iso_year", "iso_week"]).agg(
        mean_residual=("residual", "mean"),
        mean_footfall=("entries_count", "mean")
    ).reset_index().sort_values(["iso_year", "iso_week"])

    # Rolling z-score on weekly residual
    weekly_resid["resid_roll_mean"] = weekly_resid["mean_residual"].rolling(8, min_periods=4).mean().shift(1)
    weekly_resid["resid_roll_std"] = weekly_resid["mean_residual"].rolling(8, min_periods=4).std().shift(1)
    weekly_resid["resid_z"] = (weekly_resid["mean_residual"] - weekly_resid["resid_roll_mean"]) / weekly_resid["resid_roll_std"]

    # Find target week
    target_mask = (weekly_resid["iso_week"] == target_week) & (weekly_resid["iso_year"] == target_year)
    if not target_mask.any():
        return {
            "footfall_change_pct": 0.0,
            "footfall_z_score": 0.0,
            "is_traffic_problem": False,
            "is_weather_adjusted": True,
            "weather_r_squared": round(float(model.rsquared), 3)
        }

    row = weekly_resid.loc[target_mask].iloc[0]
    resid_z = float(row["resid_z"]) if pd.notna(row["resid_z"]) else 0.0

    # Raw footfall % change from rolling mean
    raw_ff_series = footfall_series.copy()
    raw_ff_series["date"] = pd.to_datetime(raw_ff_series["date"])
    raw_ff_series["iso_year"] = raw_ff_series["date"].dt.isocalendar().year.astype(int)
    raw_ff_series["iso_week"] = raw_ff_series["date"].dt.isocalendar().week.astype(int)
    weekly_raw = raw_ff_series.groupby(["iso_year", "iso_week"])["entries_count"].sum().reset_index()
    weekly_raw["ff_roll_mean"] = weekly_raw["entries_count"].rolling(8, min_periods=4).mean().shift(1)
    target_raw = weekly_raw[(weekly_raw["iso_week"] == target_week) & (weekly_raw["iso_year"] == target_year)]
    if not target_raw.empty:
        raw_row = target_raw.iloc[0]
        ff_pct = ((raw_row["entries_count"] - raw_row["ff_roll_mean"]) / raw_row["ff_roll_mean"] * 100) if raw_row["ff_roll_mean"] > 0 else 0.0
    else:
        ff_pct = 0.0

    return {
        "footfall_change_pct": round(float(ff_pct), 2),
        "footfall_z_score": round(resid_z, 2),
        "is_traffic_problem": abs(resid_z) >= z_cutoff,
        "is_weather_adjusted": True,
        "weather_r_squared": round(float(model.rsquared), 3),
        "weather_coefficients": {
            "intercept": round(float(model.params.iloc[0]), 2),
            "temperature": round(float(model.params.iloc[1]), 2),
            "precipitation": round(float(model.params.iloc[2]), 2),
            "is_weekend": round(float(model.params.iloc[3]), 2),
        }
    }
