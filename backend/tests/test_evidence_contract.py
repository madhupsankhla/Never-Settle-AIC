"""
Tests for Evidence Contract Pydantic Schema and Persona Access Security.
"""
import pytest
from fastapi import HTTPException
from app.schemas.evidence import EvidenceObject
from app.core.security import enforce_persona_access
from app.l1_data.duckdb_repo import DuckDBRepository
from app.l1_data.synthetic_generator import SyntheticDataGenerator
from app.l2_kpi.engine import KPIEngine
from app.l3_rca.pipeline import RCAPipeline


def test_evidence_contract_validation():
    repo = DuckDBRepository()
    gen = SyntheticDataGenerator(seed=42)
    tables = gen.generate_all()
    for name, df in tables.items():
        repo.register_dataframe(name, df)

    kpi_engine = KPIEngine(config_dir="config/kpis", repository=repo)
    pipeline = RCAPipeline(repository=repo, kpi_engine=kpi_engine)

    evidence = pipeline.run_rca(store_id="STORE-014")

    # Serialize and re-validate against strict Pydantic model
    json_data = evidence.model_dump_json()
    reloaded = EvidenceObject.model_validate_json(json_data)

    assert reloaded.kpi == "conversion_rate"
    assert reloaded.segment.store_id == "STORE-014"
    assert reloaded.data_freshness.pos is not None


def test_server_side_security_enforcement():
    # Store Manager for STORE-014 should be able to access STORE-014
    assert enforce_persona_access(
        user_role="store_manager",
        target_store_id="STORE-014",
        assigned_store_id="STORE-014"
    ) is True

    # Store Manager for STORE-014 MUST be denied access (403) to STORE-001
    with pytest.raises(HTTPException) as exc_info:
        enforce_persona_access(
            user_role="store_manager",
            target_store_id="STORE-001",
            assigned_store_id="STORE-014"
        )
    assert exc_info.value.status_code == 403
    assert "cannot view data for 'STORE-001'" in exc_info.value.detail

    # CFO has unrestricted access
    assert enforce_persona_access(
        user_role="cfo_finance",
        target_store_id="STORE-001"
    ) is True
