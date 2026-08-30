"""
KPI Engine & Semantic Layer.
Loads YAML KPI contracts, resolves schemas, and computes deterministic metric values.
"""
from typing import Dict, List, Optional, Any
from pathlib import Path
import yaml
import pandas as pd
from app.schemas.kpi import KPIContract
from app.l1_data.repository import IDataRepository
from app.l2_kpi.formulas import (
    compute_footfall,
    compute_conversion_rate,
    compute_full_price_sell_through,
    compute_size_curve_fill_rate,
    compute_size_related_return_rate,
    compute_aov,
    compute_upt,
)


class KPIEngine:
    def __init__(self, config_dir: str = "config/kpis", repository: Optional[IDataRepository] = None):
        self.config_dir = Path(config_dir)
        self.contracts: Dict[str, KPIContract] = {}
        self.repository = repository
        self.load_contracts()

    def load_contracts(self):
        """Load all YAML contracts from config directory."""
        if not self.config_dir.exists():
            return
        for file in self.config_dir.glob("*.yaml"):
            with open(file, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
                if data and "id" in data:
                    contract = KPIContract(**data)
                    self.contracts[contract.id] = contract

    def get_contract(self, kpi_id: str) -> Optional[KPIContract]:
        return self.contracts.get(kpi_id)

    def list_kpis(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": c.id,
                "name": c.name,
                "description": c.description,
                "grain": c.grain.model_dump(),
                "thresholds": c.thresholds.model_dump(),
                "drivers_count": len(c.drivers)
            }
            for c in self.contracts.values()
        ]

    def compute_kpi_for_segment(
        self,
        kpi_id: str,
        store_id: str,
        start_date: str,
        end_date: str,
        sku_id: Optional[str] = None
    ) -> float:
        """Compute the deterministic value of a given KPI for a store and date range."""
        if not self.repository:
            return 0.0

        if kpi_id == "footfall":
            ff_df = self.repository.get_footfall(store_id=store_id, start_date=start_date, end_date=end_date)
            return compute_footfall(ff_df)

        elif kpi_id == "conversion_rate":
            ff_df = self.repository.get_footfall(store_id=store_id, start_date=start_date, end_date=end_date)
            tx_df = self.repository.get_transactions(store_id=store_id, sku_id=sku_id, start_date=start_date, end_date=end_date)
            return compute_conversion_rate(tx_df, ff_df)

        elif kpi_id == "full_price_sell_through":
            tx_df = self.repository.get_transactions(store_id=store_id, sku_id=sku_id, start_date=start_date, end_date=end_date)
            return compute_full_price_sell_through(tx_df)

        elif kpi_id == "size_curve_fill_rate":
            inv_df = self.repository.get_inventory_snapshots(store_id=store_id, sku_id=sku_id, start_date=start_date, end_date=end_date)
            return compute_size_curve_fill_rate(inv_df)

        elif kpi_id == "size_related_return_rate":
            ret_df = self.repository.get_returns(store_id=store_id, sku_id=sku_id, start_date=start_date, end_date=end_date)
            tx_df = self.repository.get_transactions(store_id=store_id, sku_id=sku_id, start_date=start_date, end_date=end_date)
            total_sold = tx_df["qty"].sum() if not tx_df.empty else 1
            return compute_size_related_return_rate(ret_df, total_sold)

        elif kpi_id == "aov":
            tx_df = self.repository.get_transactions(store_id=store_id, start_date=start_date, end_date=end_date)
            return compute_aov(tx_df)

        elif kpi_id == "upt":
            tx_df = self.repository.get_transactions(store_id=store_id, start_date=start_date, end_date=end_date)
            return compute_upt(tx_df)

        return 0.0
