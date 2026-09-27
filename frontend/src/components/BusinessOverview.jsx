import React from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Users, 
  Clock, 
  Award, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lightbulb, 
  Sliders, 
  FileText 
} from 'lucide-react';

export default function BusinessOverview({ profile, onNavigate }) {
  if (!profile) return null;

  const { business_input = {}, feasibility_analysis = {}, personalized_business_plan = {} } = profile;
  const { predicted_label, confidence_score } = feasibility_analysis;

  const getBadgeClass = (label) => {
    if (label === 'Feasible') return 'badge-feasible';
    if (label === 'Conditionally Feasible') return 'badge-conditionally';
    return 'badge-infeasible';
  };

  const getBadgeIcon = (label) => {
    if (label === 'Feasible') return <CheckCircle2 size={18} style={{ color: '#4ade80' }} />;
    if (label === 'Conditionally Feasible') return <AlertTriangle size={18} style={{ color: '#fde047' }} />;
    return <XCircle size={18} style={{ color: '#fca5a5' }} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Overview Banner */}
      <div 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))', 
          border: '1px solid var(--border-accent)',
          padding: '1.75rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', background: 'rgba(59, 130, 246, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                {business_input.business_stage || 'Startup'} Stage
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={14} /> {business_input.district || 'Colombo'} District
              </span>
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
              {business_input.business_category || 'SME Business'}
            </h2>
            
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.5rem', maxWidth: '750px', lineHeight: '1.5' }}>
              {personalized_business_plan.executive_overview?.business_summary || 'Business profile overview and feasibility evaluation.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <div className={getBadgeClass(predicted_label)} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
              {getBadgeIcon(predicted_label)}
              <span>{predicted_label}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Model Confidence: <strong style={{ color: '#ffffff' }}>{(confidence_score * 100).toFixed(1)}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-3">
        <div className="glass-card">
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, uppercase: 'uppercase', letterSpacing: '0.5px' }}>Financial Capital</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#4ade80', marginTop: '0.25rem' }}>
            LKR {Number(business_input.available_capital_lkr || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            Monthly Budget: LKR {Number(business_input.monthly_budget_lkr || 0).toLocaleString()}
          </div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, uppercase: 'uppercase', letterSpacing: '0.5px' }}>Target Customer Demand</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#60a5fa', marginTop: '0.25rem' }}>
            {business_input.expected_customers_per_day || 0} / Day
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            Expected Price: LKR {business_input.expected_price_lkr || 0}
          </div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, uppercase: 'uppercase', letterSpacing: '0.5px' }}>Operational Readiness</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#c084fc', marginTop: '0.25rem' }}>
            {business_input.entrepreneur_experience_years || 0} Years Exp.
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            Staff Count: {business_input.available_staff_count || 1} Person(s)
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards into Analysis Modules */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
          Explore Business Decision Modules
        </h3>

        <div className="grid-2">
          <div 
            className="glass-card" 
            style={{ cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }}
            onClick={() => onNavigate('feasibility')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#60a5fa' }}>
                <Award size={20} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>1. Feasibility Assessment</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5' }}>
              Detailed Random Forest feasibility classification and probability score distribution.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600, marginTop: '0.75rem' }}>
              <span>View Feasibility Assessment</span> <ArrowRight size={14} />
            </div>
          </div>

          <div 
            className="glass-card" 
            style={{ cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }}
            onClick={() => onNavigate('insights')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#4ade80' }}>
                <TrendingUp size={20} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>2. Key Insights & Drivers</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5' }}>
              Discover the top positive supporting factors and risk hurdles influencing your prediction.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#4ade80', fontWeight: 600, marginTop: '0.75rem' }}>
              <span>View Key Insights</span> <ArrowRight size={14} />
            </div>
          </div>

          <div 
            className="glass-card" 
            style={{ cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }}
            onClick={() => onNavigate('recommendations')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#c084fc' }}>
                <Lightbulb size={20} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>3. Strategic Recommendations</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5' }}>
              Actionable business advice tailored to your market situation and resource availability.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#c084fc', fontWeight: 600, marginTop: '0.75rem' }}>
              <span>View Recommendations</span> <ArrowRight size={14} />
            </div>
          </div>

          <div 
            className="glass-card" 
            style={{ cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }}
            onClick={() => onNavigate('scenario')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#fde047' }}>
                <Sliders size={20} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>4. Scenario Explorer</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5' }}>
              Simulate variations in capital, pricing, and budget to see how outcomes change.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#fde047', fontWeight: 600, marginTop: '0.75rem' }}>
              <span>Open Scenario Explorer</span> <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
