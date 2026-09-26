import React, { useState } from 'react';
import { Building, DollarSign, Users, Rocket } from 'lucide-react';

export default function BusinessForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    business_stage: 'New',
    business_category: 'Bakery',
    district: 'Colombo',
    province: 'Western',
    location_type: 'Suburban Commercial Hub',
    proposed_action: 'Establish New Bakery Branch',
    available_capital_lkr: 800000,
    loan_amount_lkr: 200000,
    monthly_budget_lkr: 150000,
    initial_inventory_cost_lkr: 180000,
    expected_price_lkr: 350,
    expected_customers_per_day: 45,
    competition_level: 'Moderate',
    customer_demand_score: 75,
    expected_operating_days_per_month: 26,
    entrepreneur_experience_years: 4,
    location_suitability_score: 4,
    available_staff_count: 3,
    required_staff_count: 3,
    available_equipment_score: 4,
    required_equipment_score: 4,
    supplier_availability_score: 5,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass-card">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building size={22} style={{ color: '#60a5fa' }} />
          SME Business Information Entry
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Provide operational, financial, and market parameters for the proposed or existing SME in Sri Lanka.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid-3">
          
          {/* Column 1: Profile & Location */}
          <div className="form-section">
            <div className="form-section-title" style={{ color: '#60a5fa' }}>
              <Building size={18} />
              1. Profile & Location
            </div>

            <div className="form-group">
              <label className="form-label">Business Stage</label>
              <select name="business_stage" value={formData.business_stage} onChange={handleChange} className="form-select">
                <option value="New">New Startup</option>
                <option value="Existing">Existing Business Expansion</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Business Category</label>
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
              <label className="form-label">District</label>
              <select name="district" value={formData.district} onChange={handleChange} className="form-select">
                <option value="Colombo">Colombo District</option>
                <option value="Gampaha">Gampaha District</option>
                <option value="Kalutara">Kalutara District</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location Type</label>
              <select name="location_type" value={formData.location_type} onChange={handleChange} className="form-select">
                <option value="Suburban Commercial Hub">Suburban Commercial Hub (e.g. Homagama)</option>
                <option value="Urban Main Street">Urban Main Street</option>
                <option value="Industrial Zone">Industrial / Commercial Zone</option>
                <option value="Home Based">Home-Based Operations</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Proposed Action</label>
              <input type="text" name="proposed_action" value={formData.proposed_action} onChange={handleChange} className="form-control" />
            </div>
          </div>

          {/* Column 2: Financial Capital & Budget */}
          <div className="form-section">
            <div className="form-section-title" style={{ color: '#818cf8' }}>
              <DollarSign size={18} />
              2. Financial Capital & Budget
            </div>

            <div className="form-group">
              <label className="form-label">Available Capital (LKR)</label>
              <input type="number" name="available_capital_lkr" value={formData.available_capital_lkr} onChange={handleChange} step="50000" min="0" className="form-control" />
            </div>

            <div className="form-group">
              <label className="form-label">Requested Loan Amount (LKR)</label>
              <input type="number" name="loan_amount_lkr" value={formData.loan_amount_lkr} onChange={handleChange} step="25000" min="0" className="form-control" />
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Operating Budget (LKR)</label>
              <input type="number" name="monthly_budget_lkr" value={formData.monthly_budget_lkr} onChange={handleChange} step="10000" min="0" className="form-control" />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Inventory Cost (LKR)</label>
              <input type="number" name="initial_inventory_cost_lkr" value={formData.initial_inventory_cost_lkr} onChange={handleChange} step="10000" min="0" className="form-control" />
            </div>

            <div className="form-group">
              <label className="form-label">Expected Price / Unit (LKR)</label>
              <input type="number" name="expected_price_lkr" value={formData.expected_price_lkr} onChange={handleChange} step="25" min="1" className="form-control" />
            </div>
          </div>

          {/* Column 3: Operations & Demand */}
          <div className="form-section">
            <div className="form-section-title" style={{ color: '#c084fc' }}>
              <Users size={18} />
              3. Operations & Demand
            </div>

            <div className="form-group">
              <label className="form-label">Expected Customers / Day</label>
              <input type="number" name="expected_customers_per_day" value={formData.expected_customers_per_day} onChange={handleChange} min="1" className="form-control" />
            </div>

            <div className="form-group">
              <label className="form-label">Competition Level</label>
              <select name="competition_level" value={formData.competition_level} onChange={handleChange} className="form-select">
                <option value="Low">Low Competition</option>
                <option value="Moderate">Moderate Competition</option>
                <option value="High">High Competition</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Customer Demand Score (1-100)</label>
              <input type="number" name="customer_demand_score" value={formData.customer_demand_score} onChange={handleChange} min="1" max="100" className="form-control" />
            </div>

            <div className="form-group">
              <label className="form-label">Entrepreneur Experience (Years)</label>
              <input type="number" name="entrepreneur_experience_years" value={formData.entrepreneur_experience_years} onChange={handleChange} min="0" className="form-control" />
            </div>

            <div className="form-group">
              <label className="form-label">Available Staff Count</label>
              <input type="number" name="available_staff_count" value={formData.available_staff_count} onChange={handleChange} min="0" className="form-control" />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}>
            {loading ? (
              <span>Executing AI Decision Pipeline...</span>
            ) : (
              <>
                <Rocket size={18} />
                <span>Run Complete AI Analysis</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
