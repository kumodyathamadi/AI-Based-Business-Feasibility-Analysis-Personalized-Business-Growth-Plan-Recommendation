import React, { useState, useEffect } from 'react';
import { Building, DollarSign, Users, Rocket, Sparkles, AlertCircle, Info } from 'lucide-react';

const EMPTY_FORM_STATE = {
  business_stage: 'New',
  business_category: 'Bakery',
  district: 'Colombo',
  province: 'Western',
  location_type: 'Suburban Commercial Hub',
  proposed_action: '',
  available_capital_lkr: '',
  loan_amount_lkr: '',
  monthly_budget_lkr: '',
  initial_inventory_cost_lkr: '',
  expected_price_lkr: '',
  expected_customers_per_day: '',
  competition_level: 'Moderate',
  customer_demand_score: '',
  expected_operating_days_per_month: '',
  entrepreneur_experience_years: '',
  location_suitability_score: '',
  available_staff_count: '',
  required_staff_count: '',
  available_equipment_score: '',
  required_equipment_score: '',
  supplier_availability_score: '',
};

const DEFAULT_SCHEMA_FALLBACKS = {
  business_stage: 'New',
  business_category: 'Bakery',
  district: 'Colombo',
  province: 'Western',
  location_type: 'Suburban Commercial Hub',
  proposed_action: 'Establish SME Business Operation',
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
  supplier_availability_score: 4,
};

export default function BusinessForm({ 
  initialValues = null, 
  aiFilledKeys = null, 
  aiNotice = null,
  onSubmit, 
  loading, 
  onSwitchToAi 
}) {
  const [formData, setFormData] = useState(() => {
    if (!initialValues) return EMPTY_FORM_STATE;
    const merged = { ...EMPTY_FORM_STATE };
    Object.keys(EMPTY_FORM_STATE).forEach((k) => {
      if (initialValues[k] !== undefined && initialValues[k] !== null && initialValues[k] !== '') {
        merged[k] = initialValues[k];
      }
    });
    return merged;
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialValues) {
      const merged = { ...EMPTY_FORM_STATE };
      Object.keys(EMPTY_FORM_STATE).forEach((k) => {
        if (initialValues[k] !== undefined && initialValues[k] !== null && initialValues[k] !== '') {
          merged[k] = initialValues[k];
        }
      });
      setFormData(merged);
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  const isAiFilled = (key) => {
    if (!aiFilledKeys) return false;
    if (aiFilledKeys instanceof Set) return aiFilledKeys.has(key);
    if (Array.isArray(aiFilledKeys)) return aiFilledKeys.includes(key);
    return false;
  };

  const renderLabel = (text, key, isRequired = false) => {
    const filled = isAiFilled(key) && formData[key] !== '' && formData[key] !== null;
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
        <label className="form-label" style={{ marginBottom: 0 }}>
          {text} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        {filled && (
          <span style={{ 
            fontSize: '0.7rem', 
            color: '#c084fc', 
            background: 'rgba(168, 85, 247, 0.15)', 
            border: '1px solid rgba(168, 85, 247, 0.3)',
            padding: '0.1rem 0.45rem', 
            borderRadius: '4px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Sparkles size={11} /> AI-filled
          </span>
        )}
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.business_category) {
      setValidationError('Please select or specify a Business Category.');
      return;
    }
    if (formData.available_capital_lkr === '' || formData.available_capital_lkr === null || formData.available_capital_lkr === undefined) {
      setValidationError('Please enter your Available Capital (LKR).');
      return;
    }

    setValidationError('');

    const finalPayload = {
      ...DEFAULT_SCHEMA_FALLBACKS,
      ...formData,
      available_capital_lkr: formData.available_capital_lkr !== '' ? Number(formData.available_capital_lkr) : 500000,
      loan_amount_lkr: formData.loan_amount_lkr !== '' ? Number(formData.loan_amount_lkr) : 0,
      monthly_budget_lkr: formData.monthly_budget_lkr !== '' ? Number(formData.monthly_budget_lkr) : 100000,
      initial_inventory_cost_lkr: formData.initial_inventory_cost_lkr !== '' ? Number(formData.initial_inventory_cost_lkr) : 150000,
      expected_price_lkr: formData.expected_price_lkr !== '' ? Number(formData.expected_price_lkr) : 350,
      expected_customers_per_day: formData.expected_customers_per_day !== '' ? Number(formData.expected_customers_per_day) : 40,
      customer_demand_score: formData.customer_demand_score !== '' ? Number(formData.customer_demand_score) : 65,
      expected_operating_days_per_month: formData.expected_operating_days_per_month !== '' ? Number(formData.expected_operating_days_per_month) : 26,
      entrepreneur_experience_years: formData.entrepreneur_experience_years !== '' ? Number(formData.entrepreneur_experience_years) : 2,
      location_suitability_score: formData.location_suitability_score !== '' ? Number(formData.location_suitability_score) : 4,
      available_staff_count: formData.available_staff_count !== '' ? Number(formData.available_staff_count) : 2,
      required_staff_count: formData.required_staff_count !== '' ? Number(formData.required_staff_count) : 2,
      available_equipment_score: formData.available_equipment_score !== '' ? Number(formData.available_equipment_score) : 4,
      required_equipment_score: formData.required_equipment_score !== '' ? Number(formData.required_equipment_score) : 4,
      supplier_availability_score: formData.supplier_availability_score !== '' ? Number(formData.supplier_availability_score) : 4,
    };

    if (!finalPayload.proposed_action || !finalPayload.proposed_action.trim()) {
      finalPayload.proposed_action = `${formData.business_stage === 'New' ? 'Establish New' : 'Expand'} ${formData.business_category} Business`;
    }

    onSubmit(finalPayload);
  };

  const filledCount = aiFilledKeys ? (aiFilledKeys instanceof Set ? aiFilledKeys.size : aiFilledKeys.length) : 0;

  return (
    <div className="glass-card">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={22} style={{ color: '#60a5fa' }} />
            Business Information Form
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {filledCount > 0 
              ? 'Review, update prefilled parameters, and complete any remaining fields.'
              : 'Complete your SME operational, financial, and market parameters.'}
          </p>
        </div>

        {onSwitchToAi && (
          <button 
            type="button"
            onClick={onSwitchToAi}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.45rem 0.85rem' }}
          >
            <Sparkles size={14} style={{ color: '#c084fc' }} />
            Describe Business in Natural Language
          </button>
        )}
      </div>

      {/* AI Prefill Notice Banner */}
      {filledCount > 0 && (
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '0.85rem 1.15rem', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Sparkles size={20} style={{ color: '#60a5fa', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
              Business Information Prefilled by SME360 AI
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
              We extracted {filledCount} values from your business description. AI-known values are marked with <Sparkles size={11} style={{ color: '#c084fc', display: 'inline' }} /> <strong>AI-filled</strong>. Edit any field to override.
            </div>
          </div>
        </div>
      )}

      {/* Fallback Notice */}
      {aiNotice && (
        <div style={{ background: 'rgba(234, 179, 8, 0.12)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '0.85rem 1.15rem', borderRadius: '10px', marginBottom: '1.25rem', color: '#fde047', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Info size={18} style={{ flexShrink: 0 }} />
          <span>{aiNotice}</span>
        </div>
      )}

      {/* Validation Error Banner */}
      {validationError && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '0.75rem 1rem', borderRadius: '8px', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid-3">
          
          {/* Column 1: Profile & Location */}
          <div className="form-section">
            <div className="form-section-title" style={{ color: '#60a5fa' }}>
              <Building size={18} />
              1. Profile & Location
            </div>

            <div className="form-group">
              {renderLabel('Business Stage', 'business_stage', true)}
              <select name="business_stage" value={formData.business_stage} onChange={handleChange} className="form-select">
                <option value="New">New Startup</option>
                <option value="Existing">Existing Business Expansion</option>
              </select>
            </div>

            <div className="form-group">
              {renderLabel('Business Category', 'business_category', true)}
              <select name="business_category" value={formData.business_category} onChange={handleChange} className="form-select">
                <option value="Bakery">Bakery / Confectionery</option>
                <option value="Retail">Retail Store / Grocery</option>
                <option value="Restaurant">Restaurant / Food Services</option>
                <option value="Garments">Apparel / Garments Manufacturing</option>
                <option value="IT Services">Tech / IT Services</option>
                <option value="Services">Personal / Business Services</option>
              </select>
            </div>

            <div className="form-group">
              {renderLabel('District', 'district', true)}
              <select name="district" value={formData.district} onChange={handleChange} className="form-select">
                <option value="Colombo">Colombo District</option>
                <option value="Gampaha">Gampaha District</option>
                <option value="Kalutara">Kalutara District</option>
              </select>
            </div>

            <div className="form-group">
              {renderLabel('Location Type', 'location_type')}
              <select name="location_type" value={formData.location_type} onChange={handleChange} className="form-select">
                <option value="Suburban Commercial Hub">Suburban Commercial Hub (e.g. Homagama)</option>
                <option value="Urban Main Street">Urban Main Street</option>
                <option value="Industrial Zone">Industrial / Commercial Zone</option>
                <option value="Home Based">Home-Based Operations</option>
              </select>
            </div>

            <div className="form-group">
              {renderLabel('Proposed Action', 'proposed_action')}
              <input 
                type="text" 
                name="proposed_action" 
                value={formData.proposed_action} 
                onChange={handleChange} 
                placeholder="e.g. Establish New Bakery Branch"
                className="form-control" 
              />
            </div>
          </div>

          {/* Column 2: Financial Capital & Budget */}
          <div className="form-section">
            <div className="form-section-title" style={{ color: '#818cf8' }}>
              <DollarSign size={18} />
              2. Financial Capital & Budget
            </div>

            <div className="form-group">
              {renderLabel('Available Capital (LKR)', 'available_capital_lkr', true)}
              <input 
                type="number" 
                name="available_capital_lkr" 
                value={formData.available_capital_lkr} 
                onChange={handleChange} 
                step="10000" 
                min="0" 
                placeholder="e.g. 500000"
                className="form-control" 
              />
            </div>

            <div className="form-group">
              {renderLabel('Requested Loan Amount (LKR)', 'loan_amount_lkr')}
              <input 
                type="number" 
                name="loan_amount_lkr" 
                value={formData.loan_amount_lkr} 
                onChange={handleChange} 
                step="25000" 
                min="0" 
                placeholder="e.g. 200000"
                className="form-control" 
              />
            </div>

            <div className="form-group">
              {renderLabel('Monthly Operating Budget (LKR)', 'monthly_budget_lkr')}
              <input 
                type="number" 
                name="monthly_budget_lkr" 
                value={formData.monthly_budget_lkr} 
                onChange={handleChange} 
                step="10000" 
                min="0" 
                placeholder="e.g. 150000"
                className="form-control" 
              />
            </div>

            <div className="form-group">
              {renderLabel('Initial Inventory Cost (LKR)', 'initial_inventory_cost_lkr')}
              <input 
                type="number" 
                name="initial_inventory_cost_lkr" 
                value={formData.initial_inventory_cost_lkr} 
                onChange={handleChange} 
                step="10000" 
                min="0" 
                placeholder="e.g. 180000"
                className="form-control" 
              />
            </div>

            <div className="form-group">
              {renderLabel('Expected Price / Unit (LKR)', 'expected_price_lkr')}
              <input 
                type="number" 
                name="expected_price_lkr" 
                value={formData.expected_price_lkr} 
                onChange={handleChange} 
                step="10" 
                min="1" 
                placeholder="e.g. 350"
                className="form-control" 
              />
            </div>
          </div>

          {/* Column 3: Operations & Demand */}
          <div className="form-section">
            <div className="form-section-title" style={{ color: '#c084fc' }}>
              <Users size={18} />
              3. Operations & Demand
            </div>

            <div className="form-group">
              {renderLabel('Expected Customers / Day', 'expected_customers_per_day')}
              <input 
                type="number" 
                name="expected_customers_per_day" 
                value={formData.expected_customers_per_day} 
                onChange={handleChange} 
                min="1" 
                placeholder="e.g. 40"
                className="form-control" 
              />
            </div>

            <div className="form-group">
              {renderLabel('Competition Level', 'competition_level')}
              <select name="competition_level" value={formData.competition_level} onChange={handleChange} className="form-select">
                <option value="Low">Low Competition</option>
                <option value="Moderate">Moderate Competition</option>
                <option value="High">High Competition</option>
              </select>
            </div>

            <div className="form-group">
              {renderLabel('Customer Demand Score (1-100)', 'customer_demand_score')}
              <input 
                type="number" 
                name="customer_demand_score" 
                value={formData.customer_demand_score} 
                onChange={handleChange} 
                min="1" 
                max="100" 
                placeholder="e.g. 65"
                className="form-control" 
              />
            </div>

            <div className="form-group">
              {renderLabel('Entrepreneur Experience (Years)', 'entrepreneur_experience_years')}
              <input 
                type="number" 
                name="entrepreneur_experience_years" 
                value={formData.entrepreneur_experience_years} 
                onChange={handleChange} 
                min="0" 
                placeholder="e.g. 5"
                className="form-control" 
              />
            </div>

            <div className="form-group">
              {renderLabel('Available Staff Count', 'available_staff_count')}
              <input 
                type="number" 
                name="available_staff_count" 
                value={formData.available_staff_count} 
                onChange={handleChange} 
                min="0" 
                placeholder="e.g. 2"
                className="form-control" 
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}>
            {loading ? (
              <span>Executing SME360 AI Decision Pipeline...</span>
            ) : (
              <>
                <Rocket size={18} />
                <span>Run SME360 AI Analysis</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

