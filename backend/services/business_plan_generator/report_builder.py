import os
from datetime import datetime

class BusinessPlanReportBuilder:
    """
    Normalizes structured profile analysis results into a clean, comprehensive 
    BusinessPlanReport data dictionary for PDF and DOCX document generators.
    """

    @staticmethod
    def build_report_data(profile: dict) -> dict:
        metadata = profile.get("metadata", {})
        business_input = profile.get("business_input", {})
        feasibility_analysis = profile.get("feasibility_analysis", {})
        explainability = profile.get("explainability", {})
        strategic_recommendations = profile.get("strategic_recommendations", {})
        scenario_analysis = profile.get("scenario_analysis", {})
        personalized_business_plan = profile.get("personalized_business_plan", {})

        # Business Identity
        category = business_input.get("business_category", "SME Enterprise")
        stage = business_input.get("business_stage", "Startup")
        district = business_input.get("district", "Colombo")
        raw_name = business_input.get("business_name") or f"{district} {category}"
        business_name = raw_name.strip()

        # Date
        created_at_raw = metadata.get("created_at") or datetime.now().isoformat()
        try:
            date_str = datetime.fromisoformat(created_at_raw.replace("Z", "+00:00")).strftime("%B %d, %Y")
        except Exception:
            date_str = datetime.now().strftime("%B %d, %Y")

        # Feasibility Snapshot
        predicted_label = feasibility_analysis.get("predicted_label", "Conditionally Feasible")
        confidence_score = float(feasibility_analysis.get("confidence_score", 0.75))
        probabilities = feasibility_analysis.get("probabilities", {
            "Feasible": 0.25,
            "Conditionally Feasible": 0.65,
            "Infeasible": 0.10
        })

        # Financial Parameters
        capital = float(business_input.get("available_capital_lkr", 0.0))
        monthly_budget = float(business_input.get("monthly_budget_lkr", 0.0))
        customers_per_day = int(business_input.get("expected_customers_per_day", 0))
        expected_price = float(business_input.get("expected_price_lkr", 0.0))
        loan_required = capital < (monthly_budget * 6)

        # Operational Parameters
        experience = int(business_input.get("entrepreneur_experience_years", 0))
        staff_count = int(business_input.get("available_staff_count", 1))
        competition = business_input.get("competition_level", "Moderate")

        # Executive Overview & Plan Sections
        executive_overview = personalized_business_plan.get("executive_overview", {})
        operational_plan = personalized_business_plan.get("operational_plan", {})
        marketing_plan = personalized_business_plan.get("marketing_plan", {})
        financial_plan = personalized_business_plan.get("financial_plan", {})
        action_roadmap = personalized_business_plan.get("action_roadmap", {})

        # Key Drivers
        positive_drivers = explainability.get("positive_drivers", [])
        negative_drivers = explainability.get("negative_drivers", [])

        # Strategies & TOPSIS Ranking
        candidate_strategies = strategic_recommendations.get("candidate_strategies", [])
        topsis_ranking = strategic_recommendations.get("topsis_ranking", {})
        top_strategy = topsis_ranking.get("top_recommended_strategy", "Controlled Operational Growth")
        top_topsis_score = topsis_ranking.get("top_topsis_score", "0.7850")
        evaluation_criteria = topsis_ranking.get("evaluation_criteria", [])

        # Scenario Simulations
        what_if_simulations = scenario_analysis.get("what_if_simulations", [])

        # Build Normalized Report Dictionary
        report_data = {
            "metadata": {
                "record_id": metadata.get("record_id", "N/A"),
                "schema_version": metadata.get("schema_version", "1.1.0"),
                "generated_date": date_str,
                "system_brand": "SME360 AI",
                "document_title": "BUSINESS PLAN",
                "document_subtitle": "AI-Assisted Business Feasibility & Growth Planning",
            },
            "business_identity": {
                "business_name": business_name,
                "business_category": category,
                "business_stage": stage,
                "district": district,
                "prepared_for": f"{business_name} Management",
            },
            "executive_summary": {
                "business_summary": executive_overview.get("business_summary", f"Strategic business and feasibility evaluation for a {stage.lower()} {category.lower()} operating in {district} district."),
                "predicted_label": predicted_label,
                "confidence_score": confidence_score,
                "confidence_percent": f"{(confidence_score * 100):.1f}%",
                "probabilities": probabilities,
                "stage_focus": "New Startup Launch Preparation" if stage == "New Startup" else "Existing Business Growth & Expansion",
            },
            "business_overview": {
                "category": category,
                "stage": stage,
                "district": district,
                "experience_years": experience,
                "staff_count": staff_count,
                "competition_level": competition,
                "has_loans": business_input.get("has_existing_loans", False),
                "has_equipment": business_input.get("has_equipment", False),
                "has_suppliers": business_input.get("has_supplier_contacts", False),
            },
            "financial_overview": {
                "available_capital_lkr": capital,
                "monthly_budget_lkr": monthly_budget,
                "expected_price_lkr": expected_price,
                "estimated_monthly_revenue_lkr": customers_per_day * expected_price * 26, # 26 operating days/month
                "loan_required": loan_required,
                "guidance_summary": financial_plan.get("counterfactual_guidance", "Maintain a 6-month capital buffer for working capital stability."),
            },
            "market_analysis": {
                "expected_customers_per_day": customers_per_day,
                "target_monthly_customers": customers_per_day * 26,
                "competition_level": competition,
                "demand_score": marketing_plan.get("demand_score", "Moderate Market Demand"),
                "target_customer_desc": marketing_plan.get("target_daily_customers", f"{customers_per_day} target daily customers in {district}."),
            },
            "operational_plan": {
                "staffing_requirements": operational_plan.get("staffing_requirements", f"Current staff allocation: {staff_count} employee(s)."),
                "equipment_readiness": operational_plan.get("equipment_readiness", "Essential operating equipment requirements identified."),
            },
            "key_business_factors": {
                "positive_enablers": positive_drivers,
                "risk_hurdles": negative_drivers,
            },
            "strategies": candidate_strategies,
            "strategy_priorities": {
                "top_recommended_strategy": top_strategy,
                "top_topsis_score": top_topsis_score,
                "ranked_strategies": topsis_ranking.get("ranked_strategies", candidate_strategies),
                "evaluation_criteria": evaluation_criteria,
            },
            "scenarios": what_if_simulations,
            "action_roadmap": {
                "phase_1": action_roadmap.get("phase_1_immediate_0_to_3_months", [
                    "Verify initial working capital buffer and set up accounting controls.",
                    "Finalize equipment acquisition and supplier agreements.",
                    "Initiate targeted local marketing campaign in district."
                ]),
                "phase_2": action_roadmap.get("phase_2_stabilization_3_to_12_months", [
                    "Optimize operational throughput to hit daily customer target.",
                    "Monitor monthly cash flow against operating budget limits.",
                    "Conduct quarterly competitor price benchmark."
                ]),
                "phase_3": action_roadmap.get("phase_3_growth_1_year_plus", [
                    "Evaluate secondary product lines or additional staffing requirements.",
                    "Explore digital sales channels or secondary district expansion."
                ])
            },
            "assumptions_and_considerations": [
                "Feasibility classification and decision rankings are model-based analytical estimates derived from Sri Lankan SME empirical datasets.",
                "Financial projections assume 26 active operating days per calendar month and steady unit pricing.",
                "External macroeconomic conditions, tax policy alterations, and unexpected inflation are not dynamically modelled.",
                "Entrepreneur should perform on-the-ground market validation before committing heavy capital investments."
            ],
            "raw_profile": profile
        }

        return report_data
