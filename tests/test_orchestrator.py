import sys
import os
import json

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.orchestrator import analyze_business


def test_new_unseen_business():
    print("=" * 80)
    print("TESTING END-TO-END PIPELINE WITH A NEW UNSEEN SME INPUT")
    print("Business Case: Artisanal Bakery in Homagama, Colombo District")
    print("=" * 80)

    raw_new_business = {
        "business_stage": "New",
        "business_category": "Bakery",
        "district": "Colombo",
        "province": "Western",
        "location_type": "Suburban Commercial Hub (Homagama)",
        "proposed_action": "Establish New Bakery Branch",
        "available_capital_lkr": 800000.0,
        "loan_amount_lkr": 200000.0,
        "monthly_budget_lkr": 150000.0,
        "initial_inventory_cost_lkr": 180000.0,
        "expected_price_lkr": 350.0,
        "expected_customers_per_day": 45,
        "competition_level": "Moderate",
        "customer_demand_score": 75,
        "expected_operating_days_per_month": 26,
        "entrepreneur_experience_years": 4,
        "location_suitability_score": 4,
        "available_staff_count": 3,
        "required_staff_count": 3,
        "available_equipment_score": 4,
        "required_equipment_score": 4,
        "supplier_availability_score": 5
    }

    profile_result = analyze_business(raw_new_business)

    print("\n--- 1. FEASIBILITY RESULT ---")
    print("Prediction:", profile_result["feasibility_analysis"]["predicted_label"])
    print("Confidence Score:", profile_result["feasibility_analysis"]["confidence_score"])
    print("Probabilities:", json.dumps(profile_result["feasibility_analysis"]["probabilities"], indent=2))

    print("\n--- 2. SHAP EXPLANATION DRIVERS ---")
    print("Top Positive Drivers:")
    for d in profile_result["explainability"]["positive_drivers"]:
        print(f"  + {d['feature']}: {d['impact_score']}")

    print("Top Negative Hurdles:")
    for d in profile_result["explainability"]["negative_drivers"]:
        print(f"  - {d['feature']}: {d['impact_score']}")

    print("\n--- 3. STRATEGY GENERATION & TOPSIS RANKING ---")
    print("Top Recommended Strategy:", profile_result["strategic_recommendations"]["topsis_ranking"]["top_recommended_strategy"])
    print("Top Strategy TOPSIS Score:", profile_result["strategic_recommendations"]["topsis_ranking"]["top_topsis_score"])

    print("\n--- 4. WHAT-IF SCENARIOS ---")
    for scen in profile_result["scenario_analysis"]["what_if_simulations"]:
        print(f"  * {scen['title']} -> New Outcome: {scen['new_prediction']} (Delta: {scen['feasibility_probability_delta']:+.2%})")

    print("\n--- 5. PERSONALIZED PLAN EXECUTIVE SUMMARY ---")
    plan = profile_result["personalized_business_plan"]
    print("Summary:", plan["executive_overview"]["business_summary"])
    print("Action Roadmap (Phase 1):", plan["action_roadmap"]["phase_1_immediate_0_to_3_months"])

    print("\n--- 6. STRUCTURED PROFILE JSON METADATA ---")
    print("Schema Version:", profile_result["metadata"]["schema_version"])
    print("Generated At:", profile_result["metadata"]["generated_at"])

    # Output full profile to a file for artifact verification
    output_path = os.path.join("models", "feasibility_model", "test_new_business_profile_output.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(profile_result, f, indent=2)

    print(f"\nFull structured profile successfully written to {output_path}")
    print("=" * 80)
    print("END-TO-END ORCHESTRATOR TEST COMPLETED SUCCESSFULLY!")


if __name__ == "__main__":
    test_new_unseen_business()
