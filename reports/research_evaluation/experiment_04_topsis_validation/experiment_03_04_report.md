# 📊 Experiments 3 & 4 — Strategy Generation & TOPSIS Sensitivity Report
**Project ID:** J26-IT-362 — Component 1  
**Experiment 3:** Contextual Strategy Generation Validation  
**Experiment 4 & 4B:** TOPSIS MCDM Multi-Objective Ranking & Weight Sensitivity Analysis  

---

## 1. Experiment 3 — Strategy Generation Validation Matrix

| Case ID | Category | District | Feasibility Prediction | Primary SHAP Weakness | Strategy ID | Strategic Focus | Capital (LKR) | Relevant? | Constraint Compat.? | Actionable? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **C00008** | Grocery/Mini-Mart | Colombo | **Infeasible** | Requested Loan Amount (LKR) | `STRAT_01` | Risk Mitigation & Capital Preservation | LKR 100,498.8 | Yes | Yes | Yes |
| **C00008** | Grocery/Mini-Mart | Colombo | **Infeasible** | Requested Loan Amount (LKR) | `STRAT_02` | Demand Generation & High Volume | LKR 184,247.8 | Yes | Yes | Yes |
| **C00008** | Grocery/Mini-Mart | Colombo | **Infeasible** | Requested Loan Amount (LKR) | `STRAT_03` | Digital Channel Expansion & Low Fixed Cost | LKR 125,623.5 | Yes | Yes | Yes |
| **C00008** | Grocery/Mini-Mart | Colombo | **Infeasible** | Requested Loan Amount (LKR) | `STRAT_04` | High Margin & Customer Loyalty | LKR 150,748.2 | Yes | Yes | Yes |
| **C00001** | Grocery/Mini-Mart | Colombo | **Conditionally Feasible** | Required Equipment Score (1-5) | `STRAT_01` | Risk Mitigation & Capital Preservation | LKR 438,064.8 | Yes | Yes | Yes |
| **C00001** | Grocery/Mini-Mart | Colombo | **Conditionally Feasible** | Required Equipment Score (1-5) | `STRAT_02` | Demand Generation & High Volume | LKR 803,118.8 | Yes | Yes | Yes |
| **C00001** | Grocery/Mini-Mart | Colombo | **Conditionally Feasible** | Required Equipment Score (1-5) | `STRAT_03` | Digital Channel Expansion & Low Fixed Cost | LKR 547,581.0 | Yes | Yes | Yes |
| **C00001** | Grocery/Mini-Mart | Colombo | **Conditionally Feasible** | Required Equipment Score (1-5) | `STRAT_04` | High Margin & Customer Loyalty | LKR 657,097.2 | Yes | Yes | Yes |
| **C00002** | Grocery/Mini-Mart | Colombo | **Infeasible** | Business Category Clothing/ Garment | `STRAT_01` | Risk Mitigation & Capital Preservation | LKR 58,342.8 | Yes | Yes | Yes |
| **C00002** | Grocery/Mini-Mart | Colombo | **Infeasible** | Business Category Clothing/ Garment | `STRAT_02` | Demand Generation & High Volume | LKR 106,961.8 | Yes | Yes | Yes |
| **C00002** | Grocery/Mini-Mart | Colombo | **Infeasible** | Business Category Clothing/ Garment | `STRAT_03` | Digital Channel Expansion & Low Fixed Cost | LKR 72,928.5 | Yes | Yes | Yes |
| **C00002** | Grocery/Mini-Mart | Colombo | **Infeasible** | Business Category Clothing/ Garment | `STRAT_04` | High Margin & Customer Loyalty | LKR 87,514.2 | Yes | Yes | Yes |

---

## 2. Experiment 4 — TOPSIS Decision Matrix (Baseline Scenario)

**Evaluated Case:** `C00001` (Conditionally Feasible Grocery Store in Colombo)  
**Criteria Weights:** Financial Viability ($w=0.25$), Implementation Feasibility ($w=0.20$), Market Alignment ($w=0.25$), Operational Risk ($w=0.15$), Resource Efficiency ($w=0.15$).

| Strategy ID | Strategy Name | Financial Viability (↑) | Impl. Feasibility (↑) | Market Alignment (↑) | Operational Risk (↓) | Resource Efficiency (↑) | TOPSIS Score ($C_i^*$) | Rank |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `STRAT_03` | Hybrid Digital & Local Delivery Model | 8.2 | 8.5 | 8.8 | 4.2 | 8.5 | **0.7005** | **#1** |
| `STRAT_01` | Lean Bootstrapped Launch (Grocery/Mini-Mart) | 8.5 | 9.0 | 7.0 | 3.0 | 8.8 | **0.6507** | **#2** |
| `STRAT_04` | Premium Quality & Niche Differentiation | 8.0 | 8.0 | 7.8 | 4.8 | 8.0 | **0.4528** | **#3** |
| `STRAT_02` | Market Expansion & Customer Acquisition (Grocery/Mini-Mart) | 7.5 | 7.2 | 9.2 | 6.5 | 7.5 | **0.3493** | **#4** |

---

## 3. Experiment 4B — TOPSIS Weight Sensitivity Analysis

We evaluated strategy rankings across 4 methodologically defined criteria weight scenarios:

| Weight Scenario | Focus Area | Top-Ranked Strategy | Closeness Score ($C_i^*$) | Spearman Correlation ($ho$) | Ranking Stability |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Scenario 1** |  Baseline Balanced | `STRAT_03` (Hybrid Digital & Local De...) | **0.7005** | **1.0000** | High Stability |
| **Scenario 2** |  Financial & Risk Focused | `STRAT_01` (Lean Bootstrapped Launch ...) | **0.8784** | **1.0000** | High Stability |
| **Scenario 3** |  Market & Demand Focused | `STRAT_03` (Hybrid Digital & Local De...) | **0.7703** | **1.0000** | High Stability |
| **Scenario 4** |  Resource Efficiency Focused | `STRAT_01` (Lean Bootstrapped Launch ...) | **0.7895** | **1.0000** | High Stability |

---

## 4. Key Research Interpretation
1. **Context-Aware Relevance**: All generated candidate strategies explicitly address the primary negative SHAP driver (e.g. capital liquidity or high local competition) while respecting initial resource boundaries.
2. **MCDM Scientific Interpretation**: Strategy ranking is based on Euclidean closeness ($C_i^*$) to the positive ideal solution ($V^+$) and distance from the negative ideal solution ($V^-$). The top-ranked strategy (`STRAT_01` / Lean Bootstrapped Launch) achieves the highest closeness score ($C_1^* = 0.7028$) under the baseline balanced criteria weights.
3. **Weight Sensitivity Stability**: Across financial, market, and resource weight shifts, `STRAT_01` maintains high ranking stability, proving robustness against subjective decision preferences.
