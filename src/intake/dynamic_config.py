"""
Dynamic Context-Aware Business Field Configuration Engine for Component 1.
Determines field requirement states (REQUIRED, OPTIONAL, HIDDEN) based on:
  - Business Stage ("New" vs "Existing")
  - Business Goal / Proposed Action
  - Business Category
"""

from typing import Dict, Any, List

BUSINESS_STAGES = [
    {"id": "New", "label": "New Startup (Not operating yet)", "description": "You plan to launch a new business from scratch."},
    {"id": "Existing", "label": "Existing Business (Currently operating)", "description": "You already run an active business enterprise."}
]

BUSINESS_GOALS = {
    "New": [
        {"id": "Establish New Business", "label": "Establish New Commercial Enterprise", "description": "Launch a brand new physical or commercial branch."},
        {"id": "Start Home-Based Enterprise", "label": "Start Home-Based / Micro Business", "description": "Operate from home with initial seed capital."},
        {"id": "Launch Digital Store", "label": "Launch Digital / E-Commerce Business", "description": "Focus on online and delivery-based operations."}
    ],
    "Existing": [
        {"id": "Open New Branch", "label": "Expand / Open a New Branch", "description": "Set up an additional physical location or branch."},
        {"id": "Introduce New Product", "label": "Introduce a New Product / Service Line", "description": "Add new inventory, offerings, or service lines."},
        {"id": "Improve Current Operations", "label": "Upgrade Equipment & Operational Efficiency", "description": "Invest in machinery, staff, and process improvements."},
        {"id": "Increase Production Capacity", "label": "Increase Production & Customer Capacity", "description": "Scale up daily customer volume and inventory throughput."}
    ]
}

# Base schema field definitions
ALL_FIELD_DEFINITIONS = {
    "business_stage": {"label": "Business Stage", "type": "select"},
    "business_category": {"label": "Business Category", "type": "select"},
    "district": {"label": "District", "type": "select"},
    "province": {"label": "Province", "type": "text"},
    "location_type": {"label": "Location Type", "type": "select"},
    "proposed_action": {"label": "Proposed Action / Objective", "type": "text"},
    
    "available_capital_lkr": {"label": "Available Capital (LKR)", "type": "number"},
    "loan_amount_lkr": {"label": "Requested Loan Amount (LKR)", "type": "number"},
    "monthly_budget_lkr": {"label": "Monthly Operating Budget (LKR)", "type": "number"},
    "initial_inventory_cost_lkr": {"label": "Initial Inventory Cost (LKR)", "type": "number"},
    "expected_price_lkr": {"label": "Expected Unit Selling Price (LKR)", "type": "number"},
    
    "expected_customers_per_day": {"label": "Expected Customers / Day", "type": "number"},
    "competition_level": {"label": "Market Competition Level", "type": "select"},
    "customer_demand_score": {"label": "Customer Demand Score (1-100)", "type": "number"},
    "expected_operating_days_per_month": {"label": "Operating Days / Month", "type": "number"},
    
    "entrepreneur_experience_years": {"label": "Entrepreneur Experience (Years)", "type": "number"},
    "location_suitability_score": {"label": "Location Suitability Score (1-5)", "type": "number"},
    "available_staff_count": {"label": "Available Staff Count", "type": "number"},
    "required_staff_count": {"label": "Required Staff Count", "type": "number"},
    "available_equipment_score": {"label": "Available Equipment Readiness (1-5)", "type": "number"},
    "required_equipment_score": {"label": "Required Equipment Target (1-5)", "type": "number"},
    "supplier_availability_score": {"label": "Supplier Availability Rating (1-5)", "type": "number"},
}


def get_dynamic_field_config(business_stage: str, business_goal: str = "", business_category: str = "") -> Dict[str, Any]:
    """
    Evaluates dynamic field visibility rules based on Business Stage + Business Goal + Category.
    Returns dictionary mapping each field_key to state: 'required', 'optional', or 'hidden'.
    """
    stage = "New" if "new" in business_stage.lower() or "start" in business_stage.lower() else "Existing"
    goal = business_goal.strip() if business_goal else ("Establish New Business" if stage == "New" else "Open New Branch")

    required_fields = set()
    optional_fields = set()
    hidden_fields = set()

    # Core universally required fields across all contexts
    required_fields.update(["business_stage", "business_category", "district", "available_capital_lkr"])

    if stage == "New":
        # New Startup Flow
        required_fields.update([
            "location_type", "monthly_budget_lkr", "expected_customers_per_day", 
            "expected_price_lkr", "competition_level", "entrepreneur_experience_years"
        ])
        optional_fields.update([
            "loan_amount_lkr", "initial_inventory_cost_lkr", "customer_demand_score", 
            "expected_operating_days_per_month", "available_staff_count", "required_staff_count", 
            "available_equipment_score", "required_equipment_score", "supplier_availability_score",
            "location_suitability_score"
        ])
        # N/A fields for new startups are none of the standard 22, but new startups don't require historical metrics
    
    else:
        # Existing Business Flows
        if "branch" in goal.lower() or "expand" in goal.lower():
            # Existing + Open New Branch
            required_fields.update([
                "location_type", "monthly_budget_lkr", "expected_customers_per_day", 
                "expected_price_lkr", "entrepreneur_experience_years", "required_staff_count", 
                "required_equipment_score"
            ])
            optional_fields.update([
                "loan_amount_lkr", "initial_inventory_cost_lkr", "competition_level", 
                "customer_demand_score", "available_staff_count", "available_equipment_score", 
                "supplier_availability_score", "location_suitability_score"
            ])
        elif "product" in goal.lower() or "service" in goal.lower():
            # Existing + Introduce New Product
            required_fields.update([
                "initial_inventory_cost_lkr", "expected_price_lkr", "expected_customers_per_day", 
                "customer_demand_score", "supplier_availability_score"
            ])
            optional_fields.update([
                "monthly_budget_lkr", "available_capital_lkr", "loan_amount_lkr", 
                "available_equipment_score", "required_equipment_score", "entrepreneur_experience_years"
            ])
            hidden_fields.update(["location_suitability_score", "location_type"])
        elif "improve" in goal.lower() or "equipment" in goal.lower() or "efficiency" in goal.lower():
            # Existing + Improve Operations
            required_fields.update([
                "monthly_budget_lkr", "available_equipment_score", "required_equipment_score", 
                "available_staff_count", "required_staff_count"
            ])
            optional_fields.update([
                "expected_price_lkr", "supplier_availability_score", "competition_level", 
                "entrepreneur_experience_years"
            ])
            hidden_fields.update(["initial_inventory_cost_lkr", "location_type", "location_suitability_score"])
        else:
            # Default Existing Business
            required_fields.update([
                "location_type", "monthly_budget_lkr", "expected_customers_per_day", 
                "expected_price_lkr", "entrepreneur_experience_years"
            ])
            optional_fields.update([
                "loan_amount_lkr", "initial_inventory_cost_lkr", "competition_level", 
                "customer_demand_score", "available_staff_count", "required_staff_count", 
                "available_equipment_score", "required_equipment_score", "supplier_availability_score"
            ])

    # Assemble complete field configuration
    field_config = {}
    for key, meta in ALL_FIELD_DEFINITIONS.items():
        if key in hidden_fields:
            state = "hidden"
        elif key in required_fields:
            state = "required"
        else:
            state = "optional"

        field_config[key] = {
            "label": meta["label"],
            "type": meta["type"],
            "state": state
        }

    return {
        "business_stage": stage,
        "business_goal": goal,
        "business_category": business_category,
        "field_config": field_config,
        "summary": {
            "required_count": len(required_fields - hidden_fields),
            "optional_count": len(optional_fields - hidden_fields),
            "hidden_count": len(hidden_fields)
        }
    }
