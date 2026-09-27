import re
from fastapi import APIRouter, HTTPException, Depends, Response
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import AnalysisRecord
from backend.services.business_plan_generator.report_builder import BusinessPlanReportBuilder
from backend.services.business_plan_generator.pdf_generator import BusinessPlanPDFGenerator
from backend.services.business_plan_generator.docx_generator import BusinessPlanDocxGenerator

router = APIRouter(prefix="/api/business/plan", tags=["Business Plan Generator"])


def sanitize_filename(name: str) -> str:
    """Sanitizes business name for clean OS filenames."""
    clean = re.sub(r'[^a-zA-Z0-9_\-]', '_', name)
    clean = re.sub(r'_+', '_', clean).strip('_')
    return clean or "SME360_AI_Business_Plan"


@router.post("/generate-pdf")
def generate_pdf_plan(profile: dict):
    """
    Generates a professional colorful PDF Business Plan from a completed SME360 AI profile.
    """
    try:
        report_data = BusinessPlanReportBuilder.build_report_data(profile)
        pdf_bytes = BusinessPlanPDFGenerator.generate_pdf(report_data)

        biz_name = report_data["business_identity"]["business_name"]
        clean_name = sanitize_filename(biz_name)
        filename = f"SME360_AI_Business_Plan_{clean_name}.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=\"{filename}\"",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")


@router.post("/generate-docx")
def generate_docx_plan(profile: dict):
    """
    Generates an editable Microsoft Word (.docx) Business Plan from a completed SME360 AI profile.
    """
    try:
        report_data = BusinessPlanReportBuilder.build_report_data(profile)
        docx_bytes = BusinessPlanDocxGenerator.generate_docx(report_data)

        biz_name = report_data["business_identity"]["business_name"]
        clean_name = sanitize_filename(biz_name)
        filename = f"SME360_AI_Business_Plan_{clean_name}.docx"

        return Response(
            content=docx_bytes,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": f"attachment; filename=\"{filename}\"",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DOCX generation failed: {str(e)}")


@router.get("/download/{record_id}/{doc_format}")
def download_plan_by_record_id(record_id: str, doc_format: str, db: Session = Depends(get_db)):
    """
    Retrieves stored database profile by record_id and downloads generated PDF or DOCX file.
    """
    db_record = db.query(AnalysisRecord).filter(AnalysisRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Analysis record not found")

    profile = db_record.full_profile
    if doc_format.lower() == "pdf":
        return generate_pdf_plan(profile)
    elif doc_format.lower() in ["docx", "word"]:
        return generate_docx_plan(profile)
    else:
        raise HTTPException(status_code=400, detail="Invalid document format. Use 'pdf' or 'docx'")
