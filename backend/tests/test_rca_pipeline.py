"""
Tests for 4-Stage RCA Pipeline & Hero Scenario with 6-Month Dataset.
"""
from pathlib import Path
from app.l1_data.duckdb_repo import DuckDBRepository
from app.l1_data.excel_loader import load_excel_dataset
from app.l2_kpi.engine import KPIEngine
from app.l3_rca.pipeline import RCAPipeline

DATASET_FILE = Path(__file__).resolve().parent.parent.parent / "SoleSight-Synthetic-Dataset-6mo.xlsx"


def test_rca_pipeline_hero_scenario():
    repo = DuckDBRepository()
    tables = load_excel_dataset(str(DATASET_FILE))
    for name, df in tables.items():
        repo.register_dataframe(name, df)

    kpi_engine = KPIEngine(config_dir="config/kpis", repository=repo)
    pipeline = RCAPipeline(repository=repo, kpi_engine=kpi_engine)

    evidence = pipeline.run_rca(
        kpi_id="conversion_rate",
        store_id="STORE-001",
        period="2026-W23",
        region="West"
    )

    # 1. Hypotheses generated
    assert len(evidence.hypotheses) >= 2
    top_h = evidence.hypotheses[0]
    assert top_h.driver == "size_curve_stockout"
    assert top_h.tier == "HIGH"
    assert top_h.confidence >= 0.75

    second_h = evidence.hypotheses[1]
    assert second_h.driver == "staff_training_deficit"

    # 2. Action: Synthesized action exists for top driver
    assert evidence.top_ranked_action is not None
    assert evidence.top_ranked_action.confidence == "HIGH"
    assert evidence.abstain is False
