import React, { useState } from 'react';
import { Award, Layers, BarChart2, Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import StrategyCard from './StrategyCard';

export default function TopsisTable({ topsisRanking }) {
  const [showTechnical, setShowTechnical] = useState(false);

  if (!topsisRanking) return null;

  const { ranked_strategies = [], top_recommended_strategy, top_topsis_score, evaluation_criteria = [] } = topsisRanking;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Page Title */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={22} style={{ color: '#60a5fa' }} />
          Explore & Compare Business Options
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem', lineHeight: '1.5' }}>
          Compare strategic business directions evaluated against multi-objective criteria including financial capital, operating budget, market demand, and execution feasibility.
        </p>
      </div>

      {/* Top Banner */}
      <div className="glass-card" style={{ border: '1px solid rgba(59, 130, 246, 0.4)', background: 'rgba(30, 58, 138, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#60a5fa' }}>
            <Award size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Top Recommended Strategic Direction</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginTop: '0.1rem' }}>{top_recommended_strategy}</h3>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Decision Support Score</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#60a5fa' }}>{top_topsis_score}</div>
        </div>
      </div>

      {/* Strategy Cards List */}
      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Layers size={18} style={{ color: '#60a5fa' }} />
          Evaluated Strategic Options (Ranked Order)
        </h4>

        {ranked_strategies.map((strat, idx) => (
          <StrategyCard key={idx} strategy={strat} rank={strat.rank || idx + 1} />
        ))}
      </div>

      {/* Decision Criteria Breakdown */}
      {evaluation_criteria && evaluation_criteria.length > 0 && (
        <div className="glass-card">
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <BarChart2 size={18} style={{ color: '#c084fc' }} />
            Decision Matrix Evaluation Criteria & Weights
          </h4>
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Criterion</th>
                  <th>Attribute Type</th>
                  <th>Assigned Weight</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {evaluation_criteria.map((c, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: '#ffffff' }}>{c.criterion}</td>
                    <td>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '4px', 
                        fontSize: '0.725rem', 
                        fontWeight: 700,
                        background: c.type === 'Benefit' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: c.type === 'Benefit' ? '#4ade80' : '#fca5a5'
                      }}>
                        {c.type}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#60a5fa' }}>{(c.weight * 100).toFixed(0)}%</td>
                    <td style={{ color: '#94a3b8' }}>{c.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Optional Academic / Research Technical Accordion */}
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
            <Cpu size={16} style={{ color: '#c084fc' }} />
            Academic & Research Technical Explanation (TOPSIS Vector Normalization & Relative Closeness C<sub>i</sub>*)
          </span>
          {showTechnical ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showTechnical && (
          <div style={{ marginTop: '0.75rem', padding: '1rem', background: '#0f172a', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.3)', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            <div style={{ color: '#c084fc', fontWeight: 700, marginBottom: '0.5rem' }}>
              TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)
            </div>
            <p>
              The TOPSIS decision engine calculates normalized decision matrix vectors weighted by multi-objective weights (Wj). Relative closeness scores (Ci*) measure Euclidean distances to positive-ideal (S+) and negative-ideal (S-) solution vectors.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
