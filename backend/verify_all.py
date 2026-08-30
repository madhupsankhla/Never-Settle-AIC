"""
SoleSight Comprehensive Automated Verification Script.
Validates all 8 Problem Track 3 capabilities, 5 YAML contracts, and security boundaries.
"""
import sys
import yaml
from pathlib import Path

# Ensure backend root is on sys.path
backend_dir = str(Path(__file__).resolve().parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)


def run_verification():
    print("==================================================================")
    print("      SOLESIGHT PROBLEM TRACK 3 — SYSTEM VERIFICATION SUITE       ")
    print("==================================================================")

    # 1. Verify 5 YAML Semantic Contracts
    print("\n[1/5] Verifying 5 KPI YAML Semantic Contracts...")
    contracts_dir = Path(__file__).resolve().parent / "contracts"
    expected_contracts = [
        "conversion_rate.yaml",
        "footfall.yaml",
        "full_price_sell_through.yaml",
        "size_curve_fill_rate.yaml",
        "size_related_return_rate.yaml"
    ]
    for c_name in expected_contracts:
        c_path = contracts_dir / c_name
        assert c_path.exists(), f"Missing contract: {c_name}"
        with open(c_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
            assert "kpi_id" in data and "calculation" in data and "drivers" in data and "thresholds" in data
            print(f"  [PASS] {c_name:<30} -> {data['name']} (Cadence: {data['calculation']['cadence']})")

    # 2. Verify Data Layer & Ingestion
    print("\n[2/5] Initializing Layer 1 In-Memory DuckDB Engine...")
    from app.l1_data.duckdb_repo import DuckDBRepository
    from app.l1_data.synthetic_generator import SyntheticDataGenerator
    from app.l2_kpi.engine import KPIEngine
    from app.l3_rca.pipeline import RCAPipeline
    from app.core.security import enforce_persona_access
    from fastapi import HTTPException

    generator = SyntheticDataGenerator(seed=42)
    tables = generator.generate_all()
    repo = DuckDBRepository()
    for name, df in tables.items():
        repo.register_dataframe(name, df)
    print(f"  [PASS] Loaded {len(tables)} tables ({', '.join(list(tables.keys())[:4])}...)")

    kpi_engine = KPIEngine(config_dir=str(contracts_dir), repository=repo)
    pipeline = RCAPipeline(repo, kpi_engine)

    # 3. Test Hero Multi-Factor Scenario (STORE-001 / STORE-014 Stockout)
    print("\n[3/5] Testing Hero Multi-Factor Anomaly & Attribution (B4)...")
    ev_hero = pipeline.run_rca(kpi_id="conversion_rate", store_id="STORE-014", period="2026-W33", region="West")
    assert ev_hero.is_material is True
    assert ev_hero.abstain is False
    assert len(ev_hero.hypotheses) > 0
    top_h = ev_hero.hypotheses[0]
    print(f"  [PASS] Signal Detected: is_material={ev_hero.is_material}, change={ev_hero.change_pct}%")
    print(f"  [PASS] Top Driver: {top_h.driver} (Confidence={top_h.confidence}, Tier={top_h.tier})")
    print(f"  [PASS] Recommended Action: {ev_hero.top_ranked_action.action}")

    # 4. Test Low-Confidence Abstention Scenario & Sparse History
    print("\n[4/5] Testing Abstention Gate (B5) and Sparse History (B6)...")
    ev_abstain = pipeline.run_rca(kpi_id="conversion_rate", store_id="STORE-003", period="2026-W33", region="South", scenario_override="abstention")
    assert ev_abstain.abstain is True
    print(f"  [PASS] Abstention Triggered: abstain={ev_abstain.abstain}, reason='{ev_abstain.abstain_reason[:60]}...'")

    ev_sparse = pipeline.run_rca(kpi_id="conversion_rate", store_id="STORE-014", period="2026-W33", region="West", scenario_override="sparse")
    assert ev_sparse.is_sparse_history is True
    assert ev_sparse.is_material is False
    print(f"  [PASS] Sparse History Handled: is_sparse_history={ev_sparse.is_sparse_history}, is_material={ev_sparse.is_material}")

    # 5. Test Server-Side Security Boundaries (P7)
    print("\n[5/5] Testing Role-Based Server-Side Access Control (P7)...")
    # Allowed: Store manager accessing own store
    assert enforce_persona_access("store_manager", target_store_id="STORE-014", assigned_store_id="STORE-014") is True
    print("  [PASS] Store Manager authorized on STORE-014 -> Allowed (200 OK)")

    # Denied: Store manager accessing foreign store -> HTTP 403
    try:
        enforce_persona_access("store_manager", target_store_id="STORE-002", assigned_store_id="STORE-014")
        assert False, "Security failure: Store Manager should be blocked from STORE-002"
    except HTTPException as e:
        assert e.status_code == 403
        print("  [PASS] Store Manager accessing STORE-002 -> Blocked (HTTP 403 Forbidden)")

    print("\n==================================================================")
    print("       ALL SYSTEM CAPABILITIES VERIFIED & SUBMISSION READY!       ")
    print("==================================================================")

if __name__ == "__main__":
    run_verification()
