"""
KPI and Metric Contract schemas.
"""
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class KPIGrain(BaseModel):
    native_cadence: str
    allowed_aggregations: List[str]
    hierarchy_keys: List[str]
    item_breakdown_keys: List[str] = Field(default_factory=list)


class KPIDriver(BaseModel):
    id: str
    name: str
    domain: str
    data_source: str
    metric: Optional[str] = None
    statistical_method: str
    max_confidence_tier: Optional[str] = None
    evaluation_rules: Optional[Dict[str, Any]] = None
    confidence_rules: Optional[Dict[str, Any]] = None
    suggested_action: Optional[Dict[str, Any]] = None


class KPIThresholds(BaseModel):
    baseline_lookback_periods: int = 8
    z_score_cutoff: float = 2.0
    absolute_materiality_floor_pct: float = 5.0


class KPIContract(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    definition: Optional[str] = None
    version: str = "1.0.0"
    owner_persona: Optional[str] = None
    calculation: Optional[Dict[str, Any]] = None
    grain: KPIGrain
    computation: Optional[Dict[str, Any]] = None
    lineage: Dict[str, Any]
    drivers: List[KPIDriver] = Field(default_factory=list)
    thresholds: KPIThresholds = Field(default_factory=KPIThresholds)
    access_control: Optional[Dict[str, Any]] = None
