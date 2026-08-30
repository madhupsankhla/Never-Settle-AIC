"""
Deterministic KPI formulas and aggregators.
Section 4 mathematical implementations.
"""
from typing import Dict, Any
import pandas as pd


def compute_footfall(footfall_df: pd.DataFrame) -> float:
    """Total unique store entries."""
    if footfall_df.empty:
        return 0.0
    return float(footfall_df["entries_count"].sum())


def compute_conversion_rate(transactions_df: pd.DataFrame, footfall_df: pd.DataFrame) -> float:
    """Conversion Rate = Transactions / Footfall * 100"""
    total_footfall = compute_footfall(footfall_df)
    if total_footfall == 0:
        return 0.0
    txn_count = len(transactions_df["transaction_id"].unique()) if "transaction_id" in transactions_df else len(transactions_df)
    return float((txn_count / total_footfall) * 100.0)


def compute_full_price_sell_through(transactions_df: pd.DataFrame) -> float:
    """Full-Price Sell-Through % = Units sold >= 95% list price / total units sold * 100"""
    if transactions_df.empty or "net_price" not in transactions_df:
        return 0.0
    total_units = transactions_df["qty"].sum()
    if total_units == 0:
        return 0.0
    full_price_units = transactions_df[transactions_df["net_price"] >= (transactions_df["list_price"] * 0.95)]["qty"].sum()
    return float((full_price_units / total_units) * 100.0)


def compute_size_curve_fill_rate(inventory_df: pd.DataFrame, expected_sizes: int = 6) -> float:
    """Size-Curve Fill Rate = Sizes in stock / full expected size range * 100"""
    if inventory_df.empty or "on_hand_units" not in inventory_df:
        return 0.0
    in_stock_sizes = inventory_df[inventory_df["on_hand_units"] > 0]["size"].nunique()
    return float(min(100.0, (in_stock_sizes / max(1, expected_sizes)) * 100.0))


def compute_size_related_return_rate(returns_df: pd.DataFrame, total_units_sold: int) -> float:
    """Size-Related Return Rate = Returns tagged wrong-size/fit / units sold * 100"""
    if returns_df.empty or total_units_sold == 0:
        return 0.0
    fit_reasons = ["FIT_TOO_SMALL", "FIT_TOO_LARGE", "WRONG_SIZE"]
    fit_returns = returns_df[returns_df["return_reason_code"].isin(fit_reasons)]
    return float((len(fit_returns) / total_units_sold) * 100.0)


def compute_aov(transactions_df: pd.DataFrame) -> float:
    """Average Order Value (AOV) = Total Net Revenue / Total Transactions"""
    if transactions_df.empty:
        return 0.0
    total_rev = transactions_df["net_price"].sum()
    txn_count = len(transactions_df["transaction_id"].unique()) if "transaction_id" in transactions_df else max(1, len(transactions_df))
    return float(total_rev / txn_count)


def compute_upt(transactions_df: pd.DataFrame) -> float:
    """Units Per Transaction (UPT) = Total Units / Total Transactions"""
    if transactions_df.empty:
        return 0.0
    total_units = transactions_df["qty"].sum()
    txn_count = len(transactions_df["transaction_id"].unique()) if "transaction_id" in transactions_df else max(1, len(transactions_df))
    return float(total_units / txn_count)
