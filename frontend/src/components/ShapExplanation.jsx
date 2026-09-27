import React, { useState } from 'react';
import { TrendingUp, AlertOctagon, HelpCircle, ChevronDown, ChevronUp, Cpu } from 'lucide-react';

export default function ShapExplanation({ shapData }) {
  const [showTechnical, setShowTechnical] = useState(false);

  if (!shapData) return null;

  const { positive_drivers = [], negative_drivers = [] } = shapData;

  // Helper to convert feature technical identifiers into clean human business labels
  const formatFeatureLabel = (featureStr) => {
    if (!featureStr) return 'Business Factor';
    return featureStr
      .replace(/_/g, ' ')
      .replace(/\blkr\b/i, '(LKR)')
      .replace(/\bper day\b/i, '/ Day')
      .replace(/\bcount\b/i, 'Count')
      .replace(/\bscore\b/i, 'Index')
      .replace(/\b(\w)/g, (c) => c.toUpperCase());
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={22} style={{ color: '#60a5fa' }} />
          Key Insights — What Is Influencing Your Business Feasibility?
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem', lineHeight: '1.5' }}>
          Our AI model analyzes your operational, financial, and market inputs to identify the primary drivers strengthening your feasibility outcome as well as key risk hurdles requiring strategic attention.
        </p>
      </div>

      <div className="grid-2">
        
        {/* Supporting Factors */}
        <div style={{ background: 'rgba(6, 78, 59, 0.2)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <TrendingUp size={18} />
            Top Supporting Business Factors (+)
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {positive_drivers.map((driver, idx) => (
              <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.85)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span style={{ color: '#ffffff' }}>{formatFeatureLabel(driver.feature)}</span>
                  <span style={{ color: '#4ade80', fontWeight: 700, background: 'rgba(34, 197, 94, 0.15)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                    Strong Positive Impact
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                  Recorded Value: <strong style={{ color: '#cbd5e1' }}>{driver.feature_value ?? 'N/A'}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Areas Needing Mitigation */}
        <div style={{ background: 'rgba(127, 29, 29, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <AlertOctagon size={18} />
            Areas Needing Mitigation (-)
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {negative_drivers.map((driver, idx) => (
              <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.85)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span style={{ color: '#ffffff' }}>{formatFeatureLabel(driver.feature)}</span>
                  <span style={{ color: '#fca5a5', fontWeight: 700, background: 'rgba(239, 68, 68, 0.15)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                    Risk Hurdle
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                  Recorded Value: <strong style={{ color: '#cbd5e1' }}>{driver.feature_value ?? 'N/A'}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Optional Academic / Technical Transparency Accordion */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        <button 
          onClick={() => setShowTechnical(!showTechnical)}
          style={{ 
            background: 'rgba(30, 41, 59, 0.5)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '8px', 
            padding: '0.6rem 1rem', 
            color: '#94a3b8', 
            fontSize: '0.8rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            width: '100%',
            cursor: 'pointer'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={16} style={{ color: '#60a5fa' }} />
            Academic & Research Technical Explanation (SHAP TreeExplainer Attribution Vector)
          </span>
          {showTechnical ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showTechnical && (
          <div style={{ marginTop: '0.75rem', padding: '1rem', background: '#0f172a', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)', fontSize: '0.8rem' }}>
            <div style={{ color: '#60a5fa', fontWeight: 700, marginBottom: '0.5rem' }}>
              Methodology & Mathematical Attribution Summary
            </div>
            <p style={{ color: '#cbd5e1', lineHeight: '1.5', marginBottom: '0.75rem' }}>
              SHAP (SHapley Additive exPlanations) uses game-theoretic Shapley values to compute the marginal contribution of each operational feature vector against the base value of the trained Random Forest classifier.
            </p>
            
            <div className="grid-2" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
              <div>
                <div style={{ color: '#4ade80', fontWeight: 700 }}>Positive SHAP Values:</div>
                {positive_drivers.map((d, i) => (
                  <div key={i} style={{ color: '#94a3b8' }}>{d.feature}: +{(typeof d.impact_score === 'number' ? d.impact_score : parseFloat(d.impact_score)).toFixed(4)}</div>
                ))}
              </div>

              <div>
                <div style={{ color: '#fca5a5', fontWeight: 700 }}>Negative SHAP Values:</div>
                {negative_drivers.map((d, i) => (
                  <div key={i} style={{ color: '#94a3b8' }}>{d.feature}: {(typeof d.impact_score === 'number' ? d.impact_score : parseFloat(d.impact_score)).toFixed(4)}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
