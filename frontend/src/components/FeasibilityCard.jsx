import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Award } from 'lucide-react';
import ProbabilityChart from './ProbabilityChart';

export default function FeasibilityCard({ feasibilityData, executiveSummary }) {
  if (!feasibilityData) return null;

  const { predicted_label, confidence_score, probabilities } = feasibilityData;

  const getBadgeClass = (label) => {
    if (label === 'Feasible') return 'badge-feasible';
    if (label === 'Conditionally Feasible') return 'badge-conditionally';
    return 'badge-infeasible';
  };

  const getBadgeIcon = (label) => {
    if (label === 'Feasible') return <CheckCircle2 size={22} style={{ color: '#4ade80' }} />;
    if (label === 'Conditionally Feasible') return <AlertTriangle size={22} style={{ color: '#fde047' }} />;
    return <XCircle size={22} style={{ color: '#fca5a5' }} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="grid-2">
        
        {/* Result Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.85rem' }}>
            SME360 AI Predicted Feasibility Outcome
          </div>
          
          <div className={getBadgeClass(predicted_label)} style={{ marginBottom: '1.25rem' }}>
            {getBadgeIcon(predicted_label)}
            <span>{predicted_label}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
            <Award size={18} style={{ color: '#60a5fa' }} />
            <span>SME360 AI Model Confidence:</span>
            <strong style={{ color: '#ffffff', fontSize: '1rem' }}>
              {(confidence_score * 100).toFixed(1)}%
            </strong>
          </div>
        </div>

        {/* Probability Distribution Chart Card */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
            Class Probability Distribution
          </h3>
          <ProbabilityChart probabilities={probabilities} />
        </div>
      </div>

      {/* Executive Summary */}
      {executiveSummary && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.5rem' }}>
            Executive Feasibility Summary
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            {executiveSummary}
          </p>
        </div>
      )}
    </div>
  );
}
