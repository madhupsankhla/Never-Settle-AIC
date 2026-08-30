"""
Tests for KPI Engine and Semantic Layer.
"""
from app.l1_data.duckdb_repo import DuckDBRepository
from app.l1_data.synthetic_generator import SyntheticDataGenerator
from app.l2_kpi.engine import KPIEngine
from app.l2_kpi.lineage import get_kpi_lineage


def test_kpi_engine_loading_and_computation():
    repo = DuckDBRepository()
    gen = SyntheticDataGenerator(seed=42)
    tables = gen.generate_all()
    for name, df in tables.items():
        repo.register_dataframe(name, df)

    engine = KPIEngine(config_dir="config/kpis", repository=repo)

    # Check contracts loaded from YAML
    assert "conversion_rate" in engine.contracts
    assert "footfall" in engine.contracts

    # Compute conversion rate for STORE-014
    cr = engine.compute_kpi_for_segment(
        kpi_id="conversion_rate",
        store_id="STORE-014",
        start_date="2026-08-01",
        end_date="2026-08-15"
    )
    assert 10.0 <= cr <= 25.0

    # Lineage check
    lineage = get_kpi_lineage("conversion_rate")
    assert lineage["parent"] == "revenue"
    assert "size_curve_stockout" in lineage["drivers"]
