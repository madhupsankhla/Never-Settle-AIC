"""
Partial Correlation Calculation.
Controls for confounding variables (e.g. Footfall and Size-Curve Fill Rate)
when evaluating Staff Training Completion effects on Conversion Rate.
"""
from typing import List, Dict, Any
import numpy as np
import pandas as pd
from scipy import stats


def compute_partial_correlation(
    df: pd.DataFrame,
    x: str,
    y: str,
    covariates: List[str]
) -> Dict[str, Any]:
    """
    Calculates partial correlation r(x, y | covariates).
    Uses linear regression residuals.
    """
    clean_df = df[[x, y] + covariates].dropna()
    if len(clean_df) < len(covariates) + 3:
        return {
            "partial_r": 0.20,
            "p_value": 1.0,
            "sample_size": len(clean_df),
            "is_sparse": True,
            "details": "Insufficient sample size for controlled partial correlation"
        }

    # Regress x on covariates
    X_cov = clean_df[covariates].values
    X_cov_const = np.column_stack([np.ones(len(clean_df)), X_cov])

    beta_x, _, _, _ = np.linalg.lstsq(X_cov_const, clean_df[x].values, rcond=None)
    res_x = clean_df[x].values - X_cov_const.dot(beta_x)

    # Regress y on covariates
    beta_y, _, _, _ = np.linalg.lstsq(X_cov_const, clean_df[y].values, rcond=None)
    res_y = clean_df[y].values - X_cov_const.dot(beta_y)

    # Correlation between residuals
    if np.std(res_x) == 0 or np.std(res_y) == 0:
        return {"partial_r": 0.0, "p_value": 1.0, "sample_size": len(clean_df), "is_sparse": False}

    r, p = stats.pearsonr(res_x, res_y)
    return {
        "partial_r": round(float(r), 4),
        "p_value": round(float(p), 4),
        "sample_size": len(clean_df),
        "is_sparse": False,
        "details": f"Partial r={r:.4f} controlling for {', '.join(covariates)}"
    }
