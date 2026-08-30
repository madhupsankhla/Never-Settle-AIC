"""
Narrative Generation Endpoint (L4 Service).
POST /api/v1/narrative
"""
import time
from fastapi import APIRouter, Depends, Request
from app.schemas.narrative import NarrativeRequest, NarrativeResponse
from app.l4_ai_insights.engine import AIInsightsEngine
from app.core.telemetry import global_telemetry

router = APIRouter(prefix="/narrative", tags=["Narrative"])


def get_ai_engine(request: Request) -> AIInsightsEngine:
    return request.app.state.ai_engine


@router.post("", response_model=NarrativeResponse)
def generate_narrative(
    req: NarrativeRequest,
    engine: AIInsightsEngine = Depends(get_ai_engine)
):
    """
    Synthesizes persona-tailored narrative with inline evidence citations.
    Evaluates hardcoded abstention gate before generation.
    """
    start_time = time.time()
    response = engine.generate_narrative(evidence=req.evidence, persona=req.persona)

    elapsed_ms = (time.time() - start_time) * 1000
    telemetry = response.telemetry

    global_telemetry.record_query(
        endpoint="/api/v1/narrative",
        latency_ms=elapsed_ms,
        prompt_tokens=telemetry.get("prompt_tokens", 0),
        completion_tokens=telemetry.get("completion_tokens", 0),
        cost_usd=telemetry.get("total_cost_usd", 0.0),
        model_name=telemetry.get("model", "abstention_gate")
    )

    return response
