import React, { useState } from 'react';
import { extractIntakeInformation } from '../services/api';
import Logo from './Logo';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Edit3, 
  FileEdit, 
  RotateCcw,
  Check,
  Target,
  Building2
} from 'lucide-react';

export default function AiIntakeAssistant({ onCompleteIntake, onSwitchToManual }) {
  // Step 0: Stage & Goal Selection, Step 1: Text Entry, Step 2: AI Understanding, Step 3: Complete Missing, Step 4: Final Review
  const [step, setStep] = useState(0);
  
  // Context Selection
  const [selectedStage, setSelectedStage] = useState('New');
  const [selectedGoal, setSelectedGoal] = useState('Establish New Business');
  const [selectedCategory, setSelectedCategory] = useState('Bakery');

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Extracted Metadata State from Backend
  const [extractionResult, setExtractionResult] = useState(null);
  
  // Working Verified Fields State (key -> value)
  const [verifiedFields, setVerifiedFields] = useState({});

  // Baseline Fallback Values for Component 1 schema
  const BASELINE_SCHEMA_VALUES = {
    business_stage: 'New',
    business_category: 'Bakery',
    district: 'Colombo',
    province: 'Western',
    location_type: 'Suburban Commercial Hub',
    proposed_action: 'Establish New Bakery Branch',
    available_capital_lkr: 500000,
    loan_amount_lkr: 0,
    monthly_budget_lkr: 100000,
    initial_inventory_cost_lkr: 150000,
    expected_price_lkr: 350,
    expected_customers_per_day: 40,
    competition_level: 'Moderate',
    customer_demand_score: 65,
    expected_operating_days_per_month: 26,
    entrepreneur_experience_years: 2,
    location_suitability_score: 4,
    available_staff_count: 2,
    required_staff_count: 2,
    available_equipment_score: 4,
    required_equipment_score: 4,
    supplier_availability_score: 4
  };

  // Goals Matrix
  const STAGE_GOAL_OPTIONS = {
    "New": [
      { id: "Establish New Business", label: "Establish New Commercial Enterprise", desc: "Launch a brand new physical or commercial branch." },
      { id: "Start Home-Based Enterprise", label: "Start Home-Based / Micro Business", desc: "Operate from home with initial seed capital." },
      { id: "Launch Digital Store", label: "Launch Digital / E-Commerce Business", desc: "Focus on online and delivery-based operations." }
    ],
    "Existing": [
      { id: "Open New Branch", label: "Expand / Open a New Branch", desc: "Set up an additional physical location or branch." },
      { id: "Introduce New Product", label: "Introduce a New Product / Service Line", desc: "Add new inventory, offerings, or service lines." },
      { id: "Improve Current Operations", label: "Upgrade Equipment & Operational Efficiency", desc: "Invest in machinery, staff, and process improvements." },
      { id: "Increase Production Capacity", label: "Increase Production & Customer Capacity", desc: "Scale up daily customer volume and inventory throughput." }
    ]
  };

  // Handle Step 0 Context Confirmation
  const handleConfirmContext = () => {
    setStep(1);
  };

  // Handle Step 1 Text Extraction
  const handleExtractText = async () => {
    if (!inputText || inputText.trim().length < 5) {
      setErrorMsg("Please describe your business idea or existing business before continuing.");
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const data = await extractIntakeInformation(inputText, selectedStage, selectedGoal);
      setExtractionResult(data);
      
      // Update selected category if extracted
      if (data.context?.business_category) {
        setSelectedCategory(data.context.business_category);
      }

      // Initialize verified fields with extracted non-null values
      const initialVerified = {
        business_stage: selectedStage,
        business_category: data.context?.business_category || selectedCategory,
        proposed_action: `${selectedGoal} (${data.context?.business_category || selectedCategory})`
      };

      Object.entries(data.extracted_fields).forEach(([k, f]) => {
        if (f.value !== null && f.status !== 'hidden') {
          initialVerified[k] = f.value;
        }
      });
      setVerifiedFields(initialVerified);
      setStep(2);

    } catch (err) {
      setErrorMsg(`Information extraction failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Field Value Change during review/editing
  const handleFieldChange = (key, val, isNum = false) => {
    setVerifiedFields(prev => ({
      ...prev,
      [key]: isNum ? (val === '' ? '' : parseFloat(val)) : val
    }));
  };

  // Handle Final Submission to Analysis Orchestrator
  const handleFinalSubmit = () => {
    const finalPayload = {
      ...BASELINE_SCHEMA_VALUES,
      ...verifiedFields,
      business_stage: selectedStage,
      business_category: verifiedFields.business_category || selectedCategory,
      proposed_action: `${selectedGoal} (${verifiedFields.business_category || selectedCategory})`,
      original_business_description: inputText,
      extraction_metadata: {
        intake_mode: 'ai_assistant',
        context_stage: selectedStage,
        context_goal: selectedGoal,
        extracted_count: extractionResult?.summary?.extracted_count || 0,
        missing_required_count: extractionResult?.summary?.missing_required_count || 0,
        hidden_count: extractionResult?.summary?.hidden_count || 0,
        verified_by_user: true
      }
    };
    onCompleteIntake(finalPayload);
  };

  return (
    <div className="glass-card" style={{ maxWidth: '980px', margin: '0 auto' }}>
      
      {/* Step Indicator Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Logo variant="compact" height={38} />
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>SME360 AI Business Intake Assistant</h2>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Step {step} of 4 — {step === 0 ? 'Stage & Goal Context' : step === 1 ? 'Conversational Description' : step === 2 ? 'AI Verification' : step === 3 ? 'Missing Fields' : 'Final Review'}
            </div>
          </div>
        </div>

        <button 
          onClick={onSwitchToManual}
          className="btn btn-secondary"
          style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}
        >
          <FileEdit size={14} />
          Fill Form Manually
        </button>
      </div>

      {/* ERROR MESSAGE DISPLAY */}
      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '0.75rem 1rem', borderRadius: '8px', color: '#fca5a5', fontSize: '0.8rem', marginBottom: '1rem' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 0: BUSINESS STAGE & CONTEXTUAL GOAL SELECTION */}
      {/* ========================================================================= */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
              What is the current stage of your business?
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Select your business situation so our AI can dynamically tailor the intake process to ask ONLY for relevant information.
            </p>
          </div>

          {/* Stage Selection Cards */}
          <div className="grid-2">
            <div 
              onClick={() => {
                setSelectedStage('New');
                setSelectedGoal('Establish New Business');
              }}
              style={{ 
                padding: '1.25rem', 
                borderRadius: '12px', 
                cursor: 'pointer',
                border: selectedStage === 'New' ? '2px solid #60a5fa' : '1px solid var(--border-color)',
                background: selectedStage === 'New' ? 'rgba(30, 58, 138, 0.3)' : 'rgba(15, 23, 42, 0.6)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: selectedStage === 'New' ? '#60a5fa' : '#fff', fontSize: '1rem', marginBottom: '0.35rem' }}>
                <Building2 size={20} /> New Startup
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5' }}>
                Your business has not started operating yet. Focus is on evaluating feasibility under proposed location, budget, and customer demand.
              </p>
            </div>

            <div 
              onClick={() => {
                setSelectedStage('Existing');
                setSelectedGoal('Open New Branch');
              }}
              style={{ 
                padding: '1.25rem', 
                borderRadius: '12px', 
                cursor: 'pointer',
                border: selectedStage === 'Existing' ? '2px solid #60a5fa' : '1px solid var(--border-color)',
                background: selectedStage === 'Existing' ? 'rgba(30, 58, 138, 0.3)' : 'rgba(15, 23, 42, 0.6)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: selectedStage === 'Existing' ? '#60a5fa' : '#fff', fontSize: '1rem', marginBottom: '0.35rem' }}>
                <Target size={20} /> Existing Business
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5' }}>
                You already run an active business enterprise. Focus is on expanding branches, introducing new products, or improving operational efficiency.
              </p>
            </div>
          </div>

          {/* Context Goal Selection */}
          <div style={{ marginTop: '0.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
              What is your primary goal or proposed action?
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {STAGE_GOAL_OPTIONS[selectedStage].map((g) => (
                <div
                  key={g.id}
                  onClick={() => setSelectedGoal(g.id)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: selectedGoal === g.id ? '1px solid #60a5fa' : '1px solid var(--border-color)',
                    background: selectedGoal === g.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: selectedGoal === g.id ? '#60a5fa' : '#fff' }}>
                      {g.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                      {g.desc}
                    </div>
                  </div>
                  {selectedGoal === g.id && <Check size={18} style={{ color: '#60a5fa' }} />}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyRight: 'flex-end', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button onClick={handleConfirmContext} className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
              <span>Continue to Description</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: CONVERSATIONAL NATURAL LANGUAGE INPUT */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="tag-component">{selectedStage} Business</span>
              <span className="tag-component" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                Goal: {selectedGoal}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
              Tell us about your business proposal
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
              Describe your business in your own words (English or Singlish). Our AI will extract relevant facts and dynamically hide non-applicable fields.
            </p>
          </div>

          <div className="form-group">
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                selectedStage === 'New'
                  ? "Example: I want to start a small bakery in Homagama. I have around Rs. 500,000 available. I have 5 years of baking experience and expect around 40 customers per day..."
                  : "Example: I already run a bakery in Homagama for 3 years with 5 employees and 60 customers per day. I want to open a new branch in Maharagama with Rs. 800,000 capital..."
              }
              className="form-control"
              style={{ fontSize: '0.9rem', lineHeight: '1.6', padding: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
            <button onClick={() => setStep(0)} className="btn btn-secondary">
              Back to Stage Selection
            </button>
            
            <button
              onClick={handleExtractText}
              disabled={loading || !inputText.trim()}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.75rem' }}
            >
              {loading ? (
                <span>Understanding your business...</span>
              ) : (
                <>
                  <span>Extract Information</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: AI UNDERSTANDING & REVIEW */}
      {/* ========================================================================= */}
      {step === 2 && extractionResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
              We understood your business proposal
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Extracted attributes mapped dynamically for: <strong style={{ color: '#60a5fa' }}>{selectedStage} Business ({selectedGoal})</strong>. Non-applicable fields are hidden.
            </p>
          </div>

          {/* Extracted Fields List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            {/* 1. Confirmed Extracted Fields */}
            {Object.entries(extractionResult.extracted_fields)
              .filter(([_, f]) => f.status === 'extracted')
              .map(([key, f]) => (
                <div key={key} style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '0.85rem 1rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle2 size={14} /> {f.label}
                    </span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginTop: '0.15rem' }}>
                      {typeof f.value === 'number' ? f.value.toLocaleString() : f.value}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{f.note}</span>
                </div>
              ))}

            {/* 2. Needs Verification Fields */}
            {Object.entries(extractionResult.extracted_fields)
              .filter(([_, f]) => f.status === 'needs_verification')
              .map(([key, f]) => (
                <div key={key} style={{ background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '0.85rem 1rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#fde047', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <AlertTriangle size={14} /> {f.label} (Please Verify)
                    </span>
                    <div style={{ marginTop: '0.35rem' }}>
                      <input
                        type={f.type === 'number' ? 'number' : 'text'}
                        value={verifiedFields[key] ?? ''}
                        onChange={(e) => handleFieldChange(key, e.target.value, f.type === 'number')}
                        className="form-control"
                        style={{ width: '220px', padding: '0.35rem 0.65rem' }}
                      />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#fde047' }}>{f.note}</span>
                </div>
              ))}

            {/* Summary of Hidden vs Missing Fields */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', padding: '0.85rem 1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <HelpCircle size={14} /> Dynamic Context Summary
              </div>
              <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                • <strong style={{ color: '#60a5fa' }}>{extractionResult.summary.missing_required_count}</strong> Required Fields Still Missing | • <strong style={{ color: '#94a3b8' }}>{extractionResult.summary.hidden_count}</strong> Non-Applicable Fields Hidden
              </p>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
            <button onClick={() => setStep(1)} className="btn btn-secondary">
              <RotateCcw size={16} /> Edit Description
            </button>
            <button onClick={() => setStep(3)} className="btn btn-primary">
              <span>Complete Missing Details</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: COMPLETE MISSING INFORMATION (DYNAMIC CONTEXT-AWARE FORM) */}
      {/* ========================================================================= */}
      {step === 3 && extractionResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
              Just a few missing details for your {selectedStage} Business
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Showing ONLY required and relevant missing fields for: <strong style={{ color: '#60a5fa' }}>{selectedGoal}</strong>. Hidden/non-applicable fields are excluded.
            </p>
          </div>

          <div className="grid-2">
            
            {/* Render missing fields that are NOT hidden */}
            {Object.entries(extractionResult.extracted_fields)
              .filter(([_, f]) => f.status === 'missing' && f.requirement_state !== 'hidden')
              .map(([key, meta]) => (
                <div key={key} className="form-group">
                  <label className="form-label" style={{ color: meta.requirement_state === 'required' ? '#60a5fa' : '#cbd5e1' }}>
                    {meta.requirement_state === 'required' ? '★ ' : '○ '}{meta.label} {meta.requirement_state === 'required' ? '(Required)' : '(Optional)'}
                  </label>
                  
                  {meta.type === 'select' ? (
                    <select
                      value={verifiedFields[key] || BASELINE_SCHEMA_VALUES[key]}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      className="form-select"
                    >
                      {key === 'business_stage' && <><option value="New">New Startup</option><option value="Existing">Existing Business</option></>}
                      {key === 'business_category' && <><option value="Bakery">Bakery</option><option value="Retail">Retail</option><option value="Restaurant">Restaurant</option><option value="Garments">Garments</option><option value="IT Services">IT Services</option><option value="Services">Services</option></>}
                      {key === 'district' && <><option value="Colombo">Colombo</option><option value="Gampaha">Gampaha</option><option value="Kalutara">Kalutara</option></>}
                      {key === 'location_type' && <><option value="Suburban Commercial Hub">Suburban Commercial Hub</option><option value="Urban Main Street">Urban Main Street</option><option value="Industrial Zone">Industrial Zone</option><option value="Home Based">Home Based</option></>}
                      {key === 'competition_level' && <><option value="Low">Low Competition</option><option value="Moderate">Moderate Competition</option><option value="High">High Competition</option></>}
                    </select>
                  ) : (
                    <input
                      type={meta.type === 'number' ? 'number' : 'text'}
                      value={verifiedFields[key] ?? (BASELINE_SCHEMA_VALUES[key] || '')}
                      onChange={(e) => handleFieldChange(key, e.target.value, meta.type === 'number')}
                      className="form-control"
                    />
                  )}
                </div>
              ))}

          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
            <button onClick={() => setStep(2)} className="btn btn-secondary">
              Back to Extracted View
            </button>
            <button onClick={() => setStep(4)} className="btn btn-primary">
              <span>Review Final Profile</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: FINAL REVIEW & CONFIRM */}
      {/* ========================================================================= */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
              Review Your Context-Aware Business Profile
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Confirm your verified parameters for <strong style={{ color: '#60a5fa' }}>{selectedStage} Business — {selectedGoal}</strong> before executing the Random Forest Feasibility Pipeline.
            </p>
          </div>

          <div className="glass-card" style={{ background: '#0f172a', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#60a5fa', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Verified Parameter Summary ({selectedStage} Stage — {selectedGoal})
            </h4>

            <div className="grid-3" style={{ fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: '#94a3b8' }}>Stage: </span>
                <strong style={{ color: '#fff' }}>{selectedStage}</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Category: </span>
                <strong style={{ color: '#fff' }}>{verifiedFields.business_category || selectedCategory}</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>District: </span>
                <strong style={{ color: '#fff' }}>{verifiedFields.district || BASELINE_SCHEMA_VALUES.district}</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Available Capital: </span>
                <strong style={{ color: '#4ade80' }}>LKR {Number(verifiedFields.available_capital_lkr || BASELINE_SCHEMA_VALUES.available_capital_lkr).toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Monthly Budget: </span>
                <strong style={{ color: '#fff' }}>LKR {Number(verifiedFields.monthly_budget_lkr || BASELINE_SCHEMA_VALUES.monthly_budget_lkr).toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Expected Customers/Day: </span>
                <strong style={{ color: '#fff' }}>{verifiedFields.expected_customers_per_day || BASELINE_SCHEMA_VALUES.expected_customers_per_day}</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Experience: </span>
                <strong style={{ color: '#fff' }}>{verifiedFields.entrepreneur_experience_years || BASELINE_SCHEMA_VALUES.entrepreneur_experience_years} Years</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Competition: </span>
                <strong style={{ color: '#fff' }}>{verifiedFields.competition_level || BASELINE_SCHEMA_VALUES.competition_level}</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Unit Price: </span>
                <strong style={{ color: '#fff' }}>LKR {verifiedFields.expected_price_lkr || BASELINE_SCHEMA_VALUES.expected_price_lkr}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
            <button onClick={() => setStep(3)} className="btn btn-secondary">
              Edit Details
            </button>
            <button onClick={handleFinalSubmit} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}>
              <Check size={18} />
              <span>Run AI Feasibility Analysis</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
