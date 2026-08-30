"""
Store-Invariance Check (Build Guide §8).

Determines whether a candidate driver is "store-invariant" — i.e. nearly
constant across stores — and therefore unable to explain store-level
variation in a KPI.  When flagged, the caller should cap the driver's
hypothesis confidence to LOW.
"""
from typing import Any, Dict

import numpy as np
from scipy import stats


# ---------------------------------------------------------------------------
# Sparse-data defaults
# ---------------------------------------------------------------------------
_SPARSE_DEFAULTS: Dict[str, Any] = {
    "driver_cv": 0.0,
    "kpi_cv": 0.0,
    "is_store_invariant": False,
    "correlation_r": 0.0,
    "correlation_p": 1.0,
    "cap_confidence": False,
    "explanation": "Insufficient data (n < 3) to assess store invariance.",
    "is_sparse": True,
}

_MIN_STORES = 3


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def check_store_invariance(
    driver_values: Dict[str, float],
    kpi_changes: Dict[str, float],
    cv_threshold: float = 0.10,
) -> Dict[str, Any]:
    """Check whether a driver is store-invariant relative to a KPI.

    Parameters
    ----------
    driver_values : Dict[str, float]
        Mapping ``{store_id: driver_metric_value}`` (e.g. competitor price
        index per store).
    kpi_changes : Dict[str, float]
        Mapping ``{store_id: kpi_pct_change}`` (e.g. conversion % change
        per store).
    cv_threshold : float
        Coefficient-of-variation threshold below which a series is
        considered "invariant".  Default ``0.10`` (10 %).

    Returns
    -------
    Dict[str, Any]
        ``driver_cv``, ``kpi_cv``, ``is_store_invariant``,
        ``correlation_r``, ``correlation_p``, ``cap_confidence``,
        ``explanation``.
    """
    # ---- align on common stores ----
    common_stores = sorted(set(driver_values) & set(kpi_changes))

    if len(common_stores) < _MIN_STORES:
        return dict(_SPARSE_DEFAULTS)

    d = np.array([driver_values[s] for s in common_stores], dtype=float)
    k = np.array([kpi_changes[s] for s in common_stores], dtype=float)

    # ---- remove pairs where either value is NaN ----
    valid = (~np.isnan(d)) & (~np.isnan(k))
    d, k = d[valid], k[valid]

    if len(d) < _MIN_STORES:
        return dict(_SPARSE_DEFAULTS)

    # ---- coefficient of variation ----
    driver_mean = float(np.mean(d))
    kpi_mean = float(np.mean(k))

    driver_cv = float(np.std(d, ddof=1) / abs(driver_mean)) if driver_mean != 0 else 0.0
    kpi_cv = float(np.std(k, ddof=1) / abs(kpi_mean)) if kpi_mean != 0 else 0.0

    # ---- invariance flag ----
    is_store_invariant = (driver_cv < cv_threshold) and (kpi_cv > cv_threshold)
    cap_confidence = is_store_invariant

    # ---- Pearson correlation ----
    if np.std(d) == 0 or np.std(k) == 0:
        corr_r, corr_p = 0.0, 1.0
    else:
        corr_r, corr_p = stats.pearsonr(d, k)
        corr_r = float(corr_r)
        corr_p = float(corr_p)

    # ---- human-readable explanation ----
    if is_store_invariant:
        explanation = (
            f"Driver is store-invariant (CV={driver_cv:.3f} < {cv_threshold}), "
            f"but KPI varies across stores (CV={kpi_cv:.3f} > {cv_threshold}). "
            f"This driver cannot explain store-level KPI differences; "
            f"cap hypothesis confidence to LOW."
        )
    else:
        explanation = (
            f"Driver CV={driver_cv:.3f}, KPI CV={kpi_cv:.3f}. "
            f"Store-invariance condition not met; no confidence cap applied."
        )

    return {
        "driver_cv": round(driver_cv, 4),
        "kpi_cv": round(kpi_cv, 4),
        "is_store_invariant": is_store_invariant,
        "correlation_r": round(corr_r, 4),
        "correlation_p": round(corr_p, 4),
        "cap_confidence": cap_confidence,
        "explanation": explanation,
        "is_sparse": False,
    }
