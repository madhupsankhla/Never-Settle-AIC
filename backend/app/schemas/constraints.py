"""
Known User Constraints Schemas.
"""
from typing import Optional
from datetime import date
from pydantic import BaseModel


class KnownConstraint(BaseModel):
    id: str
    description: str  # e.g., "Air freight freeze for West region" or "Max promotional discount 15%"
    constraint_type: str  # "budget", "logistics_channel", "discount_cap", "lead_time_override"
    scope_region: Optional[str] = None
    scope_store_id: Optional[str] = None
    scope_category: Optional[str] = None
    value: Optional[float] = None
    effective_start: str
    effective_end: str
    created_by: str = "user"
    active: bool = True
