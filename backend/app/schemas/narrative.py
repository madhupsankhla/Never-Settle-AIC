"""
Narrative Request/Response, Persona Definition, and Feedback Schemas.
"""
from typing import Dict, List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.evidence import EvidenceObject


class InlineEvidenceTag(BaseModel):
    tag_text: str  # e.g., "[driver: size_curve_stockout, confidence: HIGH]"
    driver: str
    confidence: str
    precedence: Optional[bool] = None
    dose_response: Optional[float] = None
    corroboration: Optional[str] = None


class NarrativeRequest(BaseModel):
    evidence: EvidenceObject
    persona: str  # "store_manager", "regional_ops", "cfo_finance"
    user_id: Optional[str] = "user_demo"


class NarrativeResponse(BaseModel):
    narrative_id: str
    persona: str
    title: str
    headline: str
    summary_paragraphs: List[str]
    inline_tags: List[InlineEvidenceTag] = Field(default_factory=list)
    action_callout: Optional[Dict[str, Any]] = None
    is_abstention: bool = False
    abstention_reason: Optional[str] = None
    telemetry: Dict[str, Any] = Field(default_factory=dict)
    cached: bool = False
    evidence_hash: str


class FeedbackItem(BaseModel):
    evidence_id: str
    hypothesis_driver: str
    verdict: str  # "upvote", "downvote"
    correction_text: Optional[str] = None
    user_role: str
    timestamp: Optional[str] = None
