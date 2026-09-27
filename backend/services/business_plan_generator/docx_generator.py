import os
import io
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

from backend.services.business_plan_generator.chart_generator import BusinessPlanChartGenerator

LOGO_PATH = os.path.abspath(os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "frontend", "src", "assets", "logo", "sme360-ai-logo.png"
))

class BusinessPlanDocxGenerator:
    """
    Generates an editable Microsoft Word (.docx) document for SME360 AI Business Plans using python-docx.
    """

    @staticmethod
    def set_cell_background(cell, fill_hex):
        """Sets XML background color for a table cell."""
        tcPr = cell._element.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    @staticmethod
    def generate_docx(report_data: dict) -> bytes:
        doc = Document()

        # Set Standard Page Margins (0.75 in / 54 pt)
        for section in doc.sections:
            section.top_margin = Inches(0.75)
            section.bottom_margin = Inches(0.75)
            section.left_margin = Inches(0.75)
            section.right_margin = Inches(0.75)

        # Color Palette
        COLOR_PRIMARY = RGBColor(30, 58, 138)   # #1e3a8a Dark Blue
        COLOR_ACCENT = RGBColor(37, 99, 235)   # #2563eb Vibrant Blue
        COLOR_DARK = RGBColor(15, 23, 42)      # #0f172a Dark Slate
        COLOR_MUTED = RGBColor(100, 116, 139)  # #64748b Muted Slate

        metadata = report_data.get("metadata", {})
        biz_id = report_data.get("business_identity", {})

        # =========================================================================
        # 1. COVER PAGE
        # =========================================================================
        if os.path.exists(LOGO_PATH):
            try:
                p_logo = doc.add_paragraph()
                p_logo.alignment = WD_ALIGN_PARAGRAPH.LEFT
                run_logo = p_logo.add_run()
                run_logo.add_picture(LOGO_PATH, width=Inches(2.2))
            except Exception:
                pass

        p_sub = doc.add_paragraph()
        p_sub.paragraph_format.space_before = Pt(20)
        p_sub.paragraph_format.space_after = Pt(4)
        run_sub = p_sub.add_run(metadata.get("system_brand", "SME360 AI"))
        run_sub.font.name = 'Arial'
        run_sub.font.size = Pt(12)
        run_sub.font.bold = True
        run_sub.font.color.rgb = COLOR_ACCENT

        p_title = doc.add_paragraph()
        p_title.paragraph_format.space_after = Pt(6)
        run_title = p_title.add_run("BUSINESS PLAN")
        run_title.font.name = 'Arial'
        run_title.font.size = Pt(28)
        run_title.font.bold = True
        run_title.font.color.rgb = COLOR_PRIMARY

        p_desc = doc.add_paragraph()
        p_desc.paragraph_format.space_after = Pt(30)
        run_desc = p_desc.add_run(metadata.get("document_subtitle", "AI-Assisted Business Feasibility & Growth Planning"))
        run_desc.font.name = 'Arial'
        run_desc.font.size = Pt(10)
        run_desc.font.color.rgb = COLOR_MUTED

        # Cover Box Table
        cov_table = doc.add_table(rows=6, cols=2)
        cov_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cov_data = [
            ("BUSINESS NAME:", biz_id.get("business_name")),
            ("CATEGORY:", biz_id.get("business_category")),
            ("BUSINESS STAGE:", biz_id.get("business_stage")),
            ("DISTRICT:", biz_id.get("district")),
            ("PREPARED DATE:", metadata.get("generated_date")),
            ("RECORD ID:", metadata.get("record_id")),
        ]

        for idx, (label, val) in enumerate(cov_data):
            row_cells = cov_table.rows[idx].cells
            row_cells[0].width = Inches(2.0)
            row_cells[1].width = Inches(4.5)
            
            p0 = row_cells[0].paragraphs[0]
            r0 = p0.add_run(label)
            r0.font.bold = True
            r0.font.size = Pt(9.5)
            r0.font.color.rgb = COLOR_DARK

            p1 = row_cells[1].paragraphs[0]
            r1 = p1.add_run(str(val))
            r1.font.size = Pt(9.5)
            r1.font.color.rgb = COLOR_DARK

            BusinessPlanDocxGenerator.set_cell_background(row_cells[0], "F8FAFC")
            BusinessPlanDocxGenerator.set_cell_background(row_cells[1], "F8FAFC")

        doc.add_page_break()

        # =========================================================================
        # HELPER FOR SECTION HEADINGS
        # =========================================================================
        def add_heading_1(text):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(16)
            p.paragraph_format.space_after = Pt(6)
            r = p.add_run(text)
            r.font.name = 'Arial'
            r.font.size = Pt(14)
            r.font.bold = True
            r.font.color.rgb = COLOR_PRIMARY
            return p

        def add_heading_2(text):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(4)
            r = p.add_run(text)
            r.font.name = 'Arial'
            r.font.size = Pt(11)
            r.font.bold = True
            r.font.color.rgb = COLOR_ACCENT
            return p

        # =========================================================================
        # 2. EXECUTIVE SUMMARY & FEASIBILITY SNAPSHOT
        # =========================================================================
        add_heading_1("1. Executive Summary & Feasibility Snapshot")
        exec_summary = report_data.get("executive_summary", {})
        
        p_exec = doc.add_paragraph()
        r_exec = p_exec.add_run(exec_summary.get("business_summary"))
        r_exec.font.size = Pt(10)
        r_exec.font.color.rgb = COLOR_DARK

        # KPI Cards Table
        kpi_tbl = doc.add_table(rows=2, cols=4)
        kpi_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        headers = ["Predicted Feasibility", "Model Confidence", "Available Capital", "Target Customers"]
        vals = [
            exec_summary.get("predicted_label"),
            exec_summary.get("confidence_percent"),
            f"LKR {report_data['financial_overview']['available_capital_lkr']:,.0f}",
            f"{report_data['market_analysis']['expected_customers_per_day']} / day"
        ]

        for col_i in range(4):
            c_hdr = kpi_tbl.rows[0].cells[col_i]
            c_val = kpi_tbl.rows[1].cells[col_i]
            BusinessPlanDocxGenerator.set_cell_background(c_hdr, "F1F5F9")
            BusinessPlanDocxGenerator.set_cell_background(c_val, "F8FAFC")
            
            p_h = c_hdr.paragraphs[0]
            p_h.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r_h = p_h.add_run(headers[col_i])
            r_h.font.bold = True
            r_h.font.size = Pt(9)

            p_v = c_val.paragraphs[0]
            p_v.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r_v = p_v.add_run(vals[col_i])
            r_v.font.bold = True
            r_v.font.size = Pt(9.5)

        # Embedded Probability Chart
        try:
            chart_bytes = BusinessPlanChartGenerator.generate_probability_chart(exec_summary.get("probabilities", {}))
            p_chart = doc.add_paragraph()
            p_chart.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_chart.paragraph_format.space_before = Pt(10)
            r_chart = p_chart.add_run()
            r_chart.add_picture(io.BytesIO(chart_bytes), width=Inches(5.5))
        except Exception:
            pass

        # =========================================================================
        # 3. BUSINESS OVERVIEW
        # =========================================================================
        add_heading_1("2. Business Overview")
        biz_ov = report_data.get("business_overview", {})
        
        b_tbl = doc.add_table(rows=3, cols=4)
        b_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        b_data = [
            [("Category:", biz_ov.get("category")), ("Experience:", f"{biz_ov.get('experience_years')} Years")],
            [("Stage:", biz_ov.get("stage")), ("Staff Count:", f"{biz_ov.get('staff_count')} Person(s)")],
            [("District:", biz_ov.get("district")), ("Competition:", biz_ov.get("competition_level"))],
        ]

        for row_i, r_pair in enumerate(b_data):
            c0, c1, c2, c3 = b_tbl.rows[row_i].cells
            
            p0 = c0.paragraphs[0]
            r0 = p0.add_run(r_pair[0][0])
            r0.font.bold = True
            r0.font.size = Pt(9)

            p1 = c1.paragraphs[0]
            p1.add_run(str(r_pair[0][1])).font.size = Pt(9)

            p2 = c2.paragraphs[0]
            r2 = p2.add_run(r_pair[1][0])
            r2.font.bold = True
            r2.font.size = Pt(9)

            p3 = c3.paragraphs[0]
            p3.add_run(str(r_pair[1][1])).font.size = Pt(9)

        # =========================================================================
        # 4. FINANCIAL & OPERATIONAL PLAN
        # =========================================================================
        add_heading_1("3. Financial & Operational Plan")
        fin = report_data.get("financial_overview", {})

        f_tbl = doc.add_table(rows=5, cols=3)
        f_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        f_rows = [
            ("Financial Metric", "Amount (LKR) / Status", "Strategic Planning Guidance"),
            ("Available Starting Capital", f"LKR {fin.get('available_capital_lkr'):,.0f}", fin.get("guidance_summary")),
            ("Monthly Operating Budget", f"LKR {fin.get('monthly_budget_lkr'):,.0f}", "Includes rent, inventory, utilities, and staffing."),
            ("Target Unit Price", f"LKR {fin.get('expected_price_lkr'):,.0f}", "Expected selling price per unit."),
            ("Est. Monthly Revenue", f"LKR {fin.get('estimated_monthly_revenue_lkr'):,.0f}", "Estimated revenue from target daily customer volume.")
        ]

        for r_i, r_data in enumerate(f_rows):
            row_cells = f_tbl.rows[r_i].cells
            for c_i, text in enumerate(r_data):
                p = row_cells[c_i].paragraphs[0]
                r = p.add_run(text)
                r.font.size = Pt(9)
                if r_i == 0:
                    r.font.bold = True
                    r.font.color.rgb = RGBColor(255, 255, 255)
                    BusinessPlanDocxGenerator.set_cell_background(row_cells[c_i], "1E3A8A")

        # =========================================================================
        # 5. KEY BUSINESS FACTORS
        # =========================================================================
        add_heading_1("4. Key Business Factors")
        factors = report_data.get("key_business_factors", {})
        
        add_heading_2("Top Positive Supporting Factors (+):")
        for item in factors.get("positive_enablers", []):
            feat_name = item.get('feature', '').replace('_', ' ').title()
            feat_val = item.get('feature_value', 'N/A')
            p_b = doc.add_paragraph(style='List Bullet')
            r_b = p_b.add_run(f"{feat_name} (Recorded Value: {feat_val}) — Provided strong positive support for predicted feasibility.")
            r_b.font.size = Pt(9.5)

        add_heading_2("Areas Needing Strategic Attention (-):")
        for item in factors.get("risk_hurdles", []):
            feat_name = item.get('feature', '').replace('_', ' ').title()
            feat_val = item.get('feature_value', 'N/A')
            p_b = doc.add_paragraph(style='List Bullet')
            r_b = p_b.add_run(f"{feat_name} (Recorded Value: {feat_val}) — Identified risk hurdle requiring resource or operational mitigation.")
            r_b.font.size = Pt(9.5)

        # =========================================================================
        # 6. STRATEGY PRIORITIES
        # =========================================================================
        add_heading_1("5. Strategy Priorities & Options Comparison")
        strat_prio = report_data.get("strategy_priorities", {})
        
        p_top = doc.add_paragraph()
        r_top = p_top.add_run(f"Top Recommended Direction: {strat_prio.get('top_recommended_strategy')} (Decision Score: {strat_prio.get('top_topsis_score')})")
        r_top.font.bold = True
        r_top.font.color.rgb = COLOR_ACCENT

        ranked_strats = strat_prio.get("ranked_strategies", [])
        s_tbl = doc.add_table(rows=len(ranked_strats) + 1, cols=4)
        s_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER

        headers_s = ["Rank", "Strategy Name", "Strategic Focus Area", "Decision Score"]
        for c_i, h in enumerate(headers_s):
            cell = s_tbl.rows[0].cells[c_i]
            BusinessPlanDocxGenerator.set_cell_background(cell, "1E3A8A")
            p = cell.paragraphs[0]
            r = p.add_run(h)
            r.font.bold = True
            r.font.size = Pt(9)
            r.font.color.rgb = RGBColor(255, 255, 255)

        for s_i, s in enumerate(ranked_strats):
            cells = s_tbl.rows[s_i + 1].cells
            s_data = [f"#{s_i+1}", s.get("strategy_name", "Option"), s.get("strategic_focus", "Growth"), str(s.get("topsis_score", "N/A"))]
            for c_i, val in enumerate(s_data):
                p = cells[c_i].paragraphs[0]
                p.add_run(val).font.size = Pt(9)

        # =========================================================================
        # 7. TIME-PHASED ACTION ROADMAP
        # =========================================================================
        add_heading_1("6. Time-Phased Action Roadmap")
        roadmap = report_data.get("action_roadmap", {})

        add_heading_2("Phase 1: Immediate Launch Preparation (0 – 3 Months)")
        for item in roadmap.get("phase_1", []):
            doc.add_paragraph(item, style='List Bullet')

        add_heading_2("Phase 2: Operational Stabilization (3 – 12 Months)")
        for item in roadmap.get("phase_2", []):
            doc.add_paragraph(item, style='List Bullet')

        add_heading_2("Phase 3: Growth & Expansion (1 Year+)")
        for item in roadmap.get("phase_3", []):
            doc.add_paragraph(item, style='List Bullet')

        # =========================================================================
        # 8. ASSUMPTIONS & DISCLOSURES
        # =========================================================================
        add_heading_1("7. Assumptions & Important Disclosures")
        for item in report_data.get("assumptions_and_considerations", []):
            doc.add_paragraph(item, style='List Bullet')

        # Save buffer
        buf = io.BytesIO()
        doc.save(buf)
        buf.seek(0)
        return buf.getvalue()
