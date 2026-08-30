"""
Excel Dataset Loader for SoleSight.
Reads the 6-month synthetic dataset from SoleSight-Synthetic-Dataset-6mo.xlsx
and returns a dict of DataFrames ready for DuckDB registration.
"""
from typing import Dict
from pathlib import Path
import pandas as pd


# Sheet-name → DuckDB table-name mapping
_SHEET_TABLE_MAP = {
    "dim_store":              "dim_store",
    "dim_product":            "dim_product",
    "dim_staff":              "dim_staff",
    "fact_pos":               "fact_transactions",
    "fact_inventory":         "fact_inventory_snapshot",
    "fact_footfall":          "fact_footfall",
    "fact_staff_roster":      "fact_staff_schedule",
    "fact_mystery_shopper":   "fact_mystery_shopper",
    "fact_returns":           "fact_returns",
    "ext_policy_events":      "ext_policy_events",
    "ext_competitor_pricing":  "ext_competitor_pricing",
    "ext_weather":            "ext_weather",
    "ext_local_events":       "ext_local_events",
    "ext_reviews":            "ext_reviews",
}


def load_excel_dataset(path: str) -> Dict[str, pd.DataFrame]:
    """
    Load all sheets from the 6-month Excel dataset, normalise column names,
    compute derived columns, and return {duckdb_table_name: DataFrame}.
    """
    xlsx_path = Path(path)
    if not xlsx_path.exists():
        raise FileNotFoundError(f"Dataset not found: {xlsx_path}")

    tables: Dict[str, pd.DataFrame] = {}

    for sheet_name, table_name in _SHEET_TABLE_MAP.items():
        df = pd.read_excel(str(xlsx_path), sheet_name=sheet_name)
        df = _normalise(table_name, df)
        tables[table_name] = df

    return tables


def _normalise(table_name: str, df: pd.DataFrame) -> pd.DataFrame:
    """Apply per-table column renames and derived column computations."""

    if table_name == "fact_transactions":
        # Rename columns to match existing DuckDB repository methods
        if "discount_pct" in df.columns and "discount_amount" not in df.columns:
            df["discount_amount"] = (df["list_price"] * df["discount_pct"]).round(2)
        if "net_price" not in df.columns:
            df["net_price"] = df["list_price"] - df["discount_amount"]
        # Ensure date_time is string for DuckDB
        if "date_time" in df.columns:
            df["date_time"] = pd.to_datetime(df["date_time"]).dt.strftime("%Y-%m-%dT%H:%M:%SZ")

    elif table_name == "fact_inventory_snapshot":
        # Rename snapshot_date_true → snapshot_date (the ground-truth date)
        if "snapshot_date_true" in df.columns:
            df = df.rename(columns={"snapshot_date_true": "snapshot_date"})
        # Keep snapshot_date_reported for as-of-join realism

    elif table_name == "fact_staff_schedule":
        # Excel has: store_id, staff_id, month, hours_worked, training_completed
        # Repo expects: training_completion_flag
        if "training_completed" in df.columns and "training_completion_flag" not in df.columns:
            df = df.rename(columns={"training_completed": "training_completion_flag"})
        # Keep 'month' as-is (monthly grain, not daily)
        # Ensure month is string
        if "month" in df.columns:
            df["month"] = pd.to_datetime(df["month"]).dt.strftime("%Y-%m")

    elif table_name == "ext_weather":
        # Rename temperature_c → temperature for internal consistency
        if "temperature_c" in df.columns and "temperature" not in df.columns:
            df = df.rename(columns={"temperature_c": "temperature"})

    elif table_name == "ext_competitor_pricing":
        # Keep price_index_vs_us as-is — the RCA engine will use it directly
        pass

    # Ensure date columns are proper date types
    for col in df.columns:
        if col in ("date", "snapshot_date", "snapshot_date_reported",
                    "opening_date", "launch_date", "date_observed",
                    "effective_date"):
            try:
                df[col] = pd.to_datetime(df[col]).dt.strftime("%Y-%m-%d")
            except Exception:
                pass

    return df
