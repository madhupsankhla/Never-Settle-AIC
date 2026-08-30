"""
Weather-Adjusted Footfall Baseline (Build Guide §6).

Regresses store footfall against weather variables and weekend flags
to produce a weather-adjusted baseline.  Residuals represent footfall
anomalies unexplained by weather / day-of-week effects.
"""
from typing import Any, Dict, Optional

import numpy as np
import pandas as pd
import statsmodels.api as sm


# ---------------------------------------------------------------------------
# Sparse-data defaults
# ---------------------------------------------------------------------------
_SPARSE_DEFAULTS: Dict[str, Any] = {
    "coefficients": {
        "intercept": 0.0,
        "temperature": 0.0,
        "precipitation": 0.0,
        "is_weekend": 0.0,
    },
    "r_squared": 0.0,
    "residuals": pd.Series(dtype=float),
    "predicted": pd.Series(dtype=float),
    "model_summary": "Insufficient data (n < 10) – sparse defaults returned.",
    "is_sparse": True,
}

_MIN_OBS = 10  # minimum observations before we refuse to fit


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def compute_weather_adjusted_footfall(
    footfall_df: pd.DataFrame,
    weather_df: pd.DataFrame,
    region: Optional[str] = None,
    store_region_map: Optional[Dict[str, str]] = None,
) -> Dict[str, Any]:
    """Fit OLS: entries_count ~ temperature_c + precipitation_mm + is_weekend.

    Parameters
    ----------
    footfall_df : pd.DataFrame
        Columns: ``store_id``, ``date``, ``entries_count``.
    weather_df : pd.DataFrame
        Columns: ``region``, ``date``, ``temperature_c``, ``precipitation_mm``,
        ``extreme_weather_flag``.
    region : str, optional
        If supplied, every row in *footfall_df* is assigned this region before
        the merge.  Convenient when all stores belong to one region.
    store_region_map : dict, optional
        Mapping ``{store_id: region}`` used to add a ``region`` column to
        *footfall_df* when stores span multiple regions.  Ignored when
        *region* is provided.

    Returns
    -------
    Dict[str, Any]
        ``coefficients`` (intercept, temperature, precipitation, is_weekend),
        ``r_squared``, ``residuals``, ``predicted``, ``model_summary``.
    """
    # ---- copies to avoid mutating caller data ----
    ff = footfall_df.copy()
    wx = weather_df.copy()

    # ---- ensure datetime types ----
    ff["date"] = pd.to_datetime(ff["date"])
    wx["date"] = pd.to_datetime(wx["date"])

    # ---- assign region to footfall rows ----
    if region is not None:
        ff["region"] = region
    elif store_region_map is not None:
        ff["region"] = ff["store_id"].map(store_region_map)
    elif "region" in ff.columns:
        pass  # already present
    else:
        # fallback: cross-join on date only (single-region assumption)
        wx = wx.drop(columns=["region"], errors="ignore")
        merged = ff.merge(wx, on="date", how="inner")
        return _fit_ols(merged)

    merged = ff.merge(wx, on=["date", "region"], how="inner")
    return _fit_ols(merged)


def compute_footfall_residual_zscore(
    residuals: pd.Series,
    target_idx: int,
) -> Dict[str, float]:
    """Compute the z-score of a single residual relative to the full series.

    Parameters
    ----------
    residuals : pd.Series
        Residual series (output of :func:`compute_weather_adjusted_footfall`).
    target_idx : int
        Positional index into *residuals* whose z-score is requested.

    Returns
    -------
    Dict[str, float]
        ``residual_value``, ``mean``, ``std``, ``z_score``.
    """
    if len(residuals) < 3:
        return {
            "residual_value": 0.0,
            "mean": 0.0,
            "std": 0.0,
            "z_score": 0.0,
        }

    mean = float(residuals.mean())
    std = float(residuals.std(ddof=1))
    value = float(residuals.iloc[target_idx])

    z = (value - mean) / std if std > 0 else 0.0

    return {
        "residual_value": round(value, 4),
        "mean": round(mean, 4),
        "std": round(std, 4),
        "z_score": round(z, 4),
    }


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _fit_ols(merged: pd.DataFrame) -> Dict[str, Any]:
    """Run the OLS regression on the already-merged frame."""

    # ---- weekend flag ----
    merged["is_weekend"] = merged["date"].dt.dayofweek.isin([5, 6]).astype(int)

    # ---- drop rows with missing predictors / response ----
    cols_needed = ["entries_count", "temperature_c", "precipitation_mm", "is_weekend"]
    merged = merged.dropna(subset=cols_needed).reset_index(drop=True)

    if len(merged) < _MIN_OBS:
        return dict(_SPARSE_DEFAULTS)

    y = merged["entries_count"].astype(float)
    X = merged[["temperature_c", "precipitation_mm", "is_weekend"]].astype(float)
    X = sm.add_constant(X)

    model = sm.OLS(y, X).fit()

    coefficients = {
        "intercept": round(float(model.params.get("const", 0.0)), 4),
        "temperature": round(float(model.params.get("temperature_c", 0.0)), 4),
        "precipitation": round(float(model.params.get("precipitation_mm", 0.0)), 4),
        "is_weekend": round(float(model.params.get("is_weekend", 0.0)), 4),
    }

    return {
        "coefficients": coefficients,
        "r_squared": round(float(model.rsquared), 4),
        "residuals": model.resid,
        "predicted": model.fittedvalues,
        "model_summary": str(model.summary()),
        "is_sparse": False,
    }
