import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any

DEFAULT_MODEL_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "models", "feasibility_model")
)


class FeasibilityPredictor:
    """
    Feasibility Prediction Service for SME Business Input.
    Loads serialized preprocessor, Random Forest classifier, and model metadata.
    """

    def __init__(self, model_dir: str = DEFAULT_MODEL_DIR):
        self.model_dir = model_dir
        self.rf_path = os.path.join(model_dir, "random_forest.joblib")
        self.prep_path = os.path.join(model_dir, "preprocessor.joblib")
        self.meta_path = os.path.join(model_dir, "model_metadata.json")

        if not os.path.exists(self.rf_path) or not os.path.exists(self.prep_path):
            raise FileNotFoundError(
                f"Model artifacts not found in {model_dir}. Please run model serialization first."
            )

        self.model = joblib.load(self.rf_path)
        self.preprocessor = joblib.load(self.prep_path)

        with open(self.meta_path, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)

        self.classes = list(self.model.classes_)
        self.feature_names = self.preprocessor.get_feature_names_out().tolist()

    def predict_feasibility(self, input_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Predicts business feasibility label and class probabilities for a single business input DataFrame.
        """
        processed_input = self.preprocessor.transform(input_df)
        if hasattr(processed_input, "toarray"):
            dense_input = processed_input.toarray()
        else:
            dense_input = np.array(processed_input)

        prediction_label = str(self.model.predict(dense_input)[0])
        probabilities_raw = self.model.predict_proba(dense_input)[0]

        probabilities = {
            cls_name: round(float(prob), 4)
            for cls_name, prob in zip(self.classes, probabilities_raw)
        }

        confidence_score = float(np.max(probabilities_raw))

        return {
            "prediction": prediction_label,
            "confidence_score": round(confidence_score, 4),
            "probabilities": probabilities,
            "classes": self.classes,
            "processed_input_shape": dense_input.shape,
            "dense_input": dense_input
        }
