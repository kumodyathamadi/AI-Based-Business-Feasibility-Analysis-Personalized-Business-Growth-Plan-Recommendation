from typing import Dict, Any, List
from datetime import datetime, timezone


class StructuredProfileBuilder:
    """
    Standardized Machine-Readable Structured Business Profile Builder.
    Consolidates raw business profile, model prediction, SHAP explanations, TOPSIS rankings,
    What-If simulations, and personalized plan into a schema-versioned JSON artifact.
    """

    def build_profile(
        self,
        cleaned_input: Dict[str, Any],
        feasibility_result: Dict[str, Any],
        shap_explanation: Dict[str, Any],
        strategies: List[Dict[str, Any]],
        topsis_result: Dict[str, Any],
        what_if_scenarios: List[Dict[str, Any]],
        counterfactual: Dict[str, Any],
        business_plan: Dict[str, Any]
    ) -> Dict[str, Any]:

        timestamp = datetime.now(timezone.utc).isoformat()

        profile = {
            "metadata": {
                "schema_version": "1.0.0",
                "component": "Component_1_Feasibility_Analysis",
                "generated_at": timestamp,
                "target_region": "Sri Lanka - Colombo District focus"
            },
            "business_input": cleaned_input,
            "feasibility_analysis": {
                "predicted_label": feasibility_result["prediction"],
                "confidence_score": feasibility_result["confidence_score"],
                "probabilities": feasibility_result["probabilities"]
            },
            "explainability": {
                "base_value": shap_explanation["base_value"],
                "positive_drivers": shap_explanation["top_positive_drivers"],
                "negative_drivers": shap_explanation["top_negative_drivers"]
            },
            "strategic_recommendations": {
                "candidate_strategies": strategies,
                "topsis_ranking": topsis_result
            },
            "scenario_analysis": {
                "what_if_simulations": what_if_scenarios,
                "counterfactual_boundary": counterfactual
            },
            "personalized_business_plan": business_plan
        }

        return profile
