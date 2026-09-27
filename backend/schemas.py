# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional


class BusinessAnalysisRequest(BaseModel):
    """
    Pydantic Input Request Validation Schema matching Component 1 features.
    Includes optional traceability fields for natural language intake & verification.
    """
    business_stage: str = Field(default="New", example="New")
    business_category: str = Field(default="Retail", example="Bakery")
    district: str = Field(default="Colombo", example="Colombo")
    province: str = Field(default="Western", example="Western")
    location_type: str = Field(default="Commercial Hub", example="Suburban Commercial Hub")
    proposed_action: str = Field(default="Start New Business", example="Establish New Bakery Branch")

    available_capital_lkr: float = Field(default=500000.0, ge=0, example=800000.0)
    loan_amount_lkr: float = Field(default=0.0, ge=0, example=200000.0)
    monthly_budget_lkr: float = Field(default=100000.0, ge=0, example=150000.0)
    initial_inventory_cost_lkr: float = Field(default=150000.0, ge=0, example=180000.0)
    expected_price_lkr: float = Field(default=500.0, ge=0, example=350.0)

    expected_customers_per_day: int = Field(default=30, ge=1, example=45)
    competition_level: str = Field(default="Moderate", example="Moderate")
    customer_demand_score: int = Field(default=60, ge=1, le=100, example=75)
    expected_operating_days_per_month: int = Field(default=26, ge=1, le=31, example=26)

    entrepreneur_experience_years: int = Field(default=2, ge=0, example=4)
    location_suitability_score: int = Field(default=4, ge=1, le=5, example=4)
    available_staff_count: int = Field(default=2, ge=0, example=3)
    required_staff_count: int = Field(default=2, ge=1, example=3)
    available_equipment_score: int = Field(default=3, ge=1, le=5, example=4)
    required_equipment_score: int = Field(default=3, ge=1, le=5, example=4)
    supplier_availability_score: int = Field(default=4, ge=1, le=5, example=5)

    # Research Traceability Extensions
    original_business_description: Optional[str] = Field(default=None, description="Original natural language text entered by user")
    extraction_metadata: Optional[Dict[str, Any]] = Field(default=None, description="Metadata from AI intake extraction & user verification")


class IntakeExtractRequest(BaseModel):
    """
    Request payload for AI Business Intake Assistant text parsing with optional context hints.
    """
    text: str = Field(..., min_length=5, example="I want to start a small bakery in Homagama with Rs. 500,000 capital.")
    business_stage: Optional[str] = Field(default="", example="New")
    business_goal: Optional[str] = Field(default="", example="Establish New Business")


class IntakeConfigRequest(BaseModel):
    """
    Request payload for retrieving context-dependent field requirements.
    """
    business_stage: str = Field(..., example="Existing")
    business_goal: Optional[str] = Field(default="Open New Branch", example="Open New Branch")
    business_category: Optional[str] = Field(default="Bakery", example="Bakery")


class HealthCheckResponse(BaseModel):
    status: str
    component: str
    version: str
    model_loaded: bool
