# Component 1: AI-Based Business Feasibility Analysis & Personalized Business/Growth Plan Recommendation

## Executive Summary
This research component forms part of the **AI-Driven SME Business Lifecycle Decision Support System**, focusing on Sri Lankan SMEs with a Colombo District emphasis.

---

## Completed 9-Stage Research & Software Architecture

```text
SME Business Input
        │
        ▼
01 Data Preprocessing & Validation  ───────► (preprocessor.joblib)
        │
        ▼
02 Random Forest Feasibility Model  ───────► (random_forest.joblib)
        │                                   Feasible / Conditionally / Infeasible
        ▼
03 SHAP Local Explainability        ───────► Feature Enablers (+) & Hurdles (-)
        │
        ▼
04 Multi-Objective SME Strategies  ───────► Resource, Financial & Market Alignment
        │
        ▼
05 TOPSIS MCDM Ranking              ───────► Relative Closeness Score (C_i*)
        │
        ▼
06 What-If & Counterfactual Search  ───────► Live Dynamic Parameter Simulations
        │
        ▼
07 Personalized Business Plan       ───────► 5-Section Plan & 3-Phase Roadmap
        │
        ▼
08 Structured Profile Assembly     ───────► Schema v1.0.0 JSON (Contract for Comp 2-4)
        │
        ▼
09 FastAPI & React UI Integration   ───────► REST API & React + Vite Interface
```

---

## Machine Learning Results
- **Dataset**: ~1,200 records (Colombo District SMEs)
- **Target Classes**: `Feasible`, `Conditionally Feasible`, `Infeasible`
- **Random Forest Performance**:
  - Test Accuracy: **88.33%**
  - Weighted F1 Score: **0.88**
  - ROC-AUC: **0.9599**
  - PR-AUC: **0.9494**

---

## System Components & File Paths

### 1. Modular Python AI Engine (`src/`)
- `src/orchestrator.py`: Central `analyze_business(raw_input)` pipeline orchestrator.
- `src/preprocessing/preprocessor.py`: Input validation & joblib scaling pipeline.
- `src/prediction/predictor.py`: Random Forest feasibility inference.
- `src/explainability/explainer.py`: Local SHAP attribution driver service.
- `src/strategies/generator.py`: Multi-objective SME strategy generator.
- `src/topsis/ranker.py`: TOPSIS multi-criteria ranking engine.
- `src/what_if/simulator.py`: What-If simulation & counterfactual search.
- `src/planning/planner.py`: 5-section personalized business plan generator.
- `src/profile/builder.py`: Standardized Schema v1.0.0 structured profile builder.

### 2. Backend API (`backend/`)
- `backend/main.py`: FastAPI server configuration & CORS middleware.
- `backend/routes/analysis.py`: Endpoints (`POST /api/business/analyze`, `GET /api/health`, `GET /api/business/records`, `GET /api/business/record/{id}`).
- `backend/database.py` & `backend/models.py`: SQLite storage (`data/component_1.db`).

### 3. React + Vite Frontend (`frontend/`)
- `frontend/src/App.jsx`: Main React dashboard orchestrator.
- `frontend/src/components/`:
  - `Navbar.jsx`, `Sidebar.jsx`, `BusinessForm.jsx`, `FeasibilityCard.jsx`, `ProbabilityChart.jsx`, `ShapExplanation.jsx`, `StrategyCard.jsx`, `TopsisTable.jsx`, `WhatIfSimulator.jsx`, `BusinessPlan.jsx`, `ProfileViewer.jsx`.

---

## How to Run the System

### Step 1: Start Backend API (FastAPI)
```powershell
py -m uvicorn backend.main:app --reload --port 8000
```

### Step 2: Start Frontend UI (React + Vite)
```powershell
cd "d:\SLIIT\Y4 S1\Research\Component_1\frontend"
npm install
npm run dev
```
Access UI at: **`http://localhost:3000`**

---

## Verification Test Commands
```powershell
py tests/test_orchestrator.py
py tests/test_api.py
```
