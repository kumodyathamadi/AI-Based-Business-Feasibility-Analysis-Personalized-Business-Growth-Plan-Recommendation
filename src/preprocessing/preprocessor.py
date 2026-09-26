import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple

# Schema definition for raw business inputs
REQUIRED_CATEGORICAL_FIELDS = [
    "business_stage",
    "business_category",
    "district",
    "province",
    "location_type",
    "proposed_action",
    "competition_level"
]

REQUIRED_NUMERICAL_FIELDS = [
    "available_capital_lkr",
    "loan_amount_lkr",
    "monthly_budget_lkr",
    "initial_inventory_cost_lkr",
    "expected_price_lkr",
    "expected_customers_per_day",
    "customer_demand_score",
    "expected_operating_days_per_month",
    "entrepreneur_experience_years",
    "location_suitability_score",
    "available_staff_count",
    "required_staff_count",
    "available_equipment_score",
    "required_equipment_score",
    "supplier_availability_score"
]

DEFAULT_VALUES = {
    "business_stage": "New",
    "business_category": "Retail",
    "district": "Colombo",
    "province": "Western",
    "location_type": "Commercial",
    "proposed_action": "Start New Business",
    "competition_level": "Moderate",
    "available_capital_lkr": 500000.0,
    "loan_amount_lkr": 0.0,
    "monthly_budget_lkr": 100000.0,
    "initial_inventory_cost_lkr": 150000.0,
    "expected_price_lkr": 500.0,
    "expected_customers_per_day": 30,
    "customer_demand_score": 60,
    "expected_operating_days_per_month": 26,
    "entrepreneur_experience_years": 2,
    "location_suitability_score": 4,
    "available_staff_count": 2,
    "required_staff_count": 2,
    "available_equipment_score": 3,
    "required_equipment_score": 3,
    "supplier_availability_score": 4
}


def validate_and_format_input(raw_input: Dict[str, Any]) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Validates a raw SME business input dictionary, enforces defaults for missing fields,
    casts numeric types, and returns both a 1-row Pandas DataFrame ready for the preprocessing pipeline
    and a cleaned input dictionary.
    """
    cleaned_input = {}

    # Validate Categorical Fields
    for field in REQUIRED_CATEGORICAL_FIELDS:
        val = raw_input.get(field)
        if val is None or str(val).strip() == "":
            cleaned_input[field] = DEFAULT_VALUES[field]
        else:
            cleaned_input[field] = str(val).strip()

    # Validate Numerical Fields
    for field in REQUIRED_NUMERICAL_FIELDS:
        val = raw_input.get(field)
        if val is None:
            cleaned_input[field] = DEFAULT_VALUES[field]
        else:
            try:
                num_val = float(val)
                if num_val < 0:
                    num_val = 0.0
                cleaned_input[field] = num_val
            except (ValueError, TypeError):
                cleaned_input[field] = DEFAULT_VALUES[field]

    # Convert integer fields cleanly
    int_fields = [
        "expected_customers_per_day", "customer_demand_score",
        "expected_operating_days_per_month", "entrepreneur_experience_years",
        "location_suitability_score", "available_staff_count",
        "required_staff_count", "available_equipment_score",
        "required_equipment_score", "supplier_availability_score"
    ]
    for field in int_fields:
        cleaned_input[field] = int(round(cleaned_input[field]))

    df = pd.DataFrame([cleaned_input])

    # Ensure correct column ordering matching raw dataset feature set
    ordered_columns = REQUIRED_NUMERICAL_FIELDS + REQUIRED_CATEGORICAL_FIELDS
    df = df[ordered_columns]

    return df, cleaned_input
