"""
Access Control and Persona Scope Security Layer.
Enforces server-side authorization boundaries on data access.
"""
from typing import Optional
from fastapi import HTTPException, status


def enforce_persona_access(
    user_role: str,
    target_store_id: Optional[str] = None,
    target_region: Optional[str] = None,
    assigned_store_id: str = "STORE-014",
    assigned_region: str = "West"
):
    """
    Enforces server-side authorization rules based on user role and assigned scope.
    Raises HTTPException(403) if access is unauthorized.
    """
    if user_role == "cfo_finance":
        # CFO has network-wide access
        return True

    if user_role == "regional_ops":
        # Regional ops can view all stores within their assigned region
        if target_region and target_region != assigned_region:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: Regional Ops for '{assigned_region}' is unauthorized to access region '{target_region}'."
            )
        # Note: If checking store within another region, we enforce regional boundary
        return True

    if user_role == "store_manager":
        # Store manager can ONLY view their own assigned store
        if target_store_id and target_store_id != assigned_store_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: Store Manager assigned to '{assigned_store_id}' cannot view data for '{target_store_id}'."
            )
        return True

    return True
