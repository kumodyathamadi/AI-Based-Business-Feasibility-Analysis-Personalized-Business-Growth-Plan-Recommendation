import numpy as np
import pandas as pd
from typing import List, Dict, Any

DEFAULT_CRITERIA = [
    "financial_viability",
    "implementation_feasibility",
    "market_demand_alignment",
    "operational_risk",
    "resource_efficiency"
]

# True = Benefit criterion (higher is better), False = Cost criterion (lower is better)
DEFAULT_CRITERIA_TYPES = {
    "financial_viability": True,
    "implementation_feasibility": True,
    "market_demand_alignment": True,
    "operational_risk": False,
    "resource_efficiency": True
}

DEFAULT_WEIGHTS = {
    "financial_viability": 0.25,
    "implementation_feasibility": 0.20,
    "market_demand_alignment": 0.25,
    "operational_risk": 0.15,
    "resource_efficiency": 0.15
}


class TOPSISRanker:
    """
    Mathematical TOPSIS Engine (Technique for Order Preference by Similarity to Ideal Solution).
    Performs vector normalization, weighted normalized matrix computation, ideal positive/negative
    solution identification, Euclidean distance metrics, and relative closeness score calculation.
    """

    def __init__(
        self,
        criteria: List[str] = None,
        criteria_types: Dict[str, bool] = None,
        weights: Dict[str, float] = None
    ):
        self.criteria = criteria or DEFAULT_CRITERIA
        self.criteria_types = criteria_types or DEFAULT_CRITERIA_TYPES
        self.weights = weights or DEFAULT_WEIGHTS

    def rank_strategies(self, strategies: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Executes TOPSIS multi-criteria ranking on a list of strategy dictionaries.
        """
        if not strategies or len(strategies) < 2:
            raise ValueError("TOPSIS requires at least 2 candidate strategies for evaluation.")

        n_strategies = len(strategies)
        n_criteria = len(self.criteria)

        # 1. Build Decision Matrix X (n_strategies x n_criteria)
        X = np.zeros((n_strategies, n_criteria))
        for i, strat in enumerate(strategies):
            scores = strat.get("criteria_scores", {})
            for j, crit in enumerate(self.criteria):
                X[i, j] = float(scores.get(crit, 5.0))

        # 2. Vector Normalization R
        denom = np.sqrt(np.sum(X ** 2, axis=0))
        denom[denom == 0] = 1.0  # Avoid zero division
        R = X / denom

        # 3. Weighted Normalized Matrix V
        w_vector = np.array([self.weights[crit] for crit in self.criteria])
        V = R * w_vector

        # 4. Identify Ideal Solutions V+ and V-
        V_plus = np.zeros(n_criteria)
        V_minus = np.zeros(n_criteria)

        for j, crit in enumerate(self.criteria):
            is_benefit = self.criteria_types[crit]
            if is_benefit:
                V_plus[j] = np.max(V[:, j])
                V_minus[j] = np.min(V[:, j])
            else:
                V_plus[j] = np.min(V[:, j])
                V_minus[j] = np.max(V[:, j])

        # 5. Compute Euclidean Distances S+ and S-
        S_plus = np.sqrt(np.sum((V - V_plus) ** 2, axis=1))
        S_minus = np.sqrt(np.sum((V - V_minus) ** 2, axis=1))

        # 6. Compute Closeness Coefficient C
        denom_C = S_plus + S_minus
        denom_C[denom_C == 0] = 1e-9
        C = S_minus / denom_C

        # 7. Assemble Ranked Results
        ranked_list = []
        for i, strat in enumerate(strategies):
            item = strat.copy()
            item["topsis_score"] = round(float(C[i]), 4)
            item["distance_positive_ideal"] = round(float(S_plus[i]), 4)
            item["distance_negative_ideal"] = round(float(S_minus[i]), 4)
            ranked_list.append(item)

        # Sort descending by TOPSIS closeness score
        ranked_list = sorted(ranked_list, key=lambda x: x["topsis_score"], reverse=True)

        for rank, item in enumerate(ranked_list, 1):
            item["rank"] = rank

        top_recommended = ranked_list[0]

        return {
            "top_recommended_strategy": top_recommended["strategy_name"],
            "top_recommended_id": top_recommended["strategy_id"],
            "top_topsis_score": top_recommended["topsis_score"],
            "criteria_evaluated": self.criteria,
            "weights_used": self.weights,
            "ranked_strategies": ranked_list
        }
