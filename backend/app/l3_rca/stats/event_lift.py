"""
Event Lift Calculation (Build Guide §7).

Measures the percentage lift in store footfall during an event window
compared to a surrounding baseline period, excluding the event window
itself from the baseline.
"""
from typing import Any, Dict

import numpy as np
import pandas as pd


# ---------------------------------------------------------------------------
# Sparse-data defaults
# ---------------------------------------------------------------------------
_SPARSE_DEFAULTS: Dict[str, Any] = {
    "baseline_footfall": 0.0,
    "event_footfall": 0.0,
    "lift_pct": 0.0,
    "baseline_n": 0,
    "event_n": 0,
    "is_sparse": True,
    "explanation": "Insufficient data to compute event lift.",
}

_MIN_BASELINE = 3  # need at least 3 baseline observations
_MIN_EVENT = 1     # need at least 1 event-window observation


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def compute_event_lift(
    footfall_df: pd.DataFrame,
    event_date: str,
    window_days: int = 2,
    baseline_days: int = 10,
) -> Dict[str, Any]:
    """Compute footfall lift during an event window vs. surrounding baseline.

    Parameters
    ----------
    footfall_df : pd.DataFrame
        Columns: ``store_id``, ``date``, ``entries_count``.
        Should be pre-filtered to the relevant store(s).
    event_date : str
        ISO date string of the event (e.g. ``"2026-05-10"``).
    window_days : int
        Half-width of the event window (inclusive both sides).
        Default ``2`` → window spans ``[event − 2, event + 2]``.
    baseline_days : int
        Half-width of the wider baseline window (inclusive).
        Default ``10`` → baseline spans ``[event − 10, event + 10]``
        **excluding** the event window.

    Returns
    -------
    Dict[str, Any]
        ``baseline_footfall``, ``event_footfall``, ``lift_pct``,
        ``baseline_n``, ``event_n``.
    """
    df = footfall_df.copy()
    df["date"] = pd.to_datetime(df["date"])
    event_dt = pd.Timestamp(event_date)

    # ---- define windows ----
    event_start = event_dt - pd.Timedelta(days=window_days)
    event_end = event_dt + pd.Timedelta(days=window_days)

    baseline_start = event_dt - pd.Timedelta(days=baseline_days)
    baseline_end = event_dt + pd.Timedelta(days=baseline_days)

    # ---- event-window rows ----
    event_mask = (df["date"] >= event_start) & (df["date"] <= event_end)
    event_rows = df.loc[event_mask, "entries_count"].dropna()

    # ---- baseline rows (wider window minus event window) ----
    baseline_mask = (
        (df["date"] >= baseline_start)
        & (df["date"] <= baseline_end)
        & ~event_mask
    )
    baseline_rows = df.loc[baseline_mask, "entries_count"].dropna()

    # ---- sparse-data guard ----
    if len(baseline_rows) < _MIN_BASELINE or len(event_rows) < _MIN_EVENT:
        return dict(_SPARSE_DEFAULTS)

    baseline_footfall = float(baseline_rows.mean())
    event_footfall = float(event_rows.mean())

    if baseline_footfall == 0:
        lift_pct = 0.0
    else:
        lift_pct = (event_footfall - baseline_footfall) / baseline_footfall * 100.0

    return {
        "baseline_footfall": round(baseline_footfall, 2),
        "event_footfall": round(event_footfall, 2),
        "lift_pct": round(lift_pct, 2),
        "baseline_n": int(len(baseline_rows)),
        "event_n": int(len(event_rows)),
        "is_sparse": False,
    }
