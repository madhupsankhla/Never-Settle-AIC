"""
Frozen Evidence Object API Contract between L3 (RCA Engine) and L4 (AI Insights Layer).
Section 5 Frozen Contract.
"""
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class Segment(BaseModel):
    store_id: Optional[str] = None
    region: Optional[str] = None
    network: Optional[str] = "All Stores"


class FootfallStatus(BaseModel):
    change_pct: float
    is_material: bool


class DecompositionNode(BaseModel):
    level: str  # "store", "sku", "size", etc.
    node: str   # e.g., "STORE-014", "SKU-1042", "Size 9"
    contribution_pct: float
    parent_node: Optional[str] = None


class Hypothesis(BaseModel):
    driver: str
    domain: str
    confidence: float
    tier: str  # "HIGH", "MEDIUM", "LOW"
    precedence: bool
    dose_response: float
    corroboration: Optional[str] = None
    detail: Optional[str] = None
    chart_data: Optional[Dict[str, Any]] = None  # Scatter/cross-correlation raw points for Evidence Explorer


class TopRankedAction(BaseModel):
    driver: str
    lever: str
    action: str
    expected_impact: str  # e.g., "+₹1,85,000 est. weekly recovery"
    estimated_recovery_val: Optional[float] = 0.0
    owner: str
    confidence: str  # "HIGH", "MEDIUM", "LOW"
    monitoring_plan: str
    feasibility_status: Optional[str] = "FEASIBLE"
    feasibility_notes: Optional[str] = None


class DataFreshness(BaseModel):
    pos: str
    inventory: str
    mystery_shopper: str


class EvidenceObject(BaseModel):
    evidence_id: Optional[str] = None
    kpi: str
    segment: Segment
    period: str
    footfall_status: FootfallStatus
    change_pct: float
    is_material: bool
    decomposition: List[DecompositionNode] = Field(default_factory=list)
    hypotheses: List[Hypothesis] = Field(default_factory=list)
    top_ranked_action: Optional[TopRankedAction] = None
    data_freshness: DataFreshness
    known_user_constraints_applied: List[str] = Field(default_factory=list)
    abstain: bool = False
    abstain_reason: Optional[str] = None
    is_sparse_history: Optional[bool] = False
