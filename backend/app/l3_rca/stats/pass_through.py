"""
Deterministic Pass-Through and Lagged Cross-Correlation modules.
"""
from typing import Dict, Any, Union
import numpy as np
import pandas as pd
from scipy import signal, stats


def compute_pass_through_ratio(
    actual_price_change_pct: float,
    expected_price_change_pct: float,
    lower_bound: float = 0.85,
    upper_bound: float = 1.15
) -> Dict[str, Any]:
    """
    Deterministic pass-through ratio check:
    Pass_Through_Ratio = Actual_Price_Change_% / Expected_Price_Change_%
    """
    if expected_price_change_pct == 0:
        return {"is_pass_through": False, "ratio": 0.0, "confidence": "LOW"}

    ratio = actual_price_change_pct / expected_price_change_pct
    is_valid = (lower_bound <= ratio <= upper_bound)
    confidence = "HIGH" if is_valid else "LOW"

    return {
        "is_pass_through": is_valid,
        "ratio": round(float(ratio), 4),
        "confidence": confidence,
        "details": f"Policy pass-through ratio {ratio:.2f} within [{lower_bound}, {upper_bound}]"
    }


def compute_lagged_cross_correlation(
    series_a: Union[pd.Series, np.ndarray, list],
    series_b: Union[pd.Series, np.ndarray, list],
    max_lag: int = 4
) -> Dict[str, Any]:
    """
    Calculates cross-correlation across multiple discrete lags.
    Returns optimal lag and peak correlation coefficient.
    """
    a = np.array(series_a, dtype=float)
    b = np.array(series_b, dtype=float)

    if len(a) < max_lag + 3 or len(b) < max_lag + 3:
        return {"best_lag": 0, "peak_corr": 0.0, "is_sparse": True, "curve": []}

    corrs = []
    for lag in range(0, max_lag + 1):
        if lag == 0:
            r, _ = stats.pearsonr(a, b)
        else:
            r, _ = stats.pearsonr(a[:-lag], b[lag:])
        corrs.append({"lag": lag, "correlation": round(float(r), 4)})

    best_entry = max(corrs, key=lambda x: abs(x["correlation"]))
    return {
        "best_lag": best_entry["lag"],
        "peak_corr": best_entry["correlation"],
        "is_sparse": False,
        "curve": corrs
    }
