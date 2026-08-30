"""
Universal As-Of Join Engine.
Implements: as_of_join(fact_table, reference_table, key, date_field)
Matches each fact row with the most recent reference row dated <= the fact row's date.
"""
from typing import List, Union
import pandas as pd


def as_of_join(
    fact_table: pd.DataFrame,
    reference_table: pd.DataFrame,
    key: Union[str, List[str]],
    date_field: str,
    ref_date_field: str = None,
    suffixes: tuple = ("", "_ref")
) -> pd.DataFrame:
    """
    Performs an as-of join between fact_table and reference_table.
    Uses the most recent reference row dated <= fact row's date for each match key.

    Args:
        fact_table: Primary fact DataFrame (e.g. POS transactions, daily footfall)
        reference_table: Reference or snapshot DataFrame with varying cadence (e.g. weekly inventory, monthly mystery shopper)
        key: Match key column name or list of column names (e.g. 'store_id' or ['store_id', 'sku_id'])
        date_field: Fact date column name
        ref_date_field: Reference date column name (defaults to date_field)
        suffixes: Suffixes for overlapping column names

    Returns:
        Joined DataFrame
    """
    if ref_date_field is None:
        ref_date_field = date_field

    if fact_table.empty:
        return fact_table.copy()
    if reference_table.empty:
        return fact_table.copy()

    f_df = fact_table.copy()
    r_df = reference_table.copy()

    # Ensure datetime format for sorting and comparison
    f_df["__join_date"] = pd.to_datetime(f_df[date_field])
    r_df["__ref_join_date"] = pd.to_datetime(r_df[ref_date_field])

    # Ensure keys are lists
    by_keys = [key] if isinstance(key, str) else list(key)

    # Sort required for pd.merge_asof
    f_df = f_df.sort_values("__join_date")
    r_df = r_df.sort_values("__ref_join_date")

    # Perform merge_asof (backward direction: ref_date <= fact_date)
    merged = pd.merge_asof(
        f_df,
        r_df,
        left_on="__join_date",
        right_on="__ref_join_date",
        by=by_keys,
        direction="backward",
        suffixes=suffixes
    )

    # Clean temporary join columns
    merged = merged.drop(columns=["__join_date", "__ref_join_date"])
    return merged
