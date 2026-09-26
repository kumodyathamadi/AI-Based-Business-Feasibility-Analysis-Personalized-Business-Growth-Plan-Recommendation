# Component 1 Architecture & Production Pipeline Specification

## 1. System Context & Overview
**Component 1**: AI-Based Business Feasibility Analysis & Personalized Business/Growth Plan Recommendation  
**Domain Focus**: Small and Medium Enterprises (SMEs) in Sri Lanka (Colombo District focus)  
**System Purpose**: Decision-Support System for SME Founders, Financial Advisors, and Business Incubators.

---

## 2. Technical Pipeline Architecture

```text
       UNSEEN BUSINESS INPUT (Dict / JSON)
                        │
                        ▼
      1. Input Validation & Preprocessing
         (src/preprocessing/preprocessor.py)
                        │
                        ▼
     2. Feasibility Model Prediction & Proba
         (src/prediction/predictor.py)
            ├── random_forest.joblib
            └── preprocessor.joblib
                        │
                        ▼
      3. Local SHAP Feature Attribution (XAI)
         (src/explainability/explainer.py)
                        │
                        ▼
    4. SME Strategy Generation Engine (MCDM Matrix)
         (src/strategies/generator.py)
                        │
                        ▼
     5. TOPSIS Strategy Multi-Criteria Ranking
         (src/topsis/ranker.py)
                        │
                        ▼
    6. What-If Scenario Analysis & Counterfactual Search
         (src/what_if/simulator.py)
                        │
                        ▼
   7. Personalized Business & Growth Plan Generation
         (src/planning/planner.py)
                        │
                        ▼
  8. Standardized Machine-Readable Structured Profile JSON
         (src/profile/builder.py)
```

---

## 3. Modular Directory Structure

```text
Component_1/
├── data/
│   ├── raw/
│   └── processed/
├── models/
│   └── feasibility_model/
│       ├── random_forest.joblib
│       ├── preprocessor.joblib
│       ├── feature_names.json
│       ├── class_labels.json
│       └── model_metadata.json
├── notebooks/
│   ├── 01_data_audit.ipynb
│   ├── 02_preprocessing.ipynb
│   ├── 03_model_training.ipynb
│   ├── 04_model_evaluation.ipynb
│   ├── 05_shap_explainability.ipynb
│   ├── 06_strategy_generation.ipynb
│   ├── 07_topsis_ranking.ipynb
│   ├── 08_what_if_analysis.ipynb
│   └── 09_personalized_business_plan.ipynb
├── src/
│   ├── __init__.py
│   ├── orchestrator.py
│   ├── preprocessing/preprocessor.py
│   ├── prediction/predictor.py
│   ├── explainability/explainer.py
│   ├── strategies/generator.py
│   ├── topsis/ranker.py
│   ├── what_if/simulator.py
│   ├── planning/planner.py
│   └── profile/builder.py
├── tests/
│   └── test_orchestrator.py
└── documentation/
    └── architecture.md
```
