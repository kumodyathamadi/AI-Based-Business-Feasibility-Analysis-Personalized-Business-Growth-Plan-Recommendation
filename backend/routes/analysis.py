import sys
import os
import uuid
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# Ensure root path is accessible for src module imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.database import get_db
from backend.models import AnalysisRecord
from backend.schemas import BusinessAnalysisRequest
from src.orchestrator import analyze_business

router = APIRouter(prefix="/api/business", tags=["Business Analysis"])


@router.post("/analyze", response_model=Dict[str, Any], status_code=status.HTTP_200_OK)
def analyze_sme_business(
    payload: BusinessAnalysisRequest,
    db: Session = Depends(get_db)
):
    """
    Executes Component 1 End-to-End Business Analysis Pipeline:
    Preprocessing -> Prediction -> SHAP -> Strategy Generation -> TOPSIS -> What-If -> Plan -> Structured Profile.
    """
    try:
        raw_input = payload.model_dump()
        structured_profile = analyze_business(raw_input)

        feasibility_data = structured_profile.get("feasibility_analysis", {})
        predicted_label = feasibility_data.get("predicted_label", "Conditionally Feasible")
        confidence_score = feasibility_data.get("confidence_score", 0.0)

        record_id = str(uuid.uuid4())
        structured_profile["metadata"]["record_id"] = record_id

        # Save record to Database
        record = AnalysisRecord(
            id=record_id,
            business_stage=payload.business_stage,
            business_category=payload.business_category,
            district=payload.district,
            feasibility_label=predicted_label,
            confidence_score=confidence_score,
            input_profile=raw_input,
            structured_profile=structured_profile
        )
        db.add(record)
        db.commit()
        db.refresh(record)

        return structured_profile

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Business analysis failed: {str(e)}"
        )


@router.get("/records", response_model=List[Dict[str, Any]])
def list_analysis_records(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Lists recent SME business analysis runs stored in the database.
    """
    records = db.query(AnalysisRecord).order_by(AnalysisRecord.created_at.desc()).limit(limit).all()
    return [
        {
            "id": rec.id,
            "business_stage": rec.business_stage,
            "business_category": rec.business_category,
            "district": rec.district,
            "feasibility_label": rec.feasibility_label,
            "confidence_score": rec.confidence_score,
            "created_at": rec.created_at.isoformat() if rec.created_at else None
        }
        for rec in records
    ]


@router.get("/record/{record_id}", response_model=Dict[str, Any])
def get_analysis_record(
    record_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieves a full structured profile JSON by Analysis Record ID.
    """
    rec = db.query(AnalysisRecord).filter(AnalysisRecord.id == record_id).first()
    if not rec:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis record with ID '{record_id}' not found."
        )
    return rec.structured_profile
