"""
Abstract Data Repository Interface.
Extension point: Any new database (Postgres, ClickHouse, Snowflake) or external live API
implements this interface, leaving L2-L5 completely untouched.
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Optional, Any
import pandas as pd


class IDataRepository(ABC):
    """
    Abstract contract for SoleSight Data Layer (L1).
    All KPI computation (L2) and RCA pipelines (L3) consume data through this repository.
    """

    @abstractmethod
    def query(self, sql: str, params: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        """Execute raw SQL query against the store data engine."""
        pass

    @abstractmethod
    def get_table(self, table_name: str) -> pd.DataFrame:
        """Fetch entire table or view as a pandas DataFrame."""
        pass

    @abstractmethod
    def get_stores(self, region: Optional[str] = None) -> pd.DataFrame:
        """Fetch dim_store records, optionally filtered by region."""
        pass

    @abstractmethod
    def get_products(self, category: Optional[str] = None) -> pd.DataFrame:
        """Fetch dim_product records."""
        pass

    @abstractmethod
    def get_footfall(
        self,
        store_id: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> pd.DataFrame:
        """Fetch footfall sensor entries."""
        pass

    @abstractmethod
    def get_transactions(
        self,
        store_id: Optional[str] = None,
        sku_id: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> pd.DataFrame:
        """Fetch POS transaction records."""
        pass

    @abstractmethod
    def get_inventory_snapshots(
        self,
        store_id: Optional[str] = None,
        sku_id: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> pd.DataFrame:
        """Fetch weekly inventory snapshots (with ~2-day deliberate refresh lag)."""
        pass

    @abstractmethod
    def get_staff_schedules(
        self,
        store_id: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> pd.DataFrame:
        """Fetch staff schedules and training completion."""
        pass

    @abstractmethod
    def get_returns(
        self,
        store_id: Optional[str] = None,
        sku_id: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> pd.DataFrame:
        """Fetch customer return records."""
        pass

    @abstractmethod
    def get_mystery_shopper_audits(
        self,
        store_id: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> pd.DataFrame:
        """Fetch monthly mystery shopper audits."""
        pass

    @abstractmethod
    def get_purchase_orders(
        self,
        store_id: Optional[str] = None,
        sku_id: Optional[str] = None
    ) -> pd.DataFrame:
        """Fetch POs and supplier delivery records."""
        pass

    @abstractmethod
    def get_external_table(self, source_name: str) -> pd.DataFrame:
        """Fetch Tier 2 external table (ext_weather, ext_competitor_pricing, etc.)."""
        pass

    @abstractmethod
    def insert_feedback(self, feedback_data: Dict[str, Any]) -> bool:
        """Log user feedback on hypotheses."""
        pass

    @abstractmethod
    def get_feedback_logs(self) -> List[Dict[str, Any]]:
        """Retrieve feedback log entries."""
        pass

    @abstractmethod
    def get_known_constraints(self, active_only: bool = True) -> List[Dict[str, Any]]:
        """Fetch known user constraints."""
        pass

    @abstractmethod
    def save_known_constraint(self, constraint: Dict[str, Any]) -> bool:
        """Persist a known user constraint."""
        pass
