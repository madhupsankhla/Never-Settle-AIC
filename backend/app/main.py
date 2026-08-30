"""
SoleSight Backend Application Entrypoint.
FastAPI + DuckDB + RCA Pipeline + AI Insights Layer.

Data source: SoleSight-Synthetic-Dataset-6mo.xlsx (6 months, 8 stores, 26 SKUs).
Falls back to SyntheticDataGenerator if the Excel file is not found.
"""
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.l1_data.duckdb_repo import DuckDBRepository
from app.l1_data.excel_loader import load_excel_dataset
from app.l2_kpi.engine import KPIEngine
from app.l3_rca.pipeline import RCAPipeline
from app.l4_ai_insights.engine import AIInsightsEngine

from app.api.v1.evidence_api import router as evidence_router
from app.api.v1.narrative_api import router as narrative_router
from app.api.v1.kpi_api import router as kpi_router
from app.api.v1.constraints_api import router as constraints_router
from app.api.v1.feedback_api import feedback_router, telemetry_router
from app.api.v1.copilot_api import copilot_router


# Resolve the dataset path relative to the project root
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent  # backend/app/main.py → project root
_EXCEL_PATH = _PROJECT_ROOT / "SoleSight-Synthetic-Dataset-6mo.xlsx"
if not _EXCEL_PATH.exists():
    _ALT_PATH = _PROJECT_ROOT / "submission_deliverables" / "SoleSight-Synthetic-Dataset-6mo.xlsx"
    if _ALT_PATH.exists():
        _EXCEL_PATH = _ALT_PATH



@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Layer 1 (Data Layer)
    repository = DuckDBRepository()

    if _EXCEL_PATH.exists():
        print(f"[L1] Loading 6-month dataset from {_EXCEL_PATH.name} ...")
        tables = load_excel_dataset(str(_EXCEL_PATH))
        data_source = "Excel (6-month)"
    else:
        print("[L1] Excel dataset not found — falling back to SyntheticDataGenerator.")
        from app.l1_data.synthetic_generator import SyntheticDataGenerator
        generator = SyntheticDataGenerator(seed=42)
        tables = generator.generate_all()
        data_source = "SyntheticDataGenerator (12-week)"

    for table_name, df in tables.items():
        repository.register_dataframe(table_name, df)
        print(f"  → {table_name}: {len(df):,} rows")

    # Initialize Layer 2 (KPI Engine)
    kpi_engine = KPIEngine(config_dir="config/kpis", repository=repository)

    # Initialize Layer 3 (RCA Pipeline)
    rca_pipeline = RCAPipeline(repository=repository, kpi_engine=kpi_engine)

    # Initialize Layer 4 (AI Insights)
    ai_engine = AIInsightsEngine()

    # Attach to app state
    app.state.repository = repository
    app.state.kpi_engine = kpi_engine
    app.state.rca_pipeline = rca_pipeline
    app.state.ai_engine = ai_engine

    print(f"SoleSight Engine Initialized: {data_source} Seeded, KPI Contracts Loaded, RCA Pipeline Ready.")
    yield


app = FastAPI(
    title="SoleSight Intelligence-to-Action API",
    description="Deterministic Statistical Root Cause Analysis Engine for Retail Footwear",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(evidence_router, prefix="/api/v1")
app.include_router(narrative_router, prefix="/api/v1")
app.include_router(kpi_router, prefix="/api/v1")
app.include_router(constraints_router, prefix="/api/v1")
app.include_router(feedback_router, prefix="/api/v1")
app.include_router(telemetry_router, prefix="/api/v1")
app.include_router(copilot_router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "system": "SoleSight Root Cause Analysis Engine",
        "status": "OPERATIONAL",
        "data_source": "SoleSight-Synthetic-Dataset-6mo.xlsx" if _EXCEL_PATH.exists() else "SyntheticDataGenerator",
        "docs": "/docs",
        "api_version": "v1"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
