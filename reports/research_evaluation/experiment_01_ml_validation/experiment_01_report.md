# 📊 Experiment 1 & 1B Research Evaluation Report
**Project ID:** J26-IT-362 — Component 1  
**Experiment:** ML Performance Validation (Exp 1) & Systematic Error Analysis (Exp 1B)  
**Evaluated Model:** `RandomForestClassifier(n_estimators=200, random_state=42, class_weight='balanced')`  
**Dataset Split:** Training $N=840$ (70%), Validation $N=180$ (15%), Test $N=180$ (15%)  

---

## 1. Overall Model Performance Baseline

| Metric | Value |
| :--- | :--- |
| **Total Held-Out Test Cases** | 180 |
| **Correct Predictions** | 159 |
| **Misclassified Cases** | 21 |
| **Accuracy** | **0.8833** (88.33%) |
| **Macro Precision** | **0.8697** |
| **Macro Recall** | **0.8814** |
| **Macro F1-Score** | **0.8748** |
| **Weighted Precision** | **0.8846** |
| **Weighted Recall** | **0.8833** |
| **Weighted F1-Score** | **0.8835** |
| **ROC-AUC (OvR Macro)** | **0.9691** |
| **ROC-AUC (OvR Weighted)** | **0.9599** |
| **PR-AUC (Macro)** | **0.9429** |
| **PR-AUC (Weighted)** | **0.9494** |
| **Multiclass Brier Score** | **0.2376** |
| **Log Loss** | **0.4330** |

---

## 2. Class-Level Performance Metrics

| Class | Precision | Recall | F1-Score | Support | ROC-AUC | PR-AUC | Brier Score |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Conditionally Feasible** | 0.9020 | 0.8932 | 0.8976 | 103 | 0.9434 | 0.9575 | 0.1209 |
| **Feasible** | 0.8889 | 0.8511 | 0.8696 | 47 | 0.9822 | 0.9493 | 0.0682 |
| **Infeasible** | 0.8182 | 0.9000 | 0.8571 | 30 | 0.9818 | 0.9218 | 0.0485 |

---

## 3. Confusion Matrix Breakdown

```text
Actual \ Predicted     Conditionally Feasible    Feasible    Infeasible
Conditionally Feasible           92                   5            6
Feasible                        7                   40            0
Infeasible                      3                   0            27
```

* **Correct Classifications:** 159 / 180 (88.33%)
* **Misclassifications:** 21 / 180 (11.67%)

---

## 4. Experiment 1B — Model Error Analysis

### Classification Error Distribution

| Actual Class | Predicted Class | Error Count | Pct of Total Errors (%) |
| :--- | :--- | :---: | :---: |
| **Conditionally Feasible** | Feasible | 5 | 23.81% |
| **Conditionally Feasible** | Infeasible | 6 | 28.57% |
| **Feasible** | Conditionally Feasible | 7 | 33.33% |
| **Infeasible** | Conditionally Feasible | 3 | 14.29% |

### Key Error Insights & Patterns
1. **Borderline Financial & Customer Demand Characteristics**: Misclassifications predominantly occur between **Conditionally Feasible** and neighboring classes (`Feasible` or `Infeasible`). These borderline profiles exhibit capital or customer volume near the decision threshold.
2. **Resource & Experience Ambiguity**: Profiles with moderate capital but low entrepreneur experience (or high demand score but high competition) represent boundary cases where tree splits create close probability distributions.

---

## 5. Representative Case Analysis

| Case Type | Case ID | Category | District | Capital (LKR) | Actual Class | Predicted Class | Confidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Correct Conditionally Feasible** | C00193 | Grocery/Mini-Mart | Colombo | 175,175 | Conditionally Feasible | Conditionally Feasible | 0.5350 |
| **Misclassified Conditionally Feasible** | C00944 | Beauty Saloon | Colombo | 58,457 | Conditionally Feasible | Infeasible | 0.5200 |
| **Correct Feasible** | C00658 | Clothing/ Garment | Colombo | 366,413 | Feasible | Feasible | 0.6100 |
| **Misclassified Feasible** | C00546 | Clothing/ Garment | Colombo | 457,115 | Feasible | Conditionally Feasible | 0.5900 |
| **Correct Infeasible** | C01068 | Beauty Saloon | Colombo | 20,174 | Infeasible | Infeasible | 0.5500 |
| **Misclassified Infeasible** | C00783 | Bakery/Food/Grocery | Colombo | 15,280 | Infeasible | Conditionally Feasible | 0.5800 |

---

## 6. Research Interpretation & Limitations
* **Model Effectiveness**: The Random Forest Classifier demonstrates strong multi-class discrimination (Macro F1: 0.8748, Weighted F1: 0.8835, ROC-AUC OvR: 0.9691) on the held-out test split.
* **Probability Calibration**: The Brier score (0.2376) and log loss (0.4330) indicate reasonable probability alignment, though probabilities in decision-boundary regions tend to show moderate overconfidence.
* **Limitations**: Model predictions reflect learned patterns in the training dataset ($N=1,200$). Feasibility classification does not constitute a guarantee of real-world business success.
