from typing import Dict, Any, List


class PersonalizedPlanGenerator:
    """
    Personalized Business & Growth Plan Generator.
    Synthesizes ML feasibility prediction, SHAP explanation drivers, TOPSIS strategy ranking,
    and What-If scenarios into a tailored 5-section strategic plan.
    """

    def generate_plan(
        self,
        cleaned_input: Dict[str, Any],
        feasibility_result: Dict[str, Any],
        shap_explanation: Dict[str, Any],
        topsis_result: Dict[str, Any],
        what_if_result: List[Dict[str, Any]],
        counterfactual: Dict[str, Any]
    ) -> Dict[str, Any]:

        category = cleaned_input.get("business_category", "SME Business")
        stage = cleaned_input.get("business_stage", "New")
        district = cleaned_input.get("district", "Colombo")
        capital = cleaned_input.get("available_capital_lkr", 500000.0)
        budget = cleaned_input.get("monthly_budget_lkr", 100000.0)
        prediction = feasibility_result.get("prediction", "Conditionally Feasible")

        top_strategy_name = topsis_result.get("top_recommended_strategy", "Lean Bootstrapped Launch")
        top_positive = [d["feature"] for d in shap_explanation.get("top_positive_drivers", [])[:3]]
        top_hurdles = [d["feature"] for d in shap_explanation.get("top_negative_drivers", [])[:3]]

        # Section 1: Executive Business Overview
        section_1 = {
            "title": "1. Executive Business Overview",
            "business_summary": (
                f"Evaluation for a {stage} {category} located in {district}, Sri Lanka. "
                f"The AI feasibility decision support system predicts an outcome of '{prediction}' "
                f"with {feasibility_result.get('confidence_score', 0.88):.1%} model confidence."
            ),
            "key_enablers": top_positive if top_positive else ["Local Location Suitability"],
            "key_risk_hurdles": top_hurdles if top_hurdles else ["Working Capital Reserve"],
            "recommended_primary_strategy": top_strategy_name
        }

        # Section 2: Operational & Resource Plan
        section_2 = {
            "title": "2. Operational Setup & Resource Management",
            "staffing_requirements": (
                f"Available Staff: {cleaned_input.get('available_staff_count', 2)} | "
                f"Required Staff: {cleaned_input.get('required_staff_count', 2)}. "
                f"{'Staff capacity is balanced.' if cleaned_input.get('available_staff_count', 2) >= cleaned_input.get('required_staff_count', 2) else 'Additional hiring required before launch.'}"
            ),
            "equipment_readiness": f"Equipment Score: {cleaned_input.get('available_equipment_score', 3)}/5 vs Required: {cleaned_input.get('required_equipment_score', 3)}/5.",
            "supplier_logistics": f"Supplier Availability Score: {cleaned_input.get('supplier_availability_score', 4)}/5 (Colombo SME Supply Network)."
        }

        # Section 3: Marketing & Customer Demand Strategy
        section_3 = {
            "title": "3. Marketing & Customer Acquisition",
            "demand_score": f"Customer Demand Index: {cleaned_input.get('customer_demand_score', 60)}/100",
            "target_daily_customers": cleaned_input.get("expected_customers_per_day", 30),
            "pricing_structure": f"LKR {cleaned_input.get('expected_price_lkr', 500):,.2f} per unit / service",
            "promotional_tactics": [
                f"Local targeted signage and community engagement in {district}.",
                "Digital social media presence targeting Colombo suburban consumers.",
                "Introductory pricing and bundled customer loyalty promotions."
            ]
        }

        # Section 4: Financial Planning & Working Capital
        section_4 = {
            "title": "4. Financial Planning & Capital Requirements",
            "available_capital_lkr": capital,
            "monthly_operating_budget_lkr": budget,
            "requested_loan_lkr": cleaned_input.get("loan_amount_lkr", 0.0),
            "capital_runway_months": round(capital / max(budget, 1.0), 1),
            "counterfactual_guidance": counterfactual.get("recommendation", "Financial reserve is adequate.")
        }

        # Section 5: Action Roadmap (0-3m, 3-12m, 1y+)
        section_5 = {
            "title": "5. Time-Phased Action Roadmap",
            "phase_1_immediate_0_to_3_months": [
                "Register business name and obtain local municipal authority permits.",
                f"Implement core operational strategy: {top_strategy_name}.",
                "Procure initial inventory and establish supplier agreement terms.",
                "Launch targeted local social media campaign."
            ],
            "phase_2_growth_3_to_12_months": [
                "Track monthly cash flow against LKR {:,.2f} operating budget.".format(budget),
                "Evaluate customer footfall and aim to hit target daily volume.",
                "Review What-If scenario results for potential capital expansion."
            ],
            "phase_3_scale_1_year_plus": [
                "Assess secondary location feasibility in neighboring Colombo hubs.",
                "Re-run AI Feasibility pipeline with actual 12-month operational metrics."
            ]
        }

        return {
            "plan_metadata": {
                "business_category": category,
                "district": district,
                "feasibility_label": prediction
            },
            "executive_overview": section_1,
            "operational_plan": section_2,
            "marketing_plan": section_3,
            "financial_plan": section_4,
            "action_roadmap": section_5
        }
