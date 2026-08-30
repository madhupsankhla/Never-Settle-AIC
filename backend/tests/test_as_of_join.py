"""
Tests for Universal As-Of Join Engine.
"""
import pandas as pd
from app.l1_data.as_of_join import as_of_join


def test_as_of_join_daily_pos_to_weekly_inventory():
    # Fact table: Daily POS transactions
    fact_df = pd.DataFrame([
        {"store_id": "STORE-014", "date": "2026-08-10", "tx_val": 100},
        {"store_id": "STORE-014", "date": "2026-08-15", "tx_val": 150},
        {"store_id": "STORE-014", "date": "2026-08-18", "tx_val": 200},
    ])

    # Reference table: Weekly inventory snapshots on Sundays (Aug 9, Aug 16)
    ref_df = pd.DataFrame([
        {"store_id": "STORE-014", "snapshot_date": "2026-08-09", "fill_rate": 92.0},
        {"store_id": "STORE-014", "snapshot_date": "2026-08-16", "fill_rate": 68.0},
    ])

    joined = as_of_join(
        fact_table=fact_df,
        reference_table=ref_df,
        key="store_id",
        date_field="date",
        ref_date_field="snapshot_date"
    )

    assert len(joined) == 3
    # Aug 10 and Aug 15 match Aug 9 snapshot (fill_rate = 92.0)
    assert joined.loc[joined["date"] == "2026-08-10", "fill_rate"].values[0] == 92.0
    assert joined.loc[joined["date"] == "2026-08-15", "fill_rate"].values[0] == 92.0
    # Aug 18 matches Aug 16 snapshot (fill_rate = 68.0)
    assert joined.loc[joined["date"] == "2026-08-18", "fill_rate"].values[0] == 68.0
