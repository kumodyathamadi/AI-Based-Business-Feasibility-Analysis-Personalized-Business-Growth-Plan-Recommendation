import sys
import os
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, status

# Ensure root path is accessible
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.schemas import IntakeExtractRequest, IntakeConfigRequest
from src.intake.extractor import extract_business_info
from src.intake.dynamic_config import get_dynamic_field_config, BUSINESS_STAGES, BUSINESS_GOALS

router = APIRouter(prefix="/api/business/intake", tags=["AI Business Intake"])


@router.get("/stages-and-goals", response_model=Dict[str, Any], status_code=status.HTTP_200_OK)
def get_business_stages_and_goals():
    """
    Returns available Business Stages and Context-Specific Business Goals.
    """
    return {
        "stages": BUSINESS_STAGES,
        "goals": BUSINESS_GOALS
    }


@router.post("/config", response_model=Dict[str, Any], status_code=status.HTTP_200_OK)
def get_field_configuration(payload: IntakeConfigRequest):
    """
    Returns Dynamic Context-Aware Field Requirements (Required, Optional, Hidden).
    """
    try:
        config = get_dynamic_field_config(
            business_stage=payload.business_stage,
            business_goal=payload.business_goal or "",
            business_category=payload.business_category or ""
        )
        return config
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Field configuration evaluation failed: {str(e)}"
        )


@router.post("/extract", response_model=Dict[str, Any], status_code=status.HTTP_200_OK)
def extract_intake_information(payload: IntakeExtractRequest):
    """
    AI Business Intake Assistant Endpoint:
    Processes natural language business description (English, Singlish, Sinhala-English),
    evaluates dynamic stage + goal context, extracts matching schema parameters,
    categorizes field states ('extracted', 'needs_verification', 'missing', 'hidden'),
    and returns field extraction metadata.
    
    STRICT RULE: Never fabricates missing business parameters. Unmentioned fields are returned with value=null.
    """
    try:
        if not payload.text or not payload.text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Business description text cannot be empty."
            )
            
        result = extract_business_info(
            user_text=payload.text,
            specified_stage=payload.business_stage or "",
            specified_goal=payload.business_goal or ""
        )
        return result

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Information extraction failed: {str(e)}"
        )
