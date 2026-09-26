import pandas as pd
import numpy as np
from typing import Dict, Any, List
from src.preprocessing.preprocessor import validate_and_format_input


class WhatIfEngine:
    """
    Assumption-Aware What-If Scenario Simulation Engine.
    Passes modified user input scenarios through the exact same preprocessing and Random Forest model.
    """

    def __init__(self, predictor):
        self.predictor = predictor

    def simulate_scenarios(
        self,
        base_input_dict: Dict[str, Any],
        base_prediction: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Simulates predefined assumption shifts (e.g. +50% capital, +30% customers, +loan)
        and measures probability shifts against base state.
        """
        base_probs = base_prediction["probabilities"]
        base_feasible_prob = base_probs.get("Feasible", 0.0)

        scenarios_to_test = [
            {
                "scenario_id": "SCEN_01",
                "title": "+50% Capital Injection",
                "modifications": {
                    "available_capital_lkr": base_input_dict.get("available_capital_lkr", 500000.0) * 1.5
                },
                "rationale": "Test sensitivity to additional equity or family capital injection."
            },
            {
                "scenario_id": "SCEN_02",
                "title": "Secured SME Working Loan (LKR 500,000)",
                "modifications": {
                    "loan_amount_lkr": base_input_dict.get("loan_amount_lkr", 0.0) + 500000.0,
                    "available_capital_lkr": base_input_dict.get("available_capital_lkr", 500000.0) + 500000.0
                },
                "rationale": "Assess impact of formal bank credit line."
            },
            {
                "scenario_id": "SCEN_03",
                "title": "+30% Customer Footfall Boost",
                "modifications": {
                    "expected_customers_per_day": int(base_input_dict.get("expected_customers_per_day", 30) * 1.3),
                    "customer_demand_score": min(100, int(base_input_dict.get("customer_demand_score", 60) + 15))
                },
                "rationale": "Simulate successful targeted marketing & footfall growth."
            },
            {
                "scenario_id": "SCEN_04",
                "title": "Optimized Operating Cost (-20% Monthly Budget)",
                "modifications": {
                    "monthly_budget_lkr": base_input_dict.get("monthly_budget_lkr", 100000.0) * 0.8
                },
                "rationale": "Test lean operational efficiency impact."
            }
        ]

        results = []
        for scen in scenarios_to_test:
            mod_input = base_input_dict.copy()
            mod_input.update(scen["modifications"])

            mod_df, mod_cleaned = validate_and_format_input(mod_input)
            mod_pred = self.predictor.predict_feasibility(mod_df)

            mod_feasible_prob = mod_pred["probabilities"].get("Feasible", 0.0)
            prob_delta = round(mod_feasible_prob - base_feasible_prob, 4)

            results.append({
                "scenario_id": scen["scenario_id"],
                "title": scen["title"],
                "modifications": scen["modifications"],
                "rationale": scen["rationale"],
                "new_prediction": mod_pred["prediction"],
                "new_probabilities": mod_pred["probabilities"],
                "feasibility_probability_delta": prob_delta,
                "impact_summary": (
                    f"Feasibility probability shifted from {base_feasible_prob:.2%} to {mod_feasible_prob:.2%} "
                    f"({'+' if prob_delta >= 0 else ''}{prob_delta:.2%})."
                )
            })

        return results


class CounterfactualSearchEngine:
    """
    Finds minimum boundary adjustments in available capital, monthly budget, or expected customer demand
    required to elevate a business state into a 'Feasible' outcome.
    """

    def __init__(self, predictor):
        self.predictor = predictor

    def find_counterfactual(self, base_input_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Grid searches minimum capital increment required to reach Feasible probability >= 0.50.
        """
        base_capital = float(base_input_dict.get("available_capital_lkr", 500000.0))
        target_found = False
        optimal_capital = base_capital
        step = 50000.0
        max_multiplier = 4.0

        current_cap = base_capital
        best_prob = 0.0
        best_pred = "Infeasible"

        while current_cap <= base_capital * max_multiplier:
            test_input = base_input_dict.copy()
            test_input["available_capital_lkr"] = current_cap
            test_df, _ = validate_and_format_input(test_input)
            test_pred = self.predictor.predict_feasibility(test_df)

            feas_prob = test_pred["probabilities"].get("Feasible", 0.0)
            if test_pred["prediction"] == "Feasible" or feas_prob >= 0.50:
                target_found = True
                optimal_capital = current_cap
                best_prob = feas_prob
                best_pred = test_pred["prediction"]
                break

            current_cap += step

        if target_found:
            capital_needed = optimal_capital - base_capital
            return {
                "counterfactual_found": True,
                "target_outcome": best_pred,
                "target_feasible_probability": round(best_prob, 4),
                "required_capital_lkr": round(optimal_capital, 2),
                "additional_capital_needed_lkr": round(capital_needed, 2),
                "recommendation": (
                    f"Increasing available capital by LKR {capital_needed:,.2f} (total LKR {optimal_capital:,.2f}) "
                    f"elevates predicted feasibility to '{best_pred}' with {best_prob:.2%} confidence."
                )
            }
        else:
            return {
                "counterfactual_found": False,
                "target_outcome": "Feasible",
                "recommendation": "Multiple operational dimensions (capital, demand, equipment) require joint enhancement."
            }
