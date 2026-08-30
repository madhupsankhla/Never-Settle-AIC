"""
DuckDB implementation of IDataRepository.
High-speed in-process OLAP engine supporting all Tier 1 and Tier 2 tables.
"""
from typing import Dict, List, Optional, Any
import duckdb
import pandas as pd
from app.l1_data.repository import IDataRepository
from app.l1_data.as_of_join import as_of_join


class DuckDBRepository(IDataRepository):
    """
    DuckDB backed repository implementation.
    Thread-safe connection with fast in-memory or file-backed storage.
    """

    def __init__(self, db_path: str = ":memory:"):
        self.db_path = db_path
        self.conn = duckdb.connect(database=db_path, read_only=False)
        self._init_metadata_tables()

    def _init_metadata_tables(self):
        """Create storage for cross-cutting telemetry, constraints, and feedback."""
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS feedback_log (
                evidence_id VARCHAR,
                hypothesis_driver VARCHAR,
                verdict VARCHAR,
                correction_text VARCHAR,
                user_role VARCHAR,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS known_constraints (
                id VARCHAR PRIMARY KEY,
                description VARCHAR,
                constraint_type VARCHAR,
                scope_region VARCHAR,
                scope_store_id VARCHAR,
                scope_category VARCHAR,
                value DOUBLE,
                effective_start VARCHAR,
                effective_end VARCHAR,
                created_by VARCHAR,
                active BOOLEAN DEFAULT TRUE
            );
        """)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS access_audit_log (
                user_id VARCHAR,
                user_role VARCHAR,
                action VARCHAR,
                target_store VARCHAR,
                target_kpi VARCHAR,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

    def register_dataframe(self, table_name: str, df: pd.DataFrame):
        """Register or replace a pandas DataFrame as a DuckDB table."""
        self.conn.register(f"df_{table_name}", df)
        self.conn.execute(f"CREATE OR REPLACE TABLE {table_name} AS SELECT * FROM df_{table_name}")

    def query(self, sql: str, params: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        if params:
            return self.conn.execute(sql, params).df()
        return self.conn.execute(sql).df()

    def get_table(self, table_name: str) -> pd.DataFrame:
        try:
            return self.conn.execute(f"SELECT * FROM {table_name}").df()
        except Exception:
            return pd.DataFrame()

    def get_stores(self, region: Optional[str] = None) -> pd.DataFrame:
        sql = "SELECT * FROM dim_store"
        if region:
            sql += f" WHERE region = '{region}'"
        return self.query(sql)

    def get_products(self, category: Optional[str] = None) -> pd.DataFrame:
        sql = "SELECT * FROM dim_product"
        if category:
            sql += f" WHERE category = '{category}'"
        return self.query(sql)

    def get_footfall(
        self,
        store_id: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> pd.DataFrame:
        sql = "SELECT * FROM fact_footfall WHERE 1=1"
        if store_id:
            sql += f" AND store_id = '{store_id}'"
        if start_date:
            sql += f" AND date >= '{start_date}'"
        if end_date:
            sql += f" AND date <= '{end_date}'"
        return self.query(sql)

    def get_transactions(
        self,
        store_id: Optional[str] = None,
        sku_id: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> pd.DataFrame:
        sql = "SELECT * FROM fact_transactions WHERE 1=1"
        if store_id:
            sql += f" AND store_id = '{store_id}'"
        if sku_id:
            sql += f" AND sku_id = '{sku_id}'"
        if start_date:
            sql += f" AND CAST(date_time AS DATE) >= '{start_date}'"
        if end_date:
            sql += f" AND CAST(date_time AS DATE) <= '{end_date}'"
        return self.query(sql)

    def get_inventory_snapshots(
        self,
        store_id: Optional[str] = None,
        sku_id: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> pd.DataFrame:
        sql = "SELECT * FROM fact_inventory_snapshot WHERE 1=1"
        if store_id:
            sql += f" AND store_id = '{store_id}'"
        if sku_id:
            sql += f" AND sku_id = '{sku_id}'"
        if start_date:
            sql += f" AND snapshot_date >= '{start_date}'"
        if end_date:
            sql += f" AND snapshot_date <= '{end_date}'"
        return self.query(sql)

    def get_staff_schedules(
        self,
        store_id: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> pd.DataFrame:
        sql = """
            SELECT s.*, st.role, st.tenure_days, s.training_completion_flag
            FROM fact_staff_schedule s
            LEFT JOIN dim_staff st ON s.staff_id = st.staff_id
            WHERE 1=1
        """
        if store_id:
            sql += f" AND s.store_id = '{store_id}'"
        if start_date:
            sql += f" AND s.date >= '{start_date}'"
        if end_date:
            sql += f" AND s.date <= '{end_date}'"
        return self.query(sql)

    def get_returns(
        self,
        store_id: Optional[str] = None,
        sku_id: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> pd.DataFrame:
        sql = "SELECT * FROM fact_returns WHERE 1=1"
        if store_id:
            sql += f" AND store_id = '{store_id}'"
        if sku_id:
            sql += f" AND sku_id = '{sku_id}'"
        if start_date:
            sql += f" AND date >= '{start_date}'"
        if end_date:
            sql += f" AND date <= '{end_date}'"
        return self.query(sql)

    def get_mystery_shopper_audits(
        self,
        store_id: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> pd.DataFrame:
        sql = "SELECT * FROM fact_mystery_shopper WHERE 1=1"
        if store_id:
            sql += f" AND store_id = '{store_id}'"
        if start_date:
            sql += f" AND date >= '{start_date}'"
        if end_date:
            sql += f" AND date <= '{end_date}'"
        return self.query(sql)

    def get_purchase_orders(
        self,
        store_id: Optional[str] = None,
        sku_id: Optional[str] = None
    ) -> pd.DataFrame:
        sql = "SELECT * FROM fact_purchase_orders WHERE 1=1"
        if store_id:
            sql += f" AND store_id = '{store_id}'"
        if sku_id:
            sql += f" AND sku_id = '{sku_id}'"
        return self.query(sql)

    def get_external_table(self, source_name: str) -> pd.DataFrame:
        return self.get_table(source_name)

    def get_campaigns(
        self,
        scope: Optional[str] = None,
        region: Optional[str] = None,
        channel: Optional[str] = None
    ) -> pd.DataFrame:
        sql = "SELECT * FROM fact_campaigns WHERE 1=1"
        if scope:
            sql += f" AND scope = '{scope}'"
        if region:
            sql += f" AND (region = '{region}' OR region = 'National' OR region IS NULL)"
        if channel:
            sql += f" AND channel = '{channel}'"
        return self.query(sql)

    def get_reviews(
        self,
        store_id: Optional[str] = None,
        sku_id: Optional[str] = None,
        sentiment: Optional[str] = None
    ) -> pd.DataFrame:
        sql = "SELECT * FROM fact_reviews WHERE 1=1"
        if store_id:
            sql += f" AND store_id = '{store_id}'"
        if sku_id:
            sql += f" AND sku_id = '{sku_id}'"
        if sentiment:
            sql += f" AND sentiment = '{sentiment}'"
        return self.query(sql)

    def insert_feedback(self, feedback_data: Dict[str, Any]) -> bool:
        self.conn.execute("""
            INSERT INTO feedback_log (evidence_id, hypothesis_driver, verdict, correction_text, user_role)
            VALUES (?, ?, ?, ?, ?)
        """, [
            feedback_data.get("evidence_id"),
            feedback_data.get("hypothesis_driver"),
            feedback_data.get("verdict"),
            feedback_data.get("correction_text"),
            feedback_data.get("user_role")
        ])
        return True

    def get_feedback_logs(self) -> List[Dict[str, Any]]:
        df = self.query("SELECT * FROM feedback_log ORDER BY timestamp DESC")
        return df.to_dict(orient="records")

    def get_known_constraints(self, active_only: bool = True) -> List[Dict[str, Any]]:
        sql = "SELECT * FROM known_constraints"
        if active_only:
            sql += " WHERE active = TRUE"
        df = self.query(sql)
        return df.to_dict(orient="records")

    def save_known_constraint(self, constraint: Dict[str, Any]) -> bool:
        self.conn.execute("""
            INSERT OR REPLACE INTO known_constraints 
            (id, description, constraint_type, scope_region, scope_store_id, scope_category, value, effective_start, effective_end, created_by, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, [
            constraint.get("id"),
            constraint.get("description"),
            constraint.get("constraint_type"),
            constraint.get("scope_region"),
            constraint.get("scope_store_id"),
            constraint.get("scope_category"),
            constraint.get("value"),
            constraint.get("effective_start"),
            constraint.get("effective_end"),
            constraint.get("created_by", "user"),
            constraint.get("active", True)
        ])
        return True

    def delete_known_constraint(self, constraint_id: str) -> bool:
        """Delete a constraint by id."""
        self.conn.execute("DELETE FROM known_constraints WHERE id = ?", [constraint_id])
        return True

    # ── Correlation-Engine Data Access Methods ───────────────────────────

    def get_weekly_conversion_series(
        self,
        store_id: str,
        start_date: str = None,
        end_date: str = None
    ) -> pd.DataFrame:
        """
        Compute weekly conversion rate for a store:
        conversion_rate = COUNT(transactions) / SUM(footfall)
        Returns: iso_year, iso_week, week_start, footfall, tx_count, conversion_rate
        """
        date_filter = ""
        if start_date:
            date_filter += f" AND ff.date >= '{start_date}'"
        if end_date:
            date_filter += f" AND ff.date <= '{end_date}'"

        sql = f"""
            WITH weekly_ff AS (
                SELECT
                    EXTRACT(ISOYEAR FROM CAST(date AS DATE)) AS iso_year,
                    EXTRACT(WEEK FROM CAST(date AS DATE)) AS iso_week,
                    MIN(CAST(date AS DATE)) AS week_start,
                    SUM(entries_count) AS footfall
                FROM fact_footfall ff
                WHERE ff.store_id = '{store_id}' {date_filter}
                GROUP BY 1, 2
            ),
            weekly_tx AS (
                SELECT
                    EXTRACT(ISOYEAR FROM CAST(date_time AS DATE)) AS iso_year,
                    EXTRACT(WEEK FROM CAST(date_time AS DATE)) AS iso_week,
                    COUNT(*) AS tx_count
                FROM fact_transactions
                WHERE store_id = '{store_id}'
                GROUP BY 1, 2
            )
            SELECT
                wf.iso_year,
                wf.iso_week,
                wf.week_start,
                wf.footfall,
                COALESCE(wt.tx_count, 0) AS tx_count,
                CASE WHEN wf.footfall > 0
                     THEN CAST(COALESCE(wt.tx_count, 0) AS DOUBLE) / wf.footfall
                     ELSE 0 END AS conversion_rate
            FROM weekly_ff wf
            LEFT JOIN weekly_tx wt
              ON wf.iso_year = wt.iso_year AND wf.iso_week = wt.iso_week
            ORDER BY wf.iso_year, wf.iso_week
        """
        return self.query(sql)

    def get_weekly_fill_rate(
        self,
        store_id: str,
        sku_id: str,
        sizes: list = None,
        start_date: str = None,
        end_date: str = None
    ) -> pd.DataFrame:
        """
        Weekly inventory fill-rate for a specific SKU and sizes.
        Returns: iso_year, iso_week, avg_units_on_hand
        """
        size_filter = ""
        if sizes:
            quoted = ", ".join(f"'{s}'" for s in sizes)
            size_filter = f" AND size IN ({quoted})"
        date_filter = ""
        if start_date:
            date_filter += f" AND snapshot_date >= '{start_date}'"
        if end_date:
            date_filter += f" AND snapshot_date <= '{end_date}'"

        sql = f"""
            SELECT
                EXTRACT(ISOYEAR FROM CAST(snapshot_date AS DATE)) AS iso_year,
                EXTRACT(WEEK FROM CAST(snapshot_date AS DATE)) AS iso_week,
                AVG(on_hand_units) AS avg_units_on_hand,
                SUM(CASE WHEN is_stockout THEN 1 ELSE 0 END) AS stockout_count,
                COUNT(*) AS total_size_slots
            FROM fact_inventory_snapshot
            WHERE store_id = '{store_id}'
              AND sku_id = '{sku_id}'
              {size_filter} {date_filter}
            GROUP BY 1, 2
            ORDER BY 1, 2
        """
        return self.query(sql)

    def get_monthly_staff_training_pct(
        self,
        store_id: str = None
    ) -> pd.DataFrame:
        """
        Monthly pct_hours_by_untrained_staff per store.
        Uses fact_staff_schedule (monthly grain: store_id, staff_id, month, hours_worked, training_completion_flag).
        """
        store_filter = f"WHERE store_id = '{store_id}'" if store_id else ""

        sql = f"""
            SELECT
                store_id,
                month,
                SUM(hours_worked) AS total_hours,
                SUM(CASE WHEN training_completion_flag = false THEN hours_worked ELSE 0 END) AS untrained_hours,
                CASE WHEN SUM(hours_worked) > 0
                     THEN CAST(SUM(CASE WHEN training_completion_flag = false THEN hours_worked ELSE 0 END) AS DOUBLE) / SUM(hours_worked)
                     ELSE 0 END AS pct_hours_by_untrained_staff
            FROM fact_staff_schedule
            {store_filter}
            GROUP BY store_id, month
            ORDER BY store_id, month
        """
        return self.query(sql)

    def get_weekly_returns(
        self,
        store_id: str = None,
        sku_id: str = None,
        start_date: str = None,
        end_date: str = None
    ) -> pd.DataFrame:
        """
        Weekly return counts and breakdown by reason.
        """
        filters = "WHERE 1=1"
        if store_id:
            filters += f" AND store_id = '{store_id}'"
        if sku_id:
            filters += f" AND sku_id = '{sku_id}'"
        if start_date:
            filters += f" AND date >= '{start_date}'"
        if end_date:
            filters += f" AND date <= '{end_date}'"

        sql = f"""
            SELECT
                EXTRACT(ISOYEAR FROM CAST(date AS DATE)) AS iso_year,
                EXTRACT(WEEK FROM CAST(date AS DATE)) AS iso_week,
                MIN(CAST(date AS DATE)) AS week_start,
                COUNT(*) AS return_count,
                SUM(CASE WHEN return_reason_code IN ('wrong_size', 'FIT_TOO_SMALL', 'FIT_TOO_LARGE', 'WRONG_SIZE')
                         THEN 1 ELSE 0 END) AS size_related_returns
            FROM fact_returns
            {filters}
            GROUP BY 1, 2
            ORDER BY 1, 2
        """
        return self.query(sql)

