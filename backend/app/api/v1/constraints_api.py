"""
Known Constraints API Endpoints.
CRUD endpoints for known constraints affecting RCA action feasibility.
"""
import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Request, HTTPException
from app.schemas.constraints import KnownConstraint
from app.l1_data.repository import IDataRepository

router = APIRouter(prefix="/constraints", tags=["Constraints"])


def get_repository(request: Request) -> IDataRepository:
    return request.app.state.repository


@router.get("", response_model=List[Dict[str, Any]])
def list_constraints(repo: IDataRepository = Depends(get_repository)):
    """Fetch active known constraints."""
    return repo.get_known_constraints(active_only=True)


@router.post("", response_model=Dict[str, Any])
def create_constraint(
    constraint: KnownConstraint,
    repo: IDataRepository = Depends(get_repository)
):
    """Create and persist a new user constraint (e.g. logistics air-freight freeze)."""
    if not constraint.id:
        constraint.id = f"CON-{uuid.uuid4().hex[:6].upper()}"

    repo.save_known_constraint(constraint.model_dump())
    return {"status": "SUCCESS", "constraint": constraint}


@router.delete("/{constraint_id}")
def delete_constraint(
    constraint_id: str,
    repo: IDataRepository = Depends(get_repository)
):
    """Deactivate or remove a constraint."""
    repo.conn.execute("UPDATE known_constraints SET active = FALSE WHERE id = ?", [constraint_id])
    return {"status": "DELETED", "id": constraint_id}
