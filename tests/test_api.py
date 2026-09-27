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


def test_ai_intake_extraction_endpoint():
    print("\nTesting POST /api/business/intake/extract...")
    
    # Test English Extraction
    english_payload = {
        "text": "I want to start a small bakery in Homagama. I have around Rs. 500,000 available. I have 5 years of baking experience and expect 40 customers per day."
    }
    res_en = client.post("/api/business/intake/extract", json=english_payload)
    assert res_en.status_code == 200, f"Expected 200, got {res_en.status_code}: {res_en.text}"
    data_en = res_en.json()
    
    assert data_en["extracted_fields"]["business_category"]["value"] == "Bakery"
    assert data_en["extracted_fields"]["district"]["value"] == "Colombo"
    assert data_en["extracted_fields"]["available_capital_lkr"]["value"] == 500000.0
    assert data_en["extracted_fields"]["entrepreneur_experience_years"]["value"] == 5
    assert data_en["extracted_fields"]["expected_customers_per_day"]["value"] == 40
    
    # CRITICAL RULE CHECK: Unmentioned fields MUST be missing / None
    assert data_en["extracted_fields"]["monthly_budget_lkr"]["value"] is None
    assert data_en["extracted_fields"]["monthly_budget_lkr"]["status"] == "missing"
    assert data_en["extracted_fields"]["competition_level"]["value"] is None
    assert data_en["extracted_fields"]["competition_level"]["status"] == "missing"
    
    print("  English AI Intake Extraction SUCCESS! Extracted count:", data_en["summary"]["extracted_count"])

    # Test Singlish Extraction
    singlish_payload = {
        "text": "Mama Homagama wala bakery ekak patan ganna inne. Capital 500000k thiyenawa. Baking experience awurudu 5k thiyenawa."
    }
    res_si = client.post("/api/business/intake/extract", json=singlish_payload)
    assert res_si.status_code == 200
    data_si = res_si.json()
    assert data_si["extracted_fields"]["business_category"]["value"] == "Bakery"
    assert data_si["extracted_fields"]["district"]["value"] == "Colombo"
    print("  Singlish AI Intake Extraction SUCCESS!")


def test_business_analyze_endpoint():
    print("\nTesting POST /api/business/analyze with AI Intake Traceability...")
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
        "supplier_availability_score": 5,
        "original_business_description": "I want to start a bakery in Homagama with 800k capital.",
        "extraction_metadata": {"intake_mode": "ai_assistant", "verified_by_user": True}
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


def test_pdf_and_docx_business_plan_generation():
    print("\nTesting POST /api/business/plan/generate-pdf and generate-docx...")
    payload = {
        "business_stage": "New Startup",
        "business_category": "Bakery",
        "district": "Colombo",
        "available_capital_lkr": 750000.0,
        "monthly_budget_lkr": 120000.0,
        "expected_price_lkr": 300.0,
        "expected_customers_per_day": 40,
        "entrepreneur_experience_years": 5,
        "available_staff_count": 2,
        "competition_level": "Moderate",
        "has_existing_loans": False,
        "has_equipment": True,
        "has_supplier_contacts": True
    }
    analyze_res = client.post("/api/business/analyze", json=payload)
    assert analyze_res.status_code == 200
    profile = analyze_res.json()

    # Test PDF Generation
    res_pdf = client.post("/api/business/plan/generate-pdf", json=profile)
    assert res_pdf.status_code == 200, f"Expected 200 PDF, got {res_pdf.status_code}"
    assert res_pdf.headers["content-type"] == "application/pdf"
    assert len(res_pdf.content) > 5000 # Valid PDF file size
    print(f"  POST /api/business/plan/generate-pdf SUCCESS! Byte length: {len(res_pdf.content)}")

    # Test DOCX Generation
    res_docx = client.post("/api/business/plan/generate-docx", json=profile)
    assert res_docx.status_code == 200, f"Expected 200 DOCX, got {res_docx.status_code}"
    assert "officedocument.wordprocessingml.document" in res_docx.headers["content-type"]
    assert len(res_docx.content) > 5000 # Valid DOCX file size
    print(f"  POST /api/business/plan/generate-docx SUCCESS! Byte length: {len(res_docx.content)}")


if __name__ == "__main__":
    test_health_check_endpoint()
    test_ai_intake_extraction_endpoint()
    test_business_analyze_endpoint()
    test_pdf_and_docx_business_plan_generation()
    print("\n" + "=" * 60)
    print("ALL BACKEND API & AI INTAKE ASSISTANT TESTS PASSED CLEANLY!")
    print("=" * 60)
