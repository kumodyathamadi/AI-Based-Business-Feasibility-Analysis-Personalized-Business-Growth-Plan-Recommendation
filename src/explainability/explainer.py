import os
import json
import shap
import numpy as np
import pandas as pd
from typing import Dict, Any, List

CLEAN_FEATURE_MAP = {
    "available_capital_lkr": "Available Capital (LKR)",
    "loan_amount_lkr": "Requested Loan Amount (LKR)",
    "monthly_budget_lkr": "Monthly Operating Budget (LKR)",
    "initial_inventory_cost_lkr": "Initial Inventory Cost (LKR)",
    "expected_price_lkr": "Expected Product Price (LKR)",
    "expected_customers_per_day": "Expected Daily Customers",
    "customer_demand_score": "Customer Demand Score (1-100)",
    "expected_operating_days_per_month": "Operating Days / Month",
    "entrepreneur_experience_years": "Entrepreneur Experience (Years)",
    "location_suitability_score": "Location Suitability Score (1-5)",
    "available_staff_count": "Available Staff Count",
    "required_staff_count": "Required Staff Count",
    "available_equipment_score": "Available Equipment Score (1-5)",
    "required_equipment_score": "Required Equipment Score (1-5)",
    "supplier_availability_score": "Supplier Availability Score (1-5)"
}


def clean_feature_name(raw_name: str) -> str:
    name = raw_name.replace("num__", "").replace("cat__", "")
    for k, v in CLEAN_FEATURE_MAP.items():
        if name == k:
            return v
        if name.startswith(k + "_"):
            val = name[len(k) + 1:]
            return f"{v} = '{val}'"
    return name.replace("_", " ").title()


class SHAPExplainerService:
    """
    SHAP Explainability Service for local feature attribution on individual business predictions.
    """

    def __init__(self, predictor):
        self.predictor = predictor
        self.model = predictor.model
        self.explainer = shap.TreeExplainer(self.model)
        self.feature_names = predictor.feature_names
        self.clean_feature_names = [clean_feature_name(fn) for fn in self.feature_names]
        self.classes = predictor.classes

    def explain_business(self, input_df: pd.DataFrame, prediction_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Computes local SHAP values for the given business input and formats positive & negative drivers.
        """
        dense_input = prediction_result["dense_input"]
        shap_explanation = self.explainer(dense_input)

        predicted_label = prediction_result["prediction"]
        pred_class_idx = self.classes.index(predicted_label)

        # Get SHAP values for the predicted class
        # Shape: (1, n_features, n_classes) -> (n_features,)
        if len(shap_explanation.values.shape) == 3:
            local_shap_values = shap_explanation.values[0, :, pred_class_idx]
            base_val = float(self.explainer.expected_value[pred_class_idx])
        else:
            local_shap_values = shap_explanation.values[0, :]
            base_val = float(self.explainer.expected_value)

        feature_attributions = []
        for i, (raw_fn, clean_fn) in enumerate(zip(self.feature_names, self.clean_feature_names)):
            shap_val = float(local_shap_values[i])
            feature_attributions.append({
                "raw_feature": raw_fn,
                "feature_name": clean_fn,
                "shap_value": round(shap_val, 5),
                "abs_shap_value": round(abs(shap_val), 5)
            })

        # Sort attributions
        sorted_attributions = sorted(feature_attributions, key=lambda x: x["abs_shap_value"], reverse=True)

        positive_drivers = [
            {
                "feature": item["feature_name"],
                "impact_score": round(item["shap_value"], 4),
                "direction": "Positive Driver"
            }
            for item in sorted_attributions if item["shap_value"] > 0
        ][:7]

        negative_drivers = [
            {
                "feature": item["feature_name"],
                "impact_score": round(item["shap_value"], 4),
                "direction": "Hurdle / Constraint"
            }
            for item in sorted_attributions if item["shap_value"] < 0
        ][:7]

        return {
            "predicted_class": predicted_label,
            "base_value": round(base_val, 4),
            "top_positive_drivers": positive_drivers,
            "top_negative_drivers": negative_drivers,
            "all_attributions": sorted_attributions[:15]
        }
