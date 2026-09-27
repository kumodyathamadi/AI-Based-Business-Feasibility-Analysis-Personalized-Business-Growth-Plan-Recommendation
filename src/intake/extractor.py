import re
from typing import Dict, Any, List, Tuple, Optional
from src.intake.dynamic_config import get_dynamic_field_config, ALL_FIELD_DEFINITIONS


def parse_numeric_amount(text_snippet: str) -> Tuple[Optional[float], Optional[str]]:
    """
    Parses currency/numeric amounts from text snippets (e.g. '500,000', '500k', '5 lakh', 'half a million', '1.5 million').
    Returns (numeric_value, extraction_note).
    """
    lower = text_snippet.lower()
    
    # Check text numbers
    if "half a million" in lower or "lakhs 5" in lower or "5 lakh" in lower or "5 lak" in lower:
        return 500000.0, "Extracted as LKR 500,000 from phrase"
    if "1 million" in lower or "10 lakh" in lower:
        return 1000000.0, "Extracted as LKR 1,000,000 from phrase"
    if "2 million" in lower:
        return 2000000.0, "Extracted as LKR 2,000,000 from phrase"
        
    # Check digits with k/lakh/million multipliers
    k_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:k|thousand)', lower)
    if k_match:
        return float(k_match.group(1)) * 1000.0, f"Extracted as {float(k_match.group(1)) * 1000} from '{k_match.group(0)}'"

    lakh_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:lakh|laks|lacs|lakhs)', lower)
    if lakh_match:
        return float(lakh_match.group(1)) * 100000.0, f"Extracted as {float(lakh_match.group(1)) * 100000} from '{lakh_match.group(0)}'"

    mn_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:million|mn)', lower)
    if mn_match:
        return float(mn_match.group(1)) * 1000000.0, f"Extracted as {float(mn_match.group(1)) * 1000000} from '{mn_match.group(0)}'"

    # Raw numbers with optional commas
    raw_match = re.search(r'(?:rs\.?|lkr|\$)?\s*([\d,]{4,10})', lower)
    if raw_match:
        val_str = raw_match.group(1).replace(',', '')
        try:
            val = float(val_str)
            return val, f"Extracted numeric value LKR {val:,.0f}"
        except ValueError:
            pass

    return None, None


def extract_business_info(user_text: str, specified_stage: str = "", specified_goal: str = "") -> Dict[str, Any]:
    """
    Context-Aware NLP Information Extraction Engine for Component 1.
    Processes user natural language text (English, Singlish, Sinhala-English)
    and maps extracted facts to dynamic context-aware schema fields.
    
    STRICT RULE: Fields not mentioned are marked status="missing" with value=None.
    """
    if not user_text or not user_text.strip():
        raise ValueError("Business description text cannot be empty.")

    text = user_text.strip()
    lower_text = text.lower()

    # 1. Detect Stage & Goal from text if not explicitly specified
    detected_stage = specified_stage.strip() if specified_stage else ""
    if not detected_stage:
        if any(w in lower_text for w in ["expand", "existing", "branch", "already", "thiyenawa", "diwunu", "running"]):
            detected_stage = "Existing"
        else:
            detected_stage = "New"

    detected_goal = specified_goal.strip() if specified_goal else ""
    if not detected_goal:
        if "branch" in lower_text or "expand" in lower_text:
            detected_goal = "Open New Branch"
        elif "product" in lower_text or "item" in lower_text or "offering" in lower_text:
            detected_goal = "Introduce New Product"
        elif "improve" in lower_text or "equipment" in lower_text or "upgrade" in lower_text:
            detected_goal = "Improve Current Operations"
        else:
            detected_goal = "Establish New Business" if detected_stage == "New" else "Open New Branch"

    # 2. Category Detection
    detected_category = "Bakery"
    if any(w in lower_text for w in ["bakery", "confectionery", "pastry", "cake", "bread", "buns", "baking"]):
        detected_category = "Bakery"
    elif any(w in lower_text for w in ["retail", "grocery", "supermarket", "store", "kadayak", "shop"]):
        detected_category = "Retail"
    elif any(w in lower_text for w in ["restaurant", "food", "eatery", "cafe", "dining", "hotel", "kema"]):
        detected_category = "Restaurant"
    elif any(w in lower_text for w in ["garment", "apparel", "clothing", "textile", "sewing", "tailor", "andum"]):
        detected_category = "Garments"
    elif any(w in lower_text for w in ["it", "tech", "software", "web", "digital", "computer"]):
        detected_category = "IT Services"
    elif any(w in lower_text for w in ["salon", "service", "repair", "laundry", "clean", "personal"]):
        detected_category = "Services"

    # 3. Retrieve Context-Aware Field Config (Required, Optional, Hidden)
    dynamic_cfg = get_dynamic_field_config(detected_stage, detected_goal, detected_category)
    field_config = dynamic_cfg["field_config"]

    extracted_fields = {}

    # Initialize all fields as 'missing' by default
    for field_key, meta in ALL_FIELD_DEFINITIONS.items():
        state_cfg = field_config.get(field_key, {"state": "optional"})
        extracted_fields[field_key] = {
            "value": None,
            "status": "hidden" if state_cfg["state"] == "hidden" else "missing",
            "requirement_state": state_cfg["state"],  # 'required', 'optional', 'hidden'
            "confidence": 0.0,
            "label": meta["label"],
            "type": meta["type"],
            "note": None
        }

    # Set Stage & Category
    extracted_fields["business_stage"]["value"] = detected_stage
    extracted_fields["business_stage"]["status"] = "extracted"
    extracted_fields["business_stage"]["confidence"] = 0.98

    extracted_fields["business_category"]["value"] = detected_category
    extracted_fields["business_category"]["status"] = "extracted"
    extracted_fields["business_category"]["confidence"] = 0.95

    # District & Location Type
    colombo_locs = ["homagama", "maharagama", "nugegoda", "kattuwa", "dehiwala", "ratmalana", "moratuwa", "kesbewa", "piliyandala", "avissawella", "hanwella", "battaramulla", "kottawa", "kotte", "kollupitiya", "bambalapitiya", "pettah", "borella", "colombo"]
    gampaha_locs = ["gampaha", "negombo", "kelaniya", "ja-ela", "wattala", "kiribathgoda", "kadawatha", "minuwangoda"]
    kalutara_locs = ["kalutara", "panadura", "horana", "beruwala", "matugama"]

    found_loc = None
    if any(loc in lower_text for loc in colombo_locs):
        extracted_fields["district"] = {"value": "Colombo", "status": "extracted", "requirement_state": "required", "confidence": 0.98, "label": "District", "type": "select", "note": "Colombo District detected"}
        extracted_fields["province"] = {"value": "Western", "status": "extracted", "requirement_state": "optional", "confidence": 0.98, "label": "Province", "type": "text", "note": "Derived Western Province"}
        for loc in colombo_locs:
            if loc in lower_text:
                found_loc = loc.capitalize()
                break
    elif any(loc in lower_text for loc in gampaha_locs):
        extracted_fields["district"] = {"value": "Gampaha", "status": "extracted", "requirement_state": "required", "confidence": 0.98, "label": "District", "type": "select", "note": "Gampaha District detected"}
        extracted_fields["province"] = {"value": "Western", "status": "extracted", "requirement_state": "optional", "confidence": 0.98, "label": "Province", "type": "text", "note": "Derived Western Province"}
    elif any(loc in lower_text for loc in kalutara_locs):
        extracted_fields["district"] = {"value": "Kalutara", "status": "extracted", "requirement_state": "required", "confidence": 0.98, "label": "District", "type": "select", "note": "Kalutara District detected"}
        extracted_fields["province"] = {"value": "Western", "status": "extracted", "requirement_state": "optional", "confidence": 0.98, "label": "Province", "type": "text", "note": "Derived Western Province"}

    # Location Type (if not hidden)
    if extracted_fields["location_type"]["requirement_state"] != "hidden":
        if any(w in lower_text for w in ["home", "gedara", "house", "home-based"]):
            extracted_fields["location_type"] = {"value": "Home Based", "status": "extracted", "requirement_state": extracted_fields["location_type"]["requirement_state"], "confidence": 0.95, "label": "Location Type", "type": "select", "note": "Home-based operation detected"}
        elif any(w in lower_text for w in ["industrial", "zone", "factory", "park"]):
            extracted_fields["location_type"] = {"value": "Industrial Zone", "status": "extracted", "requirement_state": extracted_fields["location_type"]["requirement_state"], "confidence": 0.90, "label": "Location Type", "type": "select", "note": "Industrial zone detected"}
        elif any(w in lower_text for w in ["main street", "urban", "city center", "main road"]):
            extracted_fields["location_type"] = {"value": "Urban Main Street", "status": "extracted", "requirement_state": extracted_fields["location_type"]["requirement_state"], "confidence": 0.90, "label": "Location Type", "type": "select", "note": "Urban main street detected"}
        elif found_loc in ["Homagama", "Maharagama", "Kottawa", "Piliyandala", "Kadawatha"] or "suburban" in lower_text or "hub" in lower_text:
            extracted_fields["location_type"] = {"value": "Suburban Commercial Hub", "status": "extracted", "requirement_state": extracted_fields["location_type"]["requirement_state"], "confidence": 0.90, "label": "Location Type", "type": "select", "note": f"Suburban Commercial Hub detected ({found_loc or 'Hub'})"}

    # Proposed Action
    act_text = f"{detected_goal} ({detected_category})"
    extracted_fields["proposed_action"] = {"value": act_text, "status": "extracted", "requirement_state": "required", "confidence": 0.90, "label": "Proposed Action", "type": "text", "note": f"Context Goal: {detected_goal}"}

    # Financial Amounts Extraction
    cap_patterns = [
        r'(?:capital|investment|salli|have|available|budget of|rs\.?|lkr)?\s*([\d,\.]+\s*(?:k|lakh|lakhs|laks|million|mn)?)\s*(?:capital|available|investment|salli)',
        r'(?:capital|investment)\s*(?:is|of|=|:)?\s*(?:rs\.?|lkr)?\s*([\d,\.]+\s*(?:k|lakh|lakhs|laks|million|mn)?)',
        r'have\s*(?:around|about|approx)?\s*(?:rs\.?|lkr)?\s*([\d,\.]+\s*(?:k|lakh|lakhs|laks|million|mn)?)'
    ]
    
    cap_val, cap_note = None, None
    if "half a million" in lower_text:
        cap_val, cap_note = 500000.0, "Extracted from 'half a million'"
    else:
        for pat in cap_patterns:
            m = re.search(pat, lower_text)
            if m:
                cap_val, cap_note = parse_numeric_amount(m.group(0))
                if cap_val:
                    break

    if cap_val:
        is_approx = any(w in lower_text for w in ["approx", "around", "about", "half a million", "maybe", "lakhs"])
        status = "needs_verification" if is_approx else "extracted"
        conf = 0.75 if is_approx else 0.95
        extracted_fields["available_capital_lkr"] = {
            "value": cap_val, "status": status, "requirement_state": extracted_fields["available_capital_lkr"]["requirement_state"], "confidence": conf, "label": "Available Capital (LKR)", "type": "number", "note": cap_note
        }

    # Loan Amount
    loan_match = re.search(r'(?:loan|bank loan|naya)\s*(?:of|is|=|:)?\s*(?:rs\.?|lkr)?\s*([\d,\.]+\s*(?:k|lakh|lakhs|million)?)', lower_text)
    if loan_match:
        loan_val, loan_note = parse_numeric_amount(loan_match.group(0))
        if loan_val:
            extracted_fields["loan_amount_lkr"] = {
                "value": loan_val, "status": "extracted", "requirement_state": extracted_fields["loan_amount_lkr"]["requirement_state"], "confidence": 0.90, "label": "Requested Loan Amount (LKR)", "type": "number", "note": loan_note
            }

    # Monthly Budget
    budget_match = re.search(r'(?:monthly budget|operating budget|monthly cost|viyadama)\s*(?:of|is|=|:)?\s*(?:rs\.?|lkr)?\s*([\d,\.]+\s*(?:k|lakh|lakhs|million)?)', lower_text)
    if budget_match:
        bud_val, bud_note = parse_numeric_amount(budget_match.group(0))
        if bud_val:
            extracted_fields["monthly_budget_lkr"] = {
                "value": bud_val, "status": "extracted", "requirement_state": extracted_fields["monthly_budget_lkr"]["requirement_state"], "confidence": 0.90, "label": "Monthly Operating Budget (LKR)", "type": "number", "note": bud_note
            }

    # Unit Price
    price_match = re.search(r'(?:price|cost per|unit price|gana)\s*(?:of|is|=|:)?\s*(?:rs\.?|lkr)?\s*(\d+)', lower_text)
    if price_match:
        try:
            pval = float(price_match.group(1))
            if pval < 50000:
                extracted_fields["expected_price_lkr"] = {
                    "value": pval, "status": "extracted", "requirement_state": extracted_fields["expected_price_lkr"]["requirement_state"], "confidence": 0.90, "label": "Expected Price / Unit (LKR)", "type": "number", "note": f"Extracted price LKR {pval}"
                }
        except ValueError:
            pass

    # Operational Factors
    cust_match = re.search(r'(\d+)\s*(?:customers|buyers|clients|footfall|dennek)\s*(?:per day|a day|daily)?', lower_text) or \
                 re.search(r'(?:expect|target|have)\s*(?:around|about)?\s*(\d+)\s*customers', lower_text)
    if cust_match:
        try:
            cval = int(cust_match.group(1))
            extracted_fields["expected_customers_per_day"] = {
                "value": cval, "status": "extracted", "requirement_state": extracted_fields["expected_customers_per_day"]["requirement_state"], "confidence": 0.95, "label": "Expected Customers / Day", "type": "number", "note": f"Extracted {cval} daily customers"
            }
        except ValueError:
            pass

    exp_match = re.search(r'(\d+)\s*(?:years|yr|yrs|awurudu|awrudu)\s*(?:of)?\s*(?:experience|baking|work|exp)', lower_text) or \
                re.search(r'experience\s*(?:of)?\s*(\d+)\s*(?:years|yr|yrs|awurudu)?', lower_text)
    if exp_match:
        try:
            eval_val = int(exp_match.group(1))
            extracted_fields["entrepreneur_experience_years"] = {
                "value": eval_val, "status": "extracted", "requirement_state": extracted_fields["entrepreneur_experience_years"]["requirement_state"], "confidence": 0.95, "label": "Entrepreneur Experience (Years)", "type": "number", "note": f"Extracted {eval_val} years experience"
            }
        except ValueError:
            pass

    staff_match = re.search(r'(\d+)\s*(?:staff|employees|workers|veda karayo)', lower_text)
    if staff_match:
        try:
            sval = int(staff_match.group(1))
            extracted_fields["available_staff_count"] = {
                "value": sval, "status": "extracted", "requirement_state": extracted_fields["available_staff_count"]["requirement_state"], "confidence": 0.90, "label": "Available Staff Count", "type": "number", "note": f"Extracted staff count: {sval}"
            }
            extracted_fields["required_staff_count"] = {
                "value": sval, "status": "extracted", "requirement_state": extracted_fields["required_staff_count"]["requirement_state"], "confidence": 0.85, "label": "Required Staff Count", "type": "number", "note": f"Inferred required staff count: {sval}"
            }
        except ValueError:
            pass

    # Competition Level
    if any(w in lower_text for w in ["high competition", "many competitors", "lots of shops", "heavy competition", "godak kade"]):
        extracted_fields["competition_level"] = {"value": "High", "status": "extracted", "requirement_state": extracted_fields["competition_level"]["requirement_state"], "confidence": 0.90, "label": "Competition Level", "type": "select", "note": "High competition detected"}
    elif any(w in lower_text for w in ["moderate competition", "some competition", "medium competition", "samanya"]):
        extracted_fields["competition_level"] = {"value": "Moderate", "status": "extracted", "requirement_state": extracted_fields["competition_level"]["requirement_state"], "confidence": 0.90, "label": "Competition Level", "type": "select", "note": "Moderate competition detected"}
    elif any(w in lower_text for w in ["low competition", "no competition", "few shops", "little competition"]):
        extracted_fields["competition_level"] = {"value": "Low", "status": "extracted", "requirement_state": extracted_fields["competition_level"]["requirement_state"], "confidence": 0.90, "label": "Competition Level", "type": "select", "note": "Low competition detected"}

    # Summary Stats
    extracted_count = sum(1 for f in extracted_fields.values() if f["status"] == "extracted")
    needs_verif_count = sum(1 for f in extracted_fields.values() if f["status"] == "needs_verification")
    missing_req_keys = [k for k, f in extracted_fields.items() if f["status"] == "missing" and f["requirement_state"] == "required"]
    missing_opt_keys = [k for k, f in extracted_fields.items() if f["status"] == "missing" and f["requirement_state"] == "optional"]
    hidden_keys = [k for k, f in extracted_fields.items() if f["requirement_state"] == "hidden"]

    return {
        "original_text": text,
        "context": {
            "business_stage": detected_stage,
            "business_goal": detected_goal,
            "business_category": detected_category
        },
        "extracted_fields": extracted_fields,
        "summary": {
            "total_fields": len(ALL_FIELD_DEFINITIONS),
            "extracted_count": extracted_count,
            "needs_verification_count": needs_verif_count,
            "missing_required_count": len(missing_req_keys),
            "missing_optional_count": len(missing_opt_keys),
            "hidden_count": len(hidden_keys),
            "missing_required_field_keys": missing_req_keys,
            "missing_optional_field_keys": missing_opt_keys,
            "hidden_field_keys": hidden_keys
        }
    }
