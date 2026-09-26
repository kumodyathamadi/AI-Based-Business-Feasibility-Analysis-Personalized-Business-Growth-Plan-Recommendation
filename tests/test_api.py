import sys
import os
import json
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.main import app

client = TestClient(app)


def test_health_check_endpoint():
    print("Testing GET /api/health...")
    response = client.get("/api/health")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    print("  /api/health response:", data)


def test_business_analyze_endpoint():
    print("\nTesting POST /api/business/analyze...")
    payload = {
        "business_stage": "New",
        "business_category": "Bakery",
        "district": "Colombo",
        "province": "Western",
        "location_type": "Suburban Commercial Hub",
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

    response = client.post("/api/business/analyze", json=payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    profile = response.json()

    assert "feasibility_analysis" in profile
    assert "explainability" in profile
    assert "strategic_recommendations" in profile
    assert "scenario_analysis" in profile
    assert "personalized_business_plan" in profile
    assert "record_id" in profile["metadata"]

    record_id = profile["metadata"]["record_id"]
    print(f"  POST /api/business/analyze SUCCESS! Assigned Record ID: {record_id}")
    print("  Prediction:", profile["feasibility_analysis"]["predicted_label"])

    print("\nTesting GET /api/business/records...")
    rec_res = client.get("/api/business/records")
    assert rec_res.status_code == 200
    records = rec_res.json()
    assert len(records) >= 1
    print(f"  GET /api/business/records returned {len(records)} record(s)")

    print(f"\nTesting GET /api/business/record/{record_id}...")
    single_res = client.get(f"/api/business/record/{record_id}")
    assert single_res.status_code == 200
    fetched_profile = single_res.json()
    assert fetched_profile["metadata"]["record_id"] == record_id
    print(f"  GET /api/business/record/{record_id} fetched successfully!")


if __name__ == "__main__":
    test_health_check_endpoint()
    test_business_analyze_endpoint()
    print("\n" + "=" * 60)
    print("ALL BACKEND API TESTS PASSED CLEANLY!")
    print("=" * 60)
