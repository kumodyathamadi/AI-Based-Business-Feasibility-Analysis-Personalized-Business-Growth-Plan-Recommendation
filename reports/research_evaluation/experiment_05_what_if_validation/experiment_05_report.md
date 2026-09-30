# 📈 Experiment 5 — What-If Analysis Validation & Experiment 5B — Counterfactual Boundary Analysis
**Project ID:** J26-IT-362 — Component 1  
**Experiment 5:** Assumption-Shift What-If Simulation Validation  
**Experiment 5B:** Counterfactual Minimum Change Boundary Search  

---

## 1. Experiment 5 — What-If Scenario Simulation Results

We evaluated 4 predefined operational assumption shifts across representative SME profiles:
1. **SCEN_01**: +50% Capital Injection
2. **SCEN_02**: Secured SME Working Loan (LKR 500,000)
3. **SCEN_03**: +30% Customer Footfall Boost (+15 Demand Score)
4. **SCEN_04**: Optimized Operating Cost (-20% Monthly Budget)

| Case ID | Category | Baseline Class | Base P(Feas) | Scenario ID | Scenario Title | New Class | New P(Feas) | Δ P(Feas) | Status Shift |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| **C00001** | Grocery/Mini-Mart | **Conditionally Feasible** | 24.50% | `SCEN_01` | +50% Capital Injection | **Conditionally Feasible** | 25.50% | **+1.00%** | No Shift (Conditionally Feasible) |
| **C00001** | Grocery/Mini-Mart | **Conditionally Feasible** | 24.50% | `SCEN_02` | Secured SME Working Loan (LKR 500,000) | **Conditionally Feasible** | 16.00% | **-8.50%** | No Shift (Conditionally Feasible) |
| **C00001** | Grocery/Mini-Mart | **Conditionally Feasible** | 24.50% | `SCEN_03` | +30% Customer Footfall Boost | **Conditionally Feasible** | 34.50% | **+10.00%** | No Shift (Conditionally Feasible) |
| **C00001** | Grocery/Mini-Mart | **Conditionally Feasible** | 24.50% | `SCEN_04` | Optimized Operating Cost (-20% Monthly Budget) | **Conditionally Feasible** | 32.00% | **+7.50%** | No Shift (Conditionally Feasible) |
| **C00002** | Grocery/Mini-Mart | **Infeasible** | 0.00% | `SCEN_01` | +50% Capital Injection | **Infeasible** | 2.50% | **+2.50%** | No Shift (Infeasible) |
| **C00002** | Grocery/Mini-Mart | **Infeasible** | 0.00% | `SCEN_02` | Secured SME Working Loan (LKR 500,000) | **Conditionally Feasible** | 3.00% | **+3.00%** | Shifted: Infeasible → Conditionally Feasible |
| **C00002** | Grocery/Mini-Mart | **Infeasible** | 0.00% | `SCEN_03` | +30% Customer Footfall Boost | **Infeasible** | 0.00% | **+0.00%** | No Shift (Infeasible) |
| **C00002** | Grocery/Mini-Mart | **Infeasible** | 0.00% | `SCEN_04` | Optimized Operating Cost (-20% Monthly Budget) | **Infeasible** | 0.00% | **+0.00%** | No Shift (Infeasible) |
| **C00018** | Grocery/Mini-Mart | **Feasible** | 55.00% | `SCEN_01` | +50% Capital Injection | **Feasible** | 56.50% | **+1.50%** | No Shift (Feasible) |
| **C00018** | Grocery/Mini-Mart | **Feasible** | 55.00% | `SCEN_02` | Secured SME Working Loan (LKR 500,000) | **Conditionally Feasible** | 27.50% | **-27.50%** | Shifted: Feasible → Conditionally Feasible |
| **C00018** | Grocery/Mini-Mart | **Feasible** | 55.00% | `SCEN_03` | +30% Customer Footfall Boost | **Conditionally Feasible** | 46.00% | **-9.00%** | Shifted: Feasible → Conditionally Feasible |
| **C00018** | Grocery/Mini-Mart | **Feasible** | 55.00% | `SCEN_04` | Optimized Operating Cost (-20% Monthly Budget) | **Feasible** | 56.00% | **+1.00%** | No Shift (Feasible) |

---

## 2. Experiment 5B — Counterfactual Minimum Change Boundary Analysis

Counterfactual search determines the minimum capital increment ($\Delta\text{LKR}$) required to elevate a business state into a **Feasible** outcome ($P(\text{Feasible}) \ge 0.50$).

| Case ID | Base Class | Base Capital (LKR) | Counterfactual Status | Target Outcome | Target P(Feas) | Required Total Capital (LKR) | Additional Capital Needed ($\Delta\text{LKR}$) | Capital Multiplier |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **C00001** | **Conditionally Feasible** | LKR 730,108.00 | ✗ Unreachable (Single Dimension) | **Feasible (Unreachable in Single Dimension)** | N/A | **N/A** | **N/A** | N/Ax |
| **C00002** | **Infeasible** | LKR 97,238.00 | ✗ Unreachable (Single Dimension) | **Feasible (Unreachable in Single Dimension)** | N/A | **N/A** | **N/A** | N/Ax |
| **C00018** | **Feasible** | LKR 368,197.00 | ✓ Found | **Feasible** | 55.00% | **LKR 368,197.00** | **LKR 0.00** | 1.0x |

---

## 3. Key Research Findings & Boundary Insights
1. **Scenario Sensitivity**: For `C00001` (Conditionally Feasible), customer footfall boost (`SCEN_03`) yields the largest feasibility probability gain ($\Delta P = +10.00\%$, moving $P(\text{Feasible})$ from $24.50\%$ to $34.50\%$), followed by operating budget optimization (`SCEN_04`, $\Delta P = +7.50\%$).
2. **Multi-Dimensional Decision Boundaries**: Single-dimensional capital search up to $4.0\times$ baseline capital demonstrates that capital injection alone is insufficient for `C00001` ($24.50\%$) or `C00002` ($0.00\%$) to reach the $P(\text{Feasible}) \ge 50.00\%$ threshold.
3. **Multi-Factorial Business Constraints**: Deeply `Infeasible` businesses like `C00002` require joint multi-dimensional enhancements across working capital, customer demand, equipment readiness, and operational efficiency to transition into a `Feasible` business state.

---

## 4. Scientific Validity & Methodological Disclaimer
> [!IMPORTANT]
> **Model-Based Scenario Estimates**: All What-If simulation outputs and counterfactual minimum capital boundaries are **model-based scenario estimates** calculated under trained Random Forest decision rules and dataset distribution assumptions.
> They represent decision support guidance for SME planning and do **NOT** constitute absolute financial guarantees of real-world business success or profitability.
