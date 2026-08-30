# SoleSight — Technical Solution Document
**Problem Track:** Problem Track 3 — Actionable Intelligence & Decision Systems  
**Publication PDF Deliverable:** `SoleSight_Technical_Solution_Document.pdf` (519 KB)

---

## 1. Cover Page & Metadata
* **Project Name:** SoleSight
* **Tagline:** Deterministic Root-Cause Attribution, Semantic KPI Contracts, and Zero-Hallucination AI Operational Synthesis for Store-Based Footwear Chains
* **Architecture:** 5-Layer Modular In-Memory Architecture (DuckDB + FastAPI + React 18 + GPT-4o)
* **Team Name:** Team Shor
* **Version:** 2.0.0 (Production Release)

---

## 2. Executive Summary
**SoleSight** is an enterprise-grade Root-Cause Analysis (RCA) and Decision Intelligence platform engineered specifically for multi-store retail footwear chains. Physical footwear retail suffers severe conversion volatility and revenue leakage (e.g., store conversion dropping from 17.1% to 12.9%, representing **₹13.4 Lakhs in lost weekly revenue** for a single flagship store), yet operators struggle to diagnose the cause because POS, footfall sensors, inventory ERPs, and staff rosters live in isolated data silos. 

Traditional BI dashboards show *what* happened, while generic LLMs hallucinate inaccurate explanations. SoleSight solves this through a rigorous **5-Layer Architecture**: an in-memory DuckDB OLAP engine computes deterministic statistical proofs (Dose-Response regressions, Partial Correlations, Lagged Cross-Correlations, and Weather Residual OLS) and freezes them into an immutable **Evidence JSON Contract**. Layer 4 AI translates this mathematical proof into role-tailored operational actions with inline verifiable citations, while a hardcoded **Abstention Gate** prevents hallucination when signals are inconclusive ($P < 0.50$). SoleSight bridges the gap between raw data and role-authorized operational execution.

---

## 3. Problem Statement
* **Current Situation:** Modern retail footwear chains capture millions of data points across optical entrance counters, POS cash registers, warehouse ERPs, and workforce scheduling systems.
* **Core Problem:** When conversion rates plummet, cross-functional stakeholders (Store Managers, Regional Directors, Marketing Leads, and CFOs) lack a unified, causal diagnosis. Because footwear is constrained by strict **size-curves (UK 6–11)**, a localized stockout of core sizes (UK 8 & 9) leaves traffic intact while trial-to-purchase conversion collapses, customer try-on friction surges, and forced compromise purchases trigger delayed return spikes 2–5 weeks later.
* **Existing Gap:** Traditional dashboards provide only lagging, descriptive summaries without causal attribution. Conversely, unconstrained GenAI tools fed raw tabular dumps produce arithmetic errors and ungrounded advice without verifying operational feasibility.
* **Consequences:** Unresolved root causes lead to recurring revenue leakage (₹54.2 Lakhs network-wide), excessive discounting, and margin erosion.
* **Opportunity:** SoleSight automates mathematical causal triangulation and feasibility-checked operational actions, converting raw telemetry into high-confidence revenue recovery.

---

## 4. Our Solution
SoleSight decouples mathematical computation from language synthesis. The system ingests 12 relational operational tables, evaluates 5 formally specified KPI YAML semantic contracts, executes a 4-stage statistical RCA pipeline, and outputs an immutable Frozen Evidence Object.
* **Store Operations Managers** receive floor-level briefings identifying exact size stockouts, runner delays, and shelf replenishment needs.
* **Regional Operations Directors** receive inter-branch inventory rebalancing recommendations (e.g., moving surplus stock from Pune to Mumbai).
* **Marketing & Growth Leads** receive top-of-funnel campaign footfall attribution vs. bottom-of-funnel try-on rack conversion bottleneck analytics.
* **CFOs & Finance Directors** receive recoverable P&L revenue leakage analysis and emergency logistics ROI calculations (29.8x yield).

---

## 5. Key Features Actually Implemented

| Feature | What It Does | User Value | AI / Technical Component |
|---|---|---|---|
| **KPI Semantic Contracts** | 5 standalone YAML definitions with invariant bounds $[0, 1]$ and lineage graphs. | Standardizes metric math across all enterprise departments. | Layer 2 (`PyYAML` + `KPIEngine`) |
| **Dose-Response OLS** | Regresses stockout severity against conversion drop across all 8 stores. | Empirical proof of stockout impact ($r = 0.783, p = 0.0215$). | Layer 3 (`SciPy` OLS Stats Engine) |
| **Lagged Cross-Correlation** | Evaluates size deficit at Week 0 predicting return spikes at Lags 1–6. | Detects compromise buying before return costs materialize ($r = -0.447$). | Layer 3 (Pearson Cross-Corr Engine) |
| **Weather Residual OLS** | Regresses footfall against precipitation & weekend dummies. | Separates monsoon traffic drop ($R^2 = 0.314$) from store conversion failure. | Layer 3 (Residual Regression) |
| **Hardcoded Abstention Gate** | Halts LLM generation if confidence $< 0.50$ or drivers conflict. | Guarantees 0% AI hallucination on ambiguous data. | Layer 4 (Abstention Gate Bypass) |
| **Sparse-History Calibration** | Expands anomaly tolerance to $\pm 4.5\sigma$ for SKUs with $<3$ observations. | Suppresses false alarms during new product rollouts. | Layer 3 (Signal Detection Calibration) |
| **Persona Narrative Engine** | Generates role-tailored briefings with inline verifiable citation tags. | Delivers executive clarity grounded in frozen math. | Layer 4 (`GPT-4o` / Dynamic Routing) |
| **Active Learning Copilot** | Interactive drawer for natural queries + analyst feedback calibration store. | Allows human analysts to correct weights over time. | Layer 4 & 5 (FastAPI Copilot API) |
| **Dual-Mode UI Dashboard** | SaaS Engineering Explorer & Immersive Retail Boardroom views. | Caters to both deep data analysts and C-suite executives. | Layer 5 (`React 18` + `Recharts`) |

---

## 6. Solution Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                    Layer 1: Data Ingestion & Storage (L1)                        │
│   • DuckDB In-Memory OLAP Engine (Vectorized SQL, Zero-Copy Arrow Execution)     │
│   • 6-Month Longitudinal Dataset (8 Stores, 26 SKUs, 12 Relational Tables)       │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   Layer 2: Semantic KPI Contract Layer (L2)                      │
│   • 5 Standalone YAML contracts (conversion_rate, footfall, full_price_sell_     │
│     through, size_curve_fill_rate, size_related_return_rate)                     │
│   • Lineage Trees, Aggregation Cadences, Invariant Bounds [0, 1]                │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                  Layer 3: Statistical & Causal RCA Engine (L3)                   │
│   • Stage 1: Rolling 8-week z-score anomaly screening (|z| >= 2.0σ)              │
│   • Stage 2: Dimensional Drilldown & Shapley Price-Volume-Mix Decomposition      │
│   • Stage 3: Causal Triangulation (Dose-Response, Partial Corr, Lagged Corr)     │
│   • Stage 4: Impact Ranking, Feasibility Validation, and P&L Leakage Recovery    │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │  [IMMUTABLE FROZEN EVIDENCE JSON]
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                  Layer 4: AI Insights & Persona Synthesis (L4)                   │
│   • Zero raw database queries; zero arithmetic computation                       │
│   • Generates plain-language briefings with inline verifiable citation tags     │
│   • Hardcoded Abstention Gate: Blocks LLM when confidence < 0.50                 │
│   • SHA-256 evidence hashing, response caching, token/latency telemetry logging  │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     Layer 5: Delivery & Analytics UI (L5)                        │
│   • React 18 + TypeScript + Vite + Tailwind CSS + Recharts                       │
│   • Dual Modes: SaaS Engineering Dashboard & Immersive Retail Boardroom          │
│   • AI Copilot Drawer with Active Learning feedback loop & 8-Language i18n       │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Technology Stack

* **Backend:** Python 3.10+, FastAPI, Uvicorn, DuckDB In-Memory OLAP, NumPy, SciPy, Statsmodels, Pydantic v2, PyYAML.
* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts.
* **AI & LLM:** OpenAI API (GPT-4o, GPT-4o-mini), Dynamic Prompt Orchestration, SHA-256 Hashing, Abstention Gate.
* **Tooling:** Python launcher (`run.py`), automated test suite (`verify_all.py`), Chromium PDF generator.

---

## 8. Installation & Verification

```bash
# Unified 1-command startup:
python run.py

# Automated test suite (verifies all 5 capabilities):
python backend/verify_all.py
```
