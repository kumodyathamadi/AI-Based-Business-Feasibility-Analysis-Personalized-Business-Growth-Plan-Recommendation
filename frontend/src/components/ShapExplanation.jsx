import React from 'react';
import { TrendingUp, AlertOctagon, HelpCircle } from 'lucide-react';

export default function ShapExplanation({ shapData }) {
  if (!shapData) return null;

  const { positive_drivers = [], negative_drivers = [] } = shapData;

  return (
    <div className="glass-card">
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={20} style={{ color: '#60a5fa' }} />
          Why Did the Model Predict This Feasibility Outcome?
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem' }}>
          SHAP (SHapley Additive exPlanations) values decompose the Random Forest model's decision into individual feature enablers and hurdles.
        </p>
      </div>

      <div className="grid-2">
        
        {/* Top Positive Enablers */}
        <div style={{ background: 'rgba(6, 78, 59, 0.2)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <TrendingUp size={18} />
            Top Positive Enablers (+)
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {positive_drivers.map((driver, idx) => (
              <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span style={{ color: '#f8fafc' }}>+ {driver.feature}</span>
                  <span style={{ color: '#4ade80', fontWeight: 700 }}>
                    +{typeof driver.impact_score === 'number' ? driver.impact_score.toFixed(4) : driver.impact_score}
                  </span>
                </div>
                <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Feature Value: <strong style={{ color: '#cbd5e1' }}>{driver.feature_value ?? 'N/A'}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Negative Risk Hurdles */}
        <div style={{ background: 'rgba(127, 29, 29, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <AlertOctagon size={18} />
            Top Risk Hurdles (-)
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {negative_drivers.map((driver, idx) => (
              <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span style={{ color: '#f8fafc' }}>- {driver.feature}</span>
                  <span style={{ color: '#fca5a5', fontWeight: 700 }}>
                    {typeof driver.impact_score === 'number' ? driver.impact_score.toFixed(4) : driver.impact_score}
                  </span>
                </div>
                <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Feature Value: <strong style={{ color: '#cbd5e1' }}>{driver.feature_value ?? 'N/A'}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
