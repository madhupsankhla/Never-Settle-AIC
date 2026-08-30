# SoleSight — Retail Footwear KPI Intelligence & RCA Engine

[![GitHub Repo](https://img.shields.io/badge/GitHub-madhupsankhla%2FNever--Settle--AIC-181717.svg?logo=github)](https://github.com/madhupsankhla/Never-Settle-AIC)
[![Architecture: 5-Layer Modular](https://img.shields.io/badge/Architecture-5--Layer%20Modular-blue.svg)](submission_deliverables/SoleSight_Technical_Solution_Document.pdf)
[![Causal Attribution: Deterministic Math](https://img.shields.io/badge/Causal%20Attribution-Deterministic%20Math-emerald.svg)](submission_deliverables/SoleSight_Technical_Solution_Document.pdf)
[![DuckDB: In--Memory OLAP](https://img.shields.io/badge/Storage-DuckDB%20OLAP-amber.svg)](submission_deliverables/SoleSight_Technical_Solution_Document.pdf)
[![UI: React 18 + Vite](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-cyan.svg)](https://github.com/madhupsankhla/Never-Settle-AIC)
[![Documentation: Submission Deliverables](https://img.shields.io/badge/Documentation-Submission%20Deliverables-purple.svg)](submission_deliverables/INDEX.md)

> **SoleSight** is an enterprise-grade Root-Cause Analysis (RCA) and Decision Intelligence engine purpose-built for store-based footwear retail chains. It decomposes KPI movements across organizational hierarchies, attributes root causes through deterministic statistical triangulation (never LLM guessing), honestly communicates uncertainty via a hardcoded abstention gate, and synthesizes feasibility-checked, role-authorized operational actions.

📁 **Complete Submission Deliverables Folder:** [`submission_deliverables/`](submission_deliverables/INDEX.md)  
📄 **Technical Solution Document (PDF):** [`submission_deliverables/SoleSight_Technical_Solution_Document.pdf`](submission_deliverables/SoleSight_Technical_Solution_Document.pdf)  
📊 **Detailed Business Proposal (PDF):** [`submission_deliverables/SoleSight_Business_Proposal.pdf`](submission_deliverables/SoleSight_Business_Proposal.pdf)  
🎬 **Prototype Demonstration Video Plan:** [`submission_deliverables/Prototype_Demo_Video_Package.md`](submission_deliverables/Prototype_Demo_Video_Package.md)  

---

## ⚡ Evaluator Quick Start (Judges & Reviewers)

### 0. Clone Repository
```bash
git clone https://github.com/madhupsankhla/Never-Settle-AIC.git
cd Never-Settle-AIC
```

### 1. Launch the Live Application in 1 Command
Run the unified launcher from the project root:
```bash
python run.py
```

*This automatically boots the **FastAPI backend** (`http://localhost:8000`), the **React Vite frontend** (`http://localhost:5173`), and opens the dashboard directly in your default browser.*

> **Offline Demo Mode**: If running in an environment without an active backend connection or internet access, the frontend automatically falls back to the **Pre-Cached 6-Month Dataset** (`isOffline: true`), allowing full interactive exploration of all 8 network stores, 5 KPI funnels, and persona narratives with zero broken states.

---

### 2. Demo Persona Accounts & Decision Rights
Switch personas seamlessly in 1-click via the **Persona Switcher** in the top navigation bar or sidebar:

| Persona | Name & Role | Scope / Decision Rights | Focus & Key Insights |
|---|---|---|---|
| **Store Operations Manager** | `Rahul Sharma`<br>`rahul.sharma@solesight.internal` | `STORE-001` (Mumbai Flagship) | Floor try-on drop-offs, rack size stockouts (UK 8/9), runner shift assistance lag, emergency DC stock rebalances. |
| **Regional Operations Director** | `Vikram Malhotra`<br>`vikram.malhotra@solesight.internal` | `West Region` (Mumbai, Pune, Ahmedabad) | Inter-branch inventory reallocations from Pune (overstocked) to Mumbai, warehouse fulfillment lag, regional cluster benchmarks. |
| **CFO & Finance Director** | `Priya Mehta`<br>`priya.mehta@solesight.internal` | `Enterprise Network-Wide` | Recoverable revenue leakage (₹54.2L network / ₹13.4L store), gross margin erosion, emergency dispatch ROI (29.8x). |
| **Marketing & Growth Lead** | `Ananya Sen`<br>`ananya.sen@solesight.internal` | `Acquisition & Campaigns` | Ad spend attribution, Nitro campaign footfall lift (+3.9%) vs try-on rack conversion bottlenecks. |

---

### 3. Key Evaluator Demo Scenarios (1-Click Click-Paths)

Use the **Scenario Dropdown** (`Layers` icon) in the top header bar to trigger key evaluation paths:

#### A. Multi-Factor Stockout Hero Scenario (PRD §4 / Audit B4)
- **Click-Path**: Scenario Selector $\rightarrow$ Choose **`Scenario: STORE-001 Stockout`**
- **What to Observe**: 
  - Walk-in footfall traffic is elevated ($+3.9\%$ from campaign ad spend), but purchase conversion drops $-24.0\%$ ($12.9\%$ actual vs $17.1\%$ target).
  - Empirical Dose-Response triangulation attributes the loss directly to a 6-day stockout on core sizes UK 8 & 9 on *Marathon Pro* ($r=0.783, p=0.02$).
  - Evaluates ₹13.4 Lakhs in recoverable revenue leakage with an actionable inter-branch DC dispatch recommendation (ROI: 29.8x).

#### B. Contradictory Low-Confidence / Abstention Scenario (PRD §5 / Audit B5)
- **Click-Path**: Scenario Selector $\rightarrow$ Choose **`Scenario: Contradictory Low-Conf`**
- **What to Observe**:
  - All candidate drivers score in the `LOW` confidence tier ($P=0.40$).
  - Contradictory signals across rainy weather ($32\%$), competitor price discounts ($28\%$), and fitting queue friction ($40\%$) trigger the **Hardcoded Abstention Gate**.
  - Narrative honestly abstains from asserting a single false cause, instead recommending an on-site physical floor sizing audit before committing capital transfers.

#### C. Sparse-History SKU Calibration Scenario (PRD §6 / Audit B6)
- **Click-Path**: Scenario Selector $\rightarrow$ Choose **`Scenario: SKU-9901 (Sparse History)`**
- **What to Observe**:
  - Newly launched SKU-9901 (*FW-016 Trailblazer*) has only 2 weekly observations ($<3$ threshold).
  - The engine sets `is_sparse_history: true` and expands tolerance bands to $\pm 4.5\sigma$, **suppressing premature false-positive anomaly alarms** while sales velocity baseline forms.

#### D. Monsoon Weather Traffic Anomaly
- **Click-Path**: Scenario Selector $\rightarrow$ Choose **`Scenario: Monsoon Weather`** (or view Week of 2026-06-29)
- **What to Observe**:
  - Footfall drops to $z = -2.45$ due to heavy precipitation.
  - Residual regression isolates weather-driven footfall contraction from inventory conversion failure.

---

### 4. Automated Verification Suite
Run the comprehensive test script to verify all 8 core capabilities, mathematical formulas, Pydantic contracts, and server-side security boundaries:
```bash
python backend/verify_all.py
```

---

## 5. Five-Layer Architecture & Semantic Contracts

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                    Layer 1: Data Ingestion & Storage (L1)                        │
│   • DuckDB In-Memory OLAP Engine, 6-Month Longitudinal Granular Dataset          │
│   • 12 Relational Tables (fact_pos, fact_inventory, fact_footfall, ext_weather)  │
│   • Temporal As-Of Alignment & Zero-Copy Arrow / Vectorized SQL Execution        │
│   • Files: backend/app/l1_data/duckdb_repo.py, excel_loader.py                   │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   Layer 2: Semantic KPI Contract Layer (L2)                      │
│   • 5 Standalone YAML contracts: conversion_rate, footfall, full_price_sell_     │
│     through, size_curve_fill_rate, size_related_return_rate                      │
│   • Lineage Trees, Aggregation Cadence, Physical Invariant Bounds [0, 1]         │
│   • Files: backend/contracts/*.yaml, backend/app/l2_kpi/formulas.py, lineage.py  │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                  Layer 3: Statistical & Causal RCA Engine (L3)                   │
│   • Stage 1: Rolling 8-week z-score anomaly screening (|z| >= 2.0σ)              │
│   • Stage 2: Dimensional Funnel & Shapley Price-Volume-Mix (PVM) Decomposition   │
│   • Stage 3: Causal Triangulation (Dose-Response, Partial Corr, Lagged Corr)     │
│   • Stage 4: Impact Ranking, Feasibility Validation, and P&L Leakage Recovery    │
│   • Files: backend/app/l3_rca/stage1..stage4, pipeline.py                        │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │  [IMMUTABLE FROZEN EVIDENCE OBJECT]
                                         │  (Pydantic BaseModel / JSON Contract)
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                  Layer 4: AI Insights & Persona Synthesis (L4)                   │
│   • Zero raw database access; zero SQL execution; zero arithmetic computation    │
│   • Generates plain-language executive summaries purely from Frozen Evidence     │
│   • Hardcoded Abstention Gate: Blocks AI when confidence < 0.50 or conflicting   │
│   • Files: backend/app/l4_ai_insights/engine.py, prompts.py                      │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     Layer 5: Delivery & Analytics UI (L5)                        │
│   • React 18 + TypeScript + Vite + Tailwind CSS + Recharts                       │
│   • Dual Modes: SaaS Engineering Dashboard & Immersive Retail Boardroom          │
│   • AI Copilot, Real-Time Telemetry Modal, 8-Language i18n, Offline Resilience   │
│   • Files: frontend/src/components/saas/*, frontend/src/components/retail/*      │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. KPI YAML Semantic Contracts (`backend/contracts/`)

All 5 core KPIs are formally defined as standalone YAML semantic contracts:

1. **[`conversion_rate.yaml`](backend/contracts/conversion_rate.yaml)**: Weekly grain, POS transactions over overhead sensor footfall, causal attribution to size-curve stockouts and runner lag.
2. **[`footfall.yaml`](backend/contracts/footfall.yaml)**: Daily grain, overhead sensor entrance volume, driven by marketing campaign ad reach, weather residual drift, and local event lift.
3. **[`full_price_sell_through.yaml`](backend/contracts/full_price_sell_through.yaml)**: Monthly grain, units sold at $\ge 95\%$ of catalogue list price without markdowns.
4. **[`size_curve_fill_rate.yaml`](backend/contracts/size_curve_fill_rate.yaml)**: Daily grain, percentage of UK 6–11 core sizes in stock on shelf.
5. **[`size_related_return_rate.yaml`](backend/contracts/size_related_return_rate.yaml)**: Monthly grain, returns tagged with wrong size or fit discomfort resulting from forced compromise purchases.

---

## 7. Statistical RCA Methodology & Empirical Proofs

Across the 6-month synthetic dataset (`SoleSight-Synthetic-Dataset-6mo.xlsx`), SoleSight executes 5 empirical statistical tests:

| Statistical Test | Hypothesis Evaluated | Empirical Result | Assigned Confidence Tier |
|---|---|---|---|
| **Dose-Response OLS** | Stockout Severity vs Conversion Loss | `conv_%_change = -13.94 + 1.329 × units_on_hand`<br>**r = 0.783, p = 0.0215, n = 8 stores** | **HIGH (P=0.92)** |
| **Partial Correlation** | Staff Untrained Hours vs Conversion | `r = -0.107, p = 0.596` (controlling for stock)<br>Grain mismatch between monthly roster & weekly POS. | **LOW (P=0.35)** |
| **Lagged Cross-Correlation** | Stock Deficit Predicting Returns | Correlation flips from positive at Lag 0 to negative at **Lag 2 (r = -0.379)** and **Lag 5 (r = -0.447)**. | **MEDIUM (P=0.68)** |
| **Weather Residual OLS** | Monsoon Rain Impact on Footfall | `Footfall = 352.4 - 1.21×Precip + 117.18×Weekend`<br>**R² = 0.314, p < 0.001**. Explains late June traffic dip. | **HIGH (P=0.88)** |
| **Event Lift Analysis** | City Marathon / Festival Lift | **+58.1% Footfall lift** during marathon event window. Correctly isolates temporary demand surge. | **HIGH (P=0.85)** |

---

## 8. Manual Start & Development Setup

### Backend (FastAPI + DuckDB)
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Documentation (Swagger UI): `http://localhost:8000/docs`

### Frontend (React + Vite)
```bash
cd frontend
npm.cmd run dev
```
- Frontend Application: `http://localhost:5173`

### Production Build Verification
```bash
cd frontend
npm.cmd run build
```
*(Verifies 0 TypeScript / Vite compilation errors across 2,400+ modules).*

---

## 9. PDF Document Generation
To regenerate the publication-grade `README.pdf` document at any time:
```bash
python generate_pdf_docs.py
```
This renders `README.pdf` using headless Chrome/Edge print engine with exact pagination and CSS print stylesheets.
