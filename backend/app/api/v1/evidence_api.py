"""
Evidence Object API Endpoint (L3 Service).
GET /api/v1/evidence
"""
import time
from typing import Optional
from fastapi import APIRouter, Depends, Query, Request, HTTPException
from app.schemas.evidence import EvidenceObject
from app.l3_rca.pipeline import RCAPipeline
from app.core.security import enforce_persona_access
from app.core.telemetry import global_telemetry

router = APIRouter(prefix="/evidence", tags=["Evidence"])


def get_rca_pipeline(request: Request) -> RCAPipeline:
    return request.app.state.rca_pipeline


@router.get("", response_model=EvidenceObject)
def get_evidence(
    kpi: str = Query("conversion_rate", description="Target KPI ID"),
    store_id: str = Query("STORE-014", description="Store ID"),
    period: str = Query("2026-W33", description="Reporting period (e.g. 2026-W33)"),
    region: str = Query("West", description="Store Region"),
    scenario: Optional[str] = Query(None, description="Inject scenario override: 'hero', 'abstention', 'sparse'"),
    user_role: str = Query("store_manager", description="Current user persona for access enforcement"),
    assigned_store: str = Query("STORE-014", description="Assigned store for store_manager"),
    pipeline: RCAPipeline = Depends(get_rca_pipeline)
):
    """
    Executes the 4-stage RCA pipeline and returns the frozen Evidence Object contract.
    Enforces server-side role-based authorization.
    """
    start_time = time.time()

    # Enforce server-side security
    enforce_persona_access(
        user_role=user_role,
        target_store_id=store_id,
        target_region=region,
        assigned_store_id=assigned_store,
        assigned_region="West"
    )

    evidence = pipeline.run_rca(
        kpi_id=kpi,
        store_id=store_id,
        period=period,
        region=region,
        scenario_override=scenario
    )

    elapsed_ms = (time.time() - start_time) * 1000
    global_telemetry.record_query(
        endpoint="/api/v1/evidence",
        latency_ms=elapsed_ms,
        prompt_tokens=0,
        completion_tokens=0,
        cost_usd=0.0,
        model_name="deterministic_rca_engine"
    )

    return evidence
