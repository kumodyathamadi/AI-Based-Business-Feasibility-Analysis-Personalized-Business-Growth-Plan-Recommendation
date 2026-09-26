import React from 'react';
import { FileText, Calendar, DollarSign, Users, Briefcase } from 'lucide-react';

export default function BusinessPlan({ planData }) {
  if (!planData) return null;

  const {
    executive_overview = {},
    operational_plan = {},
    marketing_plan = {},
    financial_plan = {},
    action_roadmap = {},
  } = planData;

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Title */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} style={{ color: '#60a5fa' }} />
          Personalized 5-Section Business & Growth Plan
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem' }}>
          Tailored operational and financial guidance generated directly from model feasibility predictions, SHAP attribution drivers, and TOPSIS rankings.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Section 1: Executive Overview */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={16} />
            1. Business Overview
          </h4>
          <p style={{ fontSize: '0.825rem', color: '#e2e8f0', lineHeight: '1.6' }}>
            {executive_overview.business_summary}
          </p>
        </div>

        {/* Section 2: Operational & Resource Plan */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} />
            2. Operational & Resource Setup
          </h4>
          <div style={{ fontSize: '0.825rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <p>• {operational_plan.staffing_requirements}</p>
            <p>• {operational_plan.equipment_readiness}</p>
          </div>
        </div>

        {/* Section 3: Marketing & Customers */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} />
            3. Marketing & Customer Demand
          </h4>
          <p style={{ fontSize: '0.825rem', color: '#cbd5e1' }}>
            • {marketing_plan.demand_score}
          </p>
          <p style={{ fontSize: '0.825rem', color: '#cbd5e1', marginTop: '0.35rem' }}>
            • Target Daily Customers: <strong style={{ color: '#ffffff' }}>{marketing_plan.target_daily_customers}</strong>
          </p>
        </div>

        {/* Section 4: Financial Planning */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={16} />
            4. Financial Planning
          </h4>
          <p style={{ fontSize: '0.825rem', color: '#cbd5e1' }}>
            {financial_plan.counterfactual_guidance}
          </p>
        </div>

        {/* Section 5: Time-Phased Action Roadmap */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(234, 179, 8, 0.4)' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fde047', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} />
            5. Time-Phased Action Roadmap
          </h4>

          {/* Phase 1: 0-3 Months */}
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', background: 'rgba(234, 179, 8, 0.2)', padding: '0.25rem 0.65rem', borderRadius: '4px' }}>
              Phase 1: Immediate Launch (0 – 3 Months)
            </span>
            <ul style={{ fontSize: '0.8rem', color: '#cbd5e1', paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {action_roadmap.phase_1_immediate_0_to_3_months?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Phase 2: 3-12 Months */}
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', background: 'rgba(59, 130, 246, 0.2)', padding: '0.25rem 0.65rem', borderRadius: '4px' }}>
              Phase 2: Operational Stabilization (3 – 12 Months)
            </span>
            <ul style={{ fontSize: '0.8rem', color: '#cbd5e1', paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {action_roadmap.phase_2_stabilization_3_to_12_months?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Phase 3: 1 Year+ */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', background: 'rgba(168, 85, 247, 0.2)', padding: '0.25rem 0.65rem', borderRadius: '4px' }}>
              Phase 3: Business Expansion (1 Year+)
            </span>
            <ul style={{ fontSize: '0.8rem', color: '#cbd5e1', paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {action_roadmap.phase_3_growth_1_year_plus?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
