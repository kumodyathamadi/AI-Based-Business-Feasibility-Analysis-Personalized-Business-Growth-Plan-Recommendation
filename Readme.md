# AI-Based Business Feasibility Analysis & Personalized Business Plan Recommendation

## 📌 Project Overview

This project is **Component 1** of the research project **“AI-Driven SME Business Lifecycle Decision Support System”**.

The aim of this component is to develop an **AI-based decision-support system for evaluating business feasibility and recommending suitable business strategies and personalized business plans** for Small and Medium-sized Enterprises (SMEs).

The system is designed to support two main situations:

* **New business proposals** – helping potential entrepreneurs evaluate whether a proposed business idea is feasible.
* **Existing SME growth proposals** – helping existing businesses evaluate proposed expansion or growth activities.

The system uses **machine learning, explainable AI (XAI), multi-objective decision-making, What-If analysis, and personalized recommendation techniques** to provide evidence-based business decision support.

> **Important:** The system provides decision support based on available data and defined assumptions. It does not guarantee that a business will succeed.

---

# 🎯 Research Objective

The main objective of this component is to develop an AI-based system that can:

1. Predict the feasibility of a proposed business or business-growth decision.
2. Explain the main factors influencing the feasibility prediction.
3. Generate and evaluate alternative business strategies.
4. Rank strategies according to multiple business objectives and constraints.
5. Perform What-If and counterfactual analysis.
6. Generate a personalized business or growth plan based on the user's situation.
7. Provide structured and explainable recommendations suitable for Sri Lankan SMEs.

---

# 💡 Research Contribution

The main research contribution focuses on a **Sri Lankan multi-objective feasibility recommendation approach**.

Instead of only predicting whether a business is feasible, the proposed system aims to consider multiple factors such as:

* Available capital
* Loan requirements
* Monthly budget
* Expected selling price
* Expected customers
* Customer demand
* Competition
* Location suitability
* Entrepreneur experience
* Staff availability
* Equipment availability
* Supplier availability
* Business type
* Business stage
* Proposed business action

The system then uses these factors to support business strategy selection and personalized recommendations.

### Key Research Features

### 1. Multi-Objective Feasibility Recommendation

The system considers multiple business objectives and constraints rather than relying only on a single feasibility score.

Potential strategies can be evaluated based on factors such as:

* Financial requirements
* Market potential
* Operational feasibility
* Resource availability
* Location suitability
* Business constraints
* Uncertainty

### 2. Explainable AI

The system does not only provide a prediction.

It also aims to answer:

> **“Why was this business classified as Feasible, Conditionally Feasible, or Infeasible?”**

SHAP-based explanations will be used to identify important factors contributing to model predictions.

### 3. What-If and Counterfactual Analysis

The system will allow users to investigate alternative scenarios.

Examples:

* What if the available capital is increased?
* What if the loan amount is reduced?
* What if the business location is changed?
* What if expected customer demand increases?
* What if competition becomes higher?
* What if additional staff are available?

The objective is to identify changes that could potentially improve the feasibility outcome under the model's assumptions.

### 4. Personalized Business Plan Recommendation

Based on the feasibility result, user information, constraints, and selected strategy, the system will generate a structured business or growth plan.

The recommendation will be personalized according to the user's business situation rather than producing the same generic plan for every business.

---

# 🧠 Proposed System Workflow

```text
Business / User Data
        ↓
Data Preprocessing
        ↓
Feasibility Prediction
        ↓
Explainability (SHAP)
        ↓
Local Business Insights
        ↓
Alternative Strategy Generation
        ↓
TOPSIS / Multi-Criteria Ranking
        ↓
What-If Analysis
        ↓
Counterfactual Analysis
        ↓
Personalized Business / Growth Plan
        ↓
Structured Business Profile
```

---

# 🤖 Machine Learning Approach

The initial feasibility prediction problem is formulated as a **multi-class classification problem**.

The target variable contains three classes:

```text
Feasible
Conditionally Feasible
Infeasible
```

Two machine learning models were initially evaluated:

* Logistic Regression
* Random Forest Classifier

Logistic Regression is used as a baseline model, while Random Forest is evaluated as a more flexible tree-based model.

---

# 📊 Dataset

The current core dataset contains approximately **1,200 business feasibility records**.

The dataset contains business, financial, market, location, and operational/resource-related attributes.

### Main Features

| Feature                             | Description                            |
| ----------------------------------- | -------------------------------------- |
| `business_stage`                    | New or existing business stage         |
| `business_category`                 | Business category                      |
| `business_description`              | Short description of the business idea |
| `district`                          | Business location district             |
| `province`                          | Province                               |
| `location_type`                     | Type of business location              |
| `proposed_action`                   | Proposed business/growth action        |
| `available_capital_lkr`             | Available capital in LKR               |
| `loan_amount_lkr`                   | Required loan amount                   |
| `monthly_budget_lkr`                | Monthly budget                         |
| `initial_inventory_cost_lkr`        | Initial inventory requirement          |
| `expected_price_lkr`                | Expected selling price                 |
| `expected_customers_per_day`        | Expected daily customers               |
| `competition_level`                 | Competition level                      |
| `customer_demand_score`             | Estimated customer demand              |
| `expected_operating_days_per_month` | Expected operating days                |
| `entrepreneur_experience_years`     | Entrepreneur experience                |
| `location_suitability_score`        | Suitability of proposed location       |
| `available_staff_count`             | Available staff                        |
| `required_staff_count`              | Required staff                         |
| `available_equipment_score`         | Available equipment/resources          |
| `required_equipment_score`          | Required equipment/resources           |
| `supplier_availability_score`       | Supplier availability                  |
| `feasibility_label`                 | Target feasibility class               |

The raw `business_description` field is retained for future use in business-plan generation, contextual analysis, or NLP-based functionality. It is currently excluded from the main tabular feasibility model.

---

# 🧹 Data Preprocessing

The preprocessing pipeline includes:

* Missing-value handling
* Numerical feature imputation
* Categorical feature imputation
* Numerical feature standardization
* Categorical feature encoding
* Feature transformation
* Stratified dataset splitting

### Numerical Features

Numerical features are processed using:

```text
Median Imputation
        ↓
StandardScaler
```

### Categorical Features

Categorical features are processed using:

```text
Most-Frequent Imputation
        ↓
One-Hot Encoding
```

Unknown categorical values are handled using:

```python
OneHotEncoder(handle_unknown="ignore")
```

---

# 📚 Dataset Split

The dataset is divided using a stratified **70/15/15 split**:

| Dataset    | Records |
| ---------- | ------: |
| Training   |     840 |
| Validation |     180 |
| Testing    |     180 |
| Total      |   1,200 |

Stratification is used to preserve the class distribution across the datasets.

---

# 📈 Model Evaluation

The models are evaluated using:

* Accuracy
* Precision
* Recall
* F1-score
* Macro F1-score
* ROC-AUC
* PR-AUC
* Confusion Matrix
* Classification Report

Since feasibility prediction is a decision-support task, particular attention is given to the identification of **Infeasible** proposals.

---

# 🏆 Current Model Results

The current test-set results are:

| Metric             | Logistic Regression | Random Forest |
| ------------------ | ------------------: | ------------: |
| Accuracy           |              75.00% |    **88.33%** |
| Weighted Precision |                0.75 |      **0.88** |
| Weighted Recall    |                0.75 |      **0.88** |
| Weighted F1        |                0.75 |      **0.88** |
| Macro F1           |                0.73 |      **0.87** |
| ROC-AUC            |              0.8853 |    **0.9599** |
| PR-AUC             |              0.8580 |    **0.9494** |

### Random Forest Class-Level Results

| Class                  | Precision | Recall | F1-score |
| ---------------------- | --------: | -----: | -------: |
| Conditionally Feasible |      0.90 |   0.89 |     0.90 |
| Feasible               |      0.89 |   0.85 |     0.87 |
| Infeasible             |      0.82 |   0.90 |     0.86 |

The Random Forest achieved **159 correct predictions out of 180 test records**, resulting in an accuracy of **88.33%**.

The model also achieved a **0.9599 weighted ROC-AUC** and **0.9494 weighted PR-AUC** on the current test set.

Based on these results, Random Forest is being carried forward as the **candidate/main model for subsequent explainability analysis**.

---

# 🔍 Explainable AI (XAI)

The project uses **SHAP (SHapley Additive exPlanations)** to provide interpretable explanations for machine learning predictions.

Current SHAP implementation:

```text
SHAP Version: 0.52.0
```

The XAI module will provide:

### Global Explanation

Identify which features are generally most important for feasibility prediction.

Example:

```text
Customer Demand
Location Suitability
Available Capital
Competition
Entrepreneur Experience
Staff Availability
```

### Class-Level Explanation

Identify factors contributing to:

* Feasible predictions
* Conditionally Feasible predictions
* Infeasible predictions

### Individual Business Explanation

For an individual business proposal, the system will provide an explanation such as:

```text
Prediction:
Conditionally Feasible

Important contributing factors:
+ High customer demand
+ Suitable location
+ Adequate entrepreneur experience
- Limited available staff
- High competition
```

The actual explanations will be generated from the trained model rather than manually assigned.

---

# 🔄 What-If Analysis

The What-If module will allow users to modify selected business assumptions and observe how the predicted feasibility changes.

Example:

```text
Current Scenario
Available Capital = LKR 500,000
Expected Customers = 20/day
Competition = Medium

Prediction:
Conditionally Feasible
```

Alternative scenario:

```text
What-If Scenario
Available Capital = LKR 750,000
Expected Customers = 25/day
Competition = Medium

Prediction:
Feasible
```

The purpose is to help users understand how changes in assumptions can affect the model's decision.

---

# 🔁 Counterfactual Recommendation

The counterfactual component will identify meaningful changes that could potentially move a business proposal toward a different feasibility class.

For example:

```text
Current:
Conditionally Feasible

Potential changes:
- Increase available capital
- Improve location suitability
- Increase available staff
- Reduce required equipment
```

The system will focus on realistic changes that respect predefined constraints.

---

# 🏅 TOPSIS-Based Strategy Ranking

The project will use **TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)** as part of the multi-objective strategy recommendation process.

Candidate strategies can be evaluated using criteria such as:

* Cost
* Expected revenue
* Market potential
* Operational feasibility
* Resource requirements
* Location suitability
* Customer demand
* Competition
* Business constraints

The objective is to rank feasible alternatives based on multiple criteria rather than selecting a strategy using a single metric.

---

# 📋 Personalized Business Plan

The final stage will generate a structured business or growth plan based on:

* Business type
* Business idea
* Business stage
* Available capital
* Funding requirements
* Target customers
* Location
* Market conditions
* Available resources
* Feasibility result
* Selected strategy
* What-If results
* User constraints

The plan will be structured into appropriate sections such as:

```text
Business Overview
        ↓
Target Market
        ↓
Recommended Strategy
        ↓
Operational Requirements
        ↓
Resource Requirements
        ↓
Financial Considerations
        ↓
Marketing Approach
        ↓
Implementation Steps
        ↓
Potential Constraints
        ↓
Recommended Next Actions
```

---

# 🏗️ Project Structure

```text
Component_1/
│
├── data/
│   ├── raw/
│   │   └── Component_One_Core_Feasibility.csv
│   │
│   └── processed/
│
├── models/
│
├── notebooks/
│   ├── 01_data_audit.ipynb
│   ├── 02_preprocessing.ipynb
│   ├── 03_model_training.ipynb
│   ├── 04_model_evaluation.ipynb
│   └── 05_shap_explainability.ipynb
│
├── src/
│   ├── preprocessing/
│   ├── feasibility/
│   ├── explainability/
│   ├── strategy/
│   ├── topsis/
│   ├── what_if/
│   └── plan_generation/
│
├── backend/
│
├── frontend/
│
├── tests/
│
├── reports/
│
├── requirements.txt
│
└── README.md
```

---

# 🛠️ Technologies

## Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* Random Forest
* Logistic Regression

## Explainable AI

* SHAP

## Data Processing

* Pandas
* NumPy
* Scikit-learn preprocessing pipelines

## Decision Making

* TOPSIS
* Multi-Criteria Decision Making (MCDM)

## Frontend

* React

## Backend

* Python-based backend/API

## Database

* PostgreSQL

---

# 🔬 Research Development Pipeline

The implementation follows the following development stages:

```text
1. Requirements Analysis
        ↓
2. Dataset Preparation
        ↓
3. Data Audit
        ↓
4. Data Preprocessing
        ↓
5. Feasibility Model Development
        ↓
6. Model Evaluation
        ↓
7. Explainable AI / SHAP
        ↓
8. Strategy Generation
        ↓
9. TOPSIS Ranking
        ↓
10. What-If Analysis
        ↓
11. Counterfactual Analysis
        ↓
12. Personalized Business Plan
        ↓
13. Structured Business Profile
        ↓
14. Backend API
        ↓
15. React Frontend
        ↓
16. System Testing & Evaluation
```

---

# 📌 Current Development Status

| Component                       | Status         |
| ------------------------------- | -------------- |
| Dataset preparation             | ✅ Completed    |
| Dataset audit                   | ✅ Completed    |
| Train/Validation/Test split     | ✅ Completed    |
| Data preprocessing              | ✅ Completed    |
| Logistic Regression             | ✅ Completed    |
| Random Forest                   | ✅ Completed    |
| Model evaluation                | ✅ Completed    |
| ROC-AUC evaluation              | ✅ Completed    |
| PR-AUC evaluation               | ✅ Completed    |
| Random Forest selection for XAI | 🔄 In Progress |
| SHAP implementation             | 🔄 In Progress |
| Strategy generation             | ⏳ Planned      |
| TOPSIS ranking                  | ⏳ Planned      |
| What-If analysis                | ⏳ Planned      |
| Counterfactual analysis         | ⏳ Planned      |
| Personalized business plan      | ⏳ Planned      |
| Backend API                     | ⏳ Planned      |
| React frontend                  | ⏳ Planned      |
| PostgreSQL integration          | ⏳ Planned      |
| Final system evaluation         | ⏳ Planned      |

---

# 🎓 Research Scope

This repository focuses specifically on **Component 1** of the larger:

> **AI-Driven SME Business Lifecycle Decision Support System**

Component 1 focuses on:

> **AI-Based Business Feasibility Analysis & Personalized Business Plan Recommendation**

The other research components cover different areas such as:

* Legal, regulatory and ethical requirements
* Financial monitoring and tax analysis
* Fraud/anomaly detection
* Business risk prediction
* Mitigation and scalable growth recommendations

These components are outside the current standalone development scope of this repository.

---

# 👥 Target Users

The proposed system is primarily intended to support:

### New Entrepreneurs

Individuals who want to evaluate a new business idea before investing significant resources.

### Existing SMEs

Existing businesses that want to evaluate expansion, growth, or operational improvement proposals.

### Business Advisors

The system can potentially support advisors and development organizations by providing structured, explainable business analysis.

---

# 🌏 Target Context

The research focuses on **Small and Medium-sized Enterprises (SMEs) in Sri Lanka**, with the research dataset and validation scope focusing on **Colombo District / Colombo-related areas**.

The initial business categories include:

* Bakery / Small Food Business
* Clothing / Fashion Retail
* Grocery / Mini-Mart
* Beauty Salon / Personal Care
* IT / Digital Services

---

# ⚠️ Limitations

The system's predictions depend on:

* Dataset quality
* Available business information
* Model assumptions
* Feature availability
* Data distribution
* Quality of feasibility labels
* Accuracy of user-provided estimates

Therefore, the system should be considered a **decision-support tool**, not a replacement for professional business, financial, legal, or market advice.

Model performance reported in this repository is based on the current dataset and test split and may not represent performance on unseen real-world populations.

---

# 🚀 Future Improvements

Future development will focus on:

* SHAP-based global and individual explanations
* Improved feasibility modelling
* Strategy generation
* TOPSIS-based multi-objective ranking
* What-If scenario analysis
* Counterfactual recommendations
* Personalized business-plan generation
* Structured Business Profile
* PostgreSQL integration
* REST API development
* React-based user interface
* Real-world SME validation
* Expert evaluation
* Usability evaluation
* Integration with the other research components

---

# 📖 Research Significance

The proposed system aims to move beyond simple business feasibility prediction by combining:

```text
Prediction
    +
Explainability
    +
Multi-Objective Decision Making
    +
What-If Analysis
    +
Counterfactual Reasoning
    +
Personalized Recommendation
```

This provides a more comprehensive approach to AI-supported business decision-making for SMEs.

---

# 👨‍💻 Project Information

**Project:** AI-Driven SME Business Lifecycle Decision Support System
**Component:** Component 1
**Component Title:** AI-Based Business Feasibility Analysis & Personalized Business Plan Recommendation
**Project ID:** J26-IT-362
**Student:** Kumodya Thamadi
**Student ID:** IT23331136
**Institution:** Sri Lanka Institute of Information Technology (SLIIT)

---

# 📄 License

This project is developed as part of an academic research project.
The source code, dataset, research materials, and implementation details are intended primarily for academic and research purposes.
