"""
KPI & Org Tree Catalog Endpoints.
"""
from typing import Dict, List, Any
from fastapi import APIRouter, Depends, Request
from app.l2_kpi.engine import KPIEngine
from app.l2_kpi.lineage import MASTER_DECOMPOSITION, get_kpi_lineage
from app.l1_data.repository import IDataRepository

router = APIRouter(prefix="/kpis", tags=["KPIs"])


def get_kpi_engine(request: Request) -> KPIEngine:
    return request.app.state.kpi_engine


def get_repository(request: Request) -> IDataRepository:
    return request.app.state.repository


@router.get("")
def list_kpis(engine: KPIEngine = Depends(get_kpi_engine)):
    """List all registered KPI contracts from YAML definitions."""
    return engine.list_kpis()


@router.get("/lineage/{kpi_id}")
def get_lineage(kpi_id: str):
    """Retrieve upstream parents and downstream drivers for a KPI."""
    return get_kpi_lineage(kpi_id)


@router.get("/master-decomposition")
def get_master_tree():
    """Retrieve full master equation decomposition tree."""
    return MASTER_DECOMPOSITION


@router.get("/org-tree")
def get_org_tree(repo: IDataRepository = Depends(get_repository)):
    """Retrieve store organizational hierarchy: Network -> Region -> Store -> Products."""
    stores_df = repo.get_stores()
    products_df = repo.get_products()

    regions: Dict[str, List[Dict[str, Any]]] = {}
    for _, s in stores_df.iterrows():
        reg = s["region"]
        if reg not in regions:
            regions[reg] = []
        regions[reg].append({
            "store_id": s["store_id"],
            "city_tier": s["city_tier"],
            "format": s["format"],
            "opening_date": str(s["opening_date"])
        })

    products = [
        {
            "sku_id": p["sku_id"],
            "style_name": p["style_name"],
            "category": p["category"],
            "list_price": p["list_price"]
        }
        for _, p in products_df.iterrows()
    ]

    return {
        "network": "SoleSight Footwear Retail",
        "regions": regions,
        "products": products
    }
