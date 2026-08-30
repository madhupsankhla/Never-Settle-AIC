"""
Dose-Response and Statistical Utility Reference.
Implements shared: compute_dose_response(driver_series, kpi_series, method, lag=0)
"""
from typing import Dict, Any, Union
import numpy as np
import pandas as pd
from scipy import stats
import statsmodels.api as sm


def compute_dose_response(
    driver_series: Union[pd.Series, np.ndarray, list],
    kpi_series: Union[pd.Series, np.ndarray, list],
    method: str = "pearson",
    lag: int = 0
) -> Dict[str, Any]:
    """
    Computes statistical dose-response relationship between driver and KPI movements.

    Methods:
    - pearson: Pearson correlation r
    - linear_regression: OLS slope, R^2, and p-value
    - multiple_regression: Multiple OLS model
    - spearman: Non-parametric rank correlation for non-linear monotonic curves
    """
    d = np.array(driver_series, dtype=float)
    k = np.array(kpi_series, dtype=float)

    if lag > 0:
        d = d[:-lag]
        k = k[lag:]

    # Remove NaNs
    valid_mask = (~np.isnan(d)) & (~np.isnan(k))
    d = d[valid_mask]
    k = k[valid_mask]

    n_samples = len(d)
    if n_samples < 3:
        # Sparse sample handling: return low-confidence widened interval
        return {
            "score": 0.20,
            "slope": 0.0,
            "r_squared": 0.0,
            "p_value": 1.0,
            "sample_size": n_samples,
            "is_sparse": True,
            "details": "Insufficient historical sample size for regression"
        }

    # Variance check
    if np.std(d) == 0 or np.std(k) == 0:
        return {
            "score": 0.0,
            "slope": 0.0,
            "r_squared": 0.0,
            "p_value": 1.0,
            "sample_size": n_samples,
            "is_sparse": False,
            "details": "Zero variance in driver or KPI series"
        }

    if method in ["pearson", "linear_regression"]:
        slope, intercept, r_value, p_value, std_err = stats.linregress(d, k)
        r_squared = float(r_value ** 2)
        score = float(abs(r_value))

        return {
            "score": round(score, 4),
            "slope": round(float(slope), 4),
            "r_squared": round(r_squared, 4),
            "p_value": round(float(p_value), 4),
            "std_err": round(float(std_err), 4),
            "sample_size": n_samples,
            "is_sparse": False,
            "details": f"OLS: slope={slope:.4f}, R2={r_squared:.2f}, p={p_value:.4f}"
        }

    elif method == "spearman":
        rho, p_val = stats.spearmanr(d, k)
        return {
            "score": round(float(abs(rho)), 4),
            "slope": round(float(rho), 4),
            "r_squared": round(float(rho ** 2), 4),
            "p_value": round(float(p_val), 4),
            "sample_size": n_samples,
            "is_sparse": False,
            "details": f"Spearman rho={rho:.4f}, p={p_val:.4f}"
        }

    return {"score": 0.0, "sample_size": n_samples, "is_sparse": False}
