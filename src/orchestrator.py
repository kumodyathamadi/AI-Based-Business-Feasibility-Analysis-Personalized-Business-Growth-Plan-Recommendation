import os
from typing import Dict, Any

from src.preprocessing.preprocessor import validate_and_format_input
from src.prediction.predictor import FeasibilityPredictor
from src.explainability.explainer import SHAPExplainerService
from src.strategies.generator import SMEStrategyGenerator
from src.topsis.ranker import TOPSISRanker
from src.what_if.simulator import WhatIfEngine, CounterfactualSearchEngine
from src.planning.planner import PersonalizedPlanGenerator
from src.profile.builder import StructuredProfileBuilder

_predictor_instance = None
_explainer_instance = None
_strategy_generator = None
_topsis_ranker = None
_what_if_engine = None
_counterfactual_engine = None
_plan_generator = None
_profile_builder = None


def _initialize_services():
    global _predictor_instance, _explainer_instance, _strategy_generator, _topsis_ranker
    global _what_if_engine, _counterfactual_engine, _plan_generator, _profile_builder

    if _predictor_instance is None:
        _predictor_instance = FeasibilityPredictor()
        _explainer_instance = SHAPExplainerService(_predictor_instance)
        _strategy_generator = SMEStrategyGenerator()
        _topsis_ranker = TOPSISRanker()
        _what_if_engine = WhatIfEngine(_predictor_instance)
        _counterfactual_engine = CounterfactualSearchEngine(_predictor_instance)
        _plan_generator = PersonalizedPlanGenerator()
        _profile_builder = StructuredProfileBuilder()


def analyze_business(raw_business_input: Dict[str, Any]) -> Dict[str, Any]:
    """
    End-to-End Central Business Feasibility & Decision Support Orchestrator.
    Passes a raw SME business input dictionary through the entire Component 1 research pipeline:
    1. Input Validation & Formatting
    2. Random Forest Feasibility Prediction & Probability Estimation
    3. Local SHAP Explainability & Feature Drivers
    4. Multi-Objective SME Strategy Generation
    5. TOPSIS Multi-Criteria Strategy Ranking
    6. What-If Scenario Analysis & Counterfactual Minimum Boundary Search
    7. Personalized 5-Section Business & Growth Plan Generation
    8. Standardized Machine-Readable Structured Business Profile JSON Assembly
    """
    _initialize_services()

    # Step 1: Preprocessing & Input Validation
    input_df, cleaned_input = validate_and_format_input(raw_business_input)

    # Step 2: Feasibility Prediction
    feasibility_result = _predictor_instance.predict_feasibility(input_df)

    # Step 3: SHAP Feature Attribution
    shap_explanation = _explainer_instance.explain_business(input_df, feasibility_result)

    # Step 4: SME Strategy Generation
    candidate_strategies = _strategy_generator.generate_strategies(
        cleaned_input, feasibility_result, shap_explanation
    )

    # Step 5: TOPSIS Multi-Criteria Strategy Ranking
    topsis_ranking = _topsis_ranker.rank_strategies(candidate_strategies)

    # Step 6: What-If Scenario Simulations & Counterfactual Search
    what_if_scenarios = _what_if_engine.simulate_scenarios(cleaned_input, feasibility_result)
    counterfactual = _counterfactual_engine.find_counterfactual(cleaned_input)

    # Step 7: Personalized Business & Growth Plan Generation
    personalized_plan = _plan_generator.generate_plan(
        cleaned_input,
        feasibility_result,
        shap_explanation,
        topsis_ranking,
        what_if_scenarios,
        counterfactual
    )

    # Step 8: Assemble Structured Business Profile JSON
    structured_profile = _profile_builder.build_profile(
        cleaned_input,
        feasibility_result,
        shap_explanation,
        candidate_strategies,
        topsis_ranking,
        what_if_scenarios,
        counterfactual,
        personalized_plan
    )

    return structured_profile
