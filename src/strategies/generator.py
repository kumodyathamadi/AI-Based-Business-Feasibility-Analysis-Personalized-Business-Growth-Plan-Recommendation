from typing import Dict, Any, List


class SMEStrategyGenerator:
    """
    Context-Aware Strategy Generation Engine.
    Generates structured, multi-objective alternative strategic options for an SME based on
    business profile, model feasibility prediction, and local SHAP explanation drivers.
    """

    def generate_strategies(
        self,
        cleaned_input: Dict[str, Any],
        feasibility_result: Dict[str, Any],
        shap_explanation: Dict[str, Any]
    ) -> List[Dict[str, Any]]:

        stage = cleaned_input.get("business_stage", "New")
        category = cleaned_input.get("business_category", "Retail")
        capital = cleaned_input.get("available_capital_lkr", 500000.0)
        budget = cleaned_input.get("monthly_budget_lkr", 100000.0)
        customers = cleaned_input.get("expected_customers_per_day", 30)
        competition = cleaned_input.get("competition_level", "Moderate")
        prediction = feasibility_result.get("prediction", "Conditionally Feasible")

        # Extract top negative drivers as constraint focus points
        negative_drivers = shap_explanation.get("top_negative_drivers", [])
        top_hurdle = negative_drivers[0]["feature"] if negative_drivers else "Capital & Working Reserve"

        strategies = []

        # Strategy 1: Lean Operational Bootstrapping Strategy
        s1_capital = round(capital * 0.60, 2)
        s1_budget = round(budget * 0.75, 2)
        strategies.append({
            "strategy_id": "STRAT_01",
            "strategy_name": f"Lean Bootstrapped Launch ({category})",
            "strategic_focus": "Risk Mitigation & Capital Preservation",
            "operational_approach": (
                f"Optimize initial setup for {category} by operating lean. Focus on essential equipment "
                f"and low-cost marketing to mitigate constraint around {top_hurdle}."
            ),
            "estimated_capital_required_lkr": s1_capital,
            "estimated_monthly_budget_lkr": s1_budget,
            "target_daily_customers": int(customers * 0.8),
            "implementation_complexity": "Low",
            "expected_feasibility_impact": "High Risk Reduction (+15% Feasibility Probability)",
            "criteria_scores": {
                "financial_viability": 8.5,
                "implementation_feasibility": 9.0,
                "market_demand_alignment": 7.0,
                "operational_risk": 3.0,  # Cost criteria (lower is better)
                "resource_efficiency": 8.8
            }
        })

        # Strategy 2: Aggressive Market Penetration & Scale Strategy
        s2_capital = round(capital * 1.10, 2)
        s2_budget = round(budget * 1.25, 2)
        strategies.append({
            "strategy_id": "STRAT_02",
            "strategy_name": f"Market Expansion & Customer Acquisition ({category})",
            "strategic_focus": "Demand Generation & High Volume",
            "operational_approach": (
                f"Invest heavily in targeted local promotions and location visibility to overcome {competition} "
                f"competition level and capture high market demand."
            ),
            "estimated_capital_required_lkr": s2_capital,
            "estimated_monthly_budget_lkr": s2_budget,
            "target_daily_customers": int(customers * 1.3),
            "implementation_complexity": "Moderate to High",
            "expected_feasibility_impact": "High Revenue Potential (Requires Micro-Loan buffer)",
            "criteria_scores": {
                "financial_viability": 7.5,
                "implementation_feasibility": 7.2,
                "market_demand_alignment": 9.2,
                "operational_risk": 6.5,  # Cost criteria
                "resource_efficiency": 7.5
            }
        })

        # Strategy 3: Digital & Direct-to-Consumer Partnership Strategy
        s3_capital = round(capital * 0.75, 2)
        s3_budget = round(budget * 0.85, 2)
        strategies.append({
            "strategy_id": "STRAT_03",
            "strategy_name": "Hybrid Digital & Local Delivery Model",
            "strategic_focus": "Digital Channel Expansion & Low Fixed Cost",
            "operational_approach": (
                f"Combine small physical footprint with online ordering, social commerce, and local delivery "
                f"partnerships to maximize customer reach in {cleaned_input.get('district', 'Colombo')}."
            ),
            "estimated_capital_required_lkr": s3_capital,
            "estimated_monthly_budget_lkr": s3_budget,
            "target_daily_customers": int(customers * 1.1),
            "implementation_complexity": "Moderate",
            "expected_feasibility_impact": "Balanced Growth with Controlled Operating Expenditure",
            "criteria_scores": {
                "financial_viability": 8.2,
                "implementation_feasibility": 8.5,
                "market_demand_alignment": 8.8,
                "operational_risk": 4.2,  # Cost criteria
                "resource_efficiency": 8.5
            }
        })

        # Strategy 4: High Value Premium Niche Positioning
        s4_capital = round(capital * 0.90, 2)
        s4_budget = round(budget * 0.90, 2)
        strategies.append({
            "strategy_id": "STRAT_04",
            "strategy_name": "Premium Quality & Niche Differentiation",
            "strategic_focus": "High Margin & Customer Loyalty",
            "operational_approach": (
                f"Focus on premium product quality, customized service, and unique branding to achieve higher pricing "
                f"margins without depending on huge customer footfall."
            ),
            "estimated_capital_required_lkr": s4_capital,
            "estimated_monthly_budget_lkr": s4_budget,
            "target_daily_customers": int(customers * 0.7),
            "implementation_complexity": "Moderate",
            "expected_feasibility_impact": "High Profit Margin Stability",
            "criteria_scores": {
                "financial_viability": 8.0,
                "implementation_feasibility": 8.0,
                "market_demand_alignment": 7.8,
                "operational_risk": 4.8,  # Cost criteria
                "resource_efficiency": 8.0
            }
        })

        return strategies
