import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Users, 
  Briefcase, 
  Download, 
  FileCheck, 
  Printer, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { downloadBusinessPlanPdf, downloadBusinessPlanDocx } from '../services/api';
import Logo from './Logo';

export default function BusinessPlan({ profile }) {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);

  if (!profile) return null;

  const planData = profile.personalized_business_plan || {};
  const {
    executive_overview = {},
    operational_plan = {},
    marketing_plan = {},
    financial_plan = {},
    action_roadmap = {},
  } = planData;

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      await downloadBusinessPlanPdf(profile);
    } catch (err) {
      alert(`PDF generation failed: ${err.message}`);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    setDownloadingDocx(true);
    try {
      await downloadBusinessPlanDocx(profile);
    } catch (err) {
      alert(`Word document generation failed: ${err.message}`);
    } finally {
      setDownloadingDocx(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Hero Banner & Download Bar */}
      <div 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(15, 23, 42, 0.85))', 
          border: '1px solid rgba(59, 130, 246, 0.4)',
          padding: '1.75rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Sparkles size={14} /> Official SME360 AI Business Plan
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
              Your Business Plan is Ready
            </h2>

            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', marginTop: '0.35rem', maxWidth: '650px', lineHeight: '1.5' }}>
              Download your complete, colorful professional business plan tailored to your operational inputs, feasibility analysis, SHAP drivers, and TOPSIS strategy rankings.
            </p>
          </div>

          {/* Download Action Buttons */}
          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <button 
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.4rem', fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)' }}
            >
              {downloadingPdf ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Download PDF Plan</span>
                </>
              )}
            </button>

            <button 
              onClick={handleDownloadDocx}
              disabled={downloadingDocx}
              className="btn btn-secondary"
              style={{ padding: '0.85rem 1.4rem', fontSize: '0.9rem', background: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
            >
              {downloadingDocx ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Preparing Word...</span>
                </>
              ) : (
                <>
                  <FileText size={18} style={{ color: '#60a5fa' }} />
                  <span>Download Word (.docx)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* In-App Visual Document Preview Card */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        
        {/* Document Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Logo variant="compact" height={36} />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                {profile.business_input?.business_category || 'SME'} Business Plan
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Stage: {profile.business_input?.business_stage || 'Startup'} | Location: {profile.business_input?.district} District
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 700, background: 'rgba(59, 130, 246, 0.15)', padding: '0.35rem 0.85rem', borderRadius: '20px' }}>
            AI-Assisted Feasibility & Growth Plan
          </div>
        </div>

        {/* 5-Section Interactive Plan Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Section 1: Executive Overview */}
          <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={16} />
              1. Business Concept & Feasibility Summary
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: '1.6' }}>
              {executive_overview.business_summary}
            </p>
          </div>

          {/* Section 2: Operational & Resource Plan */}
          <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={16} />
              2. Operational & Resource Setup
            </h4>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <p>• {operational_plan.staffing_requirements}</p>
              <p>• {operational_plan.equipment_readiness}</p>
            </div>
          </div>

          {/* Section 3: Marketing & Customers */}
          <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={16} />
              3. Marketing & Customer Demand
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              • {marketing_plan.demand_score}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.35rem' }}>
              • Target Daily Customers: <strong style={{ color: '#ffffff' }}>{marketing_plan.target_daily_customers}</strong>
            </p>
          </div>

          {/* Section 4: Financial Planning */}
          <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign size={16} />
              4. Financial Planning
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              {financial_plan.counterfactual_guidance}
            </p>
          </div>

          {/* Section 5: Time-Phased Action Roadmap */}
          <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(234, 179, 8, 0.4)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fde047', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} />
              5. Time-Phased Action Roadmap
            </h4>

            {/* Phase 1: 0-3 Months */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', background: 'rgba(234, 179, 8, 0.2)', padding: '0.25rem 0.65rem', borderRadius: '4px' }}>
                Phase 1: Immediate Launch (0 – 3 Months)
              </span>
              <ul style={{ fontSize: '0.825rem', color: '#cbd5e1', paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
              <ul style={{ fontSize: '0.825rem', color: '#cbd5e1', paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
              <ul style={{ fontSize: '0.825rem', color: '#cbd5e1', paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {action_roadmap.phase_3_growth_1_year_plus?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
