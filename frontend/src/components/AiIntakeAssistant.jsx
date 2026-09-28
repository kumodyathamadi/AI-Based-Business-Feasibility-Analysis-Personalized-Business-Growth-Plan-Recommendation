import React, { useState } from 'react';
import { extractIntakeInformation } from '../services/api';
import BusinessForm from './BusinessForm';
import Logo from './Logo';
import { 
  Sparkles, 
  ArrowRight, 
  FileEdit, 
  Check,
  Target,
  Building2,
  Loader2
} from 'lucide-react';

export default function AiIntakeAssistant({ onCompleteIntake, onSwitchToManual }) {
  // Views: 'intake' -> 'extracting' -> 'form'
  const [step, setStep] = useState('intake');
  
  // Context Selection
  const [selectedStage, setSelectedStage] = useState('New');
  const [selectedGoal, setSelectedGoal] = useState('Establish New Business');

  const [inputText, setInputText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form Prefill Data & AI state
  const [prefilledData, setPrefilledData] = useState(null);
  const [aiFilledKeys, setAiFilledKeys] = useState(new Set());
  const [aiNotice, setAiNotice] = useState(null);

  // Goals Matrix for Existing Business
  const EXISTING_STAGE_GOAL_OPTIONS = [
    { id: "Open New Branch", label: "Expand / Open a New Branch", desc: "Set up an additional physical location or branch." },
    { id: "Introduce New Product", label: "Introduce a New Product / Service Line", desc: "Add new inventory, offerings, or service lines." },
    { id: "Improve Current Operations", label: "Upgrade Equipment & Operational Efficiency", desc: "Invest in machinery, staff, and process improvements." },
    { id: "Increase Production Capacity", label: "Increase Production & Customer Capacity", desc: "Scale up daily customer volume and inventory throughput." }
  ];

  // Handle Text Extraction -> Direct Form Prefill
  const handleExtractText = async () => {
    if (!inputText || inputText.trim().length < 5) {
      setErrorMsg("Please describe your business idea or existing business before continuing.");
      return;
    }
    setErrorMsg('');
    setStep('extracting');

    try {
      const data = await extractIntakeInformation(
        inputText, 
        selectedStage, 
        selectedStage === 'Existing' ? selectedGoal : 'Establish New Business'
      );

      const prefilled = {
        business_stage: selectedStage,
        original_business_description: inputText
      };
      const filledKeys = new Set();

      if (data.context && data.context.business_category) {
        prefilled.business_category = data.context.business_category;
        filledKeys.add('business_category');
      }

      if (data.extracted_fields) {
        Object.entries(data.extracted_fields).forEach(([key, meta]) => {
          if (meta.value !== null && meta.value !== undefined && meta.status !== 'hidden') {
            prefilled[key] = meta.value;
            filledKeys.add(key);
          }
        });
      }

      setPrefilledData(prefilled);
      setAiFilledKeys(filledKeys);
      setAiNotice(null);
      setStep('form');

    } catch (err) {
      console.error("AI Intake Extraction Error Fallback:", err);
      // Fallback: direct to form with empty fields + non-blocking notice
      setPrefilledData({ business_stage: selectedStage, original_business_description: inputText });
      setAiFilledKeys(new Set());
      setAiNotice("Some information couldn't be filled automatically. You can enter it manually below.");
      setStep('form');
    }
  };

  const handleManualSwitch = () => {
    if (onSwitchToManual) {
      onSwitchToManual();
    } else {
      setPrefilledData(null);
      setAiFilledKeys(new Set());
      setAiNotice(null);
      setStep('form');
    }
  };

  // If in 'form' view, render BusinessForm prefilled
  if (step === 'form') {
    return (
      <BusinessForm
        initialValues={prefilledData}
        aiFilledKeys={aiFilledKeys}
        aiNotice={aiNotice}
        onSubmit={onCompleteIntake}
        onSwitchToAi={() => setStep('intake')}
      />
    );
  }

  return (
    <div className="glass-card" style={{ maxWidth: '920px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Logo variant="compact" height={38} />
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>SME360 AI Business Intake Assistant</h2>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.1rem' }}>
              Background Intelligent Prefill into Original Business Form
            </div>
          </div>
        </div>

        <button 
          onClick={handleManualSwitch}
          className="btn btn-secondary"
          style={{ fontSize: '0.75rem', padding: '0.45rem 0.85rem' }}
        >
          <FileEdit size={14} />
          Fill Form Manually
        </button>
      </div>

      {/* ERROR MESSAGE DISPLAY */}
      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '0.75rem 1rem', borderRadius: '8px', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP: EXTRACTING LOADING STATE */}
      {/* ========================================================================= */}
      {step === 'extracting' && (
        <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <Loader2 size={48} style={{ color: '#60a5fa', animation: 'spin 1.5s linear infinite' }} />
            <Sparkles size={22} style={{ color: '#c084fc', position: 'absolute', top: '-5px', right: '-8px' }} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff' }}>
              Understanding your business...
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.35rem', maxWidth: '500px' }}>
              Extracting operational, financial, and context-aware attributes to prefill your Business Information Form.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP: NATURAL LANGUAGE INTAKE & CONTEXT SELECTION */}
      {/* ========================================================================= */}
      {step === 'intake' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* 1. Stage Selection */}
          <div>
            <label className="form-label" style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.65rem' }}>
              1. What is the current stage of your business?
            </label>

            <div className="grid-2">
              <div 
                onClick={() => {
                  setSelectedStage('New');
                  setSelectedGoal('Establish New Business');
                }}
                style={{ 
                  padding: '1.15rem', 
                  borderRadius: '12px', 
                  cursor: 'pointer',
                  border: selectedStage === 'New' ? '2px solid #60a5fa' : '1px solid var(--border-color)',
                  background: selectedStage === 'New' ? 'rgba(30, 58, 138, 0.35)' : 'rgba(15, 23, 42, 0.6)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: selectedStage === 'New' ? '#60a5fa' : '#fff', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  <Building2 size={18} /> New Startup
                </div>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4' }}>
                  Your business has not started operating yet. Feasibility will evaluate proposed capital, location, and market demand.
                </p>
              </div>

              <div 
                onClick={() => {
                  setSelectedStage('Existing');
                  setSelectedGoal('Open New Branch');
                }}
                style={{ 
                  padding: '1.15rem', 
                  borderRadius: '12px', 
                  cursor: 'pointer',
                  border: selectedStage === 'Existing' ? '2px solid #60a5fa' : '1px solid var(--border-color)',
                  background: selectedStage === 'Existing' ? 'rgba(30, 58, 138, 0.35)' : 'rgba(15, 23, 42, 0.6)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: selectedStage === 'Existing' ? '#60a5fa' : '#fff', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  <Target size={18} /> Existing Business
                </div>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4' }}>
                  You already run an active business enterprise. Focus is on expanding branches, introducing new lines, or operational scaling.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Existing Business Goal Selection (ONLY SHOWN FOR EXISTING BUSINESS - RULE 11 & 12) */}
          {selectedStage === 'Existing' && (
            <div>
              <label className="form-label" style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.65rem' }}>
                2. What is your primary growth goal or proposed action?
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {EXISTING_STAGE_GOAL_OPTIONS.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: selectedGoal === g.id ? '1px solid #60a5fa' : '1px solid var(--border-color)',
                      background: selectedGoal === g.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: selectedGoal === g.id ? '#60a5fa' : '#fff' }}>
                        {g.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.1rem' }}>
                        {g.desc}
                      </div>
                    </div>
                    {selectedGoal === g.id && <Check size={16} style={{ color: '#60a5fa' }} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Natural Language Description Input */}
          <div>
            <label className="form-label" style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.35rem' }}>
              {selectedStage === 'Existing' ? '3. Describe your existing business & expansion goal' : '2. Describe your business proposal in natural language'}
            </label>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.65rem' }}>
              Describe location, available capital, experience, price, expected customers, and operations in your own words.
            </p>

            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                selectedStage === 'New'
                  ? "Example: I want to start a bakery in Homagama. I have Rs. 500,000 capital and 5 years of baking experience. I expect around 40 customers per day..."
                  : "Example: I already run a bakery in Homagama for 3 years with 5 employees and 60 customers per day. I want to open a new branch in Maharagama with Rs. 800,000 capital..."
              }
              className="form-control"
              style={{ fontSize: '0.9rem', lineHeight: '1.6', padding: '1rem' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '0.5rem' }}>
            <button
              onClick={handleExtractText}
              disabled={!inputText.trim()}
              className="btn btn-primary"
              style={{ padding: '0.8rem 1.8rem', fontSize: '0.9rem' }}
            >
              <Sparkles size={16} />
              <span>Prefill Business Form</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

