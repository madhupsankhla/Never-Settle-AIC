"""
Feedback Loop and Telemetry API Endpoints.
"""
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Request
from app.schemas.narrative import FeedbackItem
from app.l1_data.repository import IDataRepository
from app.core.telemetry import global_telemetry

feedback_router = APIRouter(prefix="/feedback", tags=["Feedback"])
telemetry_router = APIRouter(prefix="/telemetry", tags=["Telemetry"])


def get_repository(request: Request) -> IDataRepository:
    return request.app.state.repository


@feedback_router.post("")
def record_feedback(
    item: FeedbackItem,
    repo: IDataRepository = Depends(get_repository)
):
    """
    Log user feedback verdict (thumbs up/down) + optional correction text
    tagged to a specific hypothesis driver.
    """
    repo.insert_feedback(item.model_dump())
    return {"status": "RECORDED", "feedback": item}


@feedback_router.get("")
def list_feedback(repo: IDataRepository = Depends(get_repository)):
    """Retrieve logged feedback items."""
    return repo.get_feedback_logs()


@telemetry_router.get("")
def get_telemetry_stats():
    """Retrieve live latency, token usage, cost, and query counts."""
    return global_telemetry.get_summary()
