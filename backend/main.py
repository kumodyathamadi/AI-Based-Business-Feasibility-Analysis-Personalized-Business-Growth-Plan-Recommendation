import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure root directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.database import engine, Base
from backend.routes.analysis import router as analysis_router
from backend.schemas import HealthCheckResponse
from src.prediction.predictor import DEFAULT_MODEL_DIR

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SME Business Feasibility Analysis & Decision Support API",
    description="Component 1 REST API for Sri Lankan SME Business Feasibility Prediction, SHAP Attribution, TOPSIS Strategy Ranking, What-If Simulation, and Business Planning.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(analysis_router)


@app.get("/api/health", response_model=HealthCheckResponse, tags=["Health"])
def health_check():
    rf_exists = os.path.exists(os.path.join(DEFAULT_MODEL_DIR, "random_forest.joblib"))
    prep_exists = os.path.exists(os.path.join(DEFAULT_MODEL_DIR, "preprocessor.joblib"))

    return {
        "status": "healthy",
        "component": "Component 1 - AI Business Feasibility Decision Support System",
        "version": "1.0.0",
        "model_loaded": rf_exists and prep_exists
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
