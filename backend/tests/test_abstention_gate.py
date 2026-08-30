"""
Tests for Hardcoded Abstention Gate and Contradictory Scenario.
"""
from app.l1_data.duckdb_repo import DuckDBRepository
from app.l1_data.synthetic_generator import SyntheticDataGenerator
from app.l2_kpi.engine import KPIEngine
from app.l3_rca.pipeline import RCAPipeline
from app.l4_ai_insights.engine import AIInsightsEngine


def test_abstention_gate_on_contradictory_scenario():
    repo = DuckDBRepository()
    gen = SyntheticDataGenerator(seed=42)
    tables = gen.generate_all()
    for name, df in tables.items():
        repo.register_dataframe(name, df)

    kpi_engine = KPIEngine(config_dir="config/kpis", repository=repo)
    pipeline = RCAPipeline(repository=repo, kpi_engine=kpi_engine)
    ai_engine = AIInsightsEngine()

    # Run contradictory scenario on STORE-003
    evidence = pipeline.run_rca(
        kpi_id="conversion_rate",
        store_id="STORE-003",
        period="2026-W33",
        region="North",
        scenario_override="abstention"
    )

    # Hardcoded gate in L3 must set abstain = True
    assert evidence.abstain is True
    assert evidence.abstain_reason is not None
    assert evidence.top_ranked_action is None

    # L4 narrative generator must return abstention template and bypass LLM guessing
    narrative = ai_engine.generate_narrative(evidence=evidence, persona="store_manager")
    assert narrative.is_abstention is True
    assert "Clarification Required" in narrative.headline
    assert narrative.action_callout.get("status") == "ABSTAINED"
