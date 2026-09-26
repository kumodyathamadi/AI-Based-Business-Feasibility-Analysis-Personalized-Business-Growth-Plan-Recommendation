import React from 'react';

export default function StrategyCard({ strategy, rank }) {
  if (!strategy) return null;

  const isTopRanked = rank === 1;

  return (
    <div 
      className="glass-card" 
      style={{ 
        border: isTopRanked ? '1px solid rgba(59, 130, 246, 0.6)' : '1px solid var(--border-color)',
        background: isTopRanked ? 'rgba(30, 58, 138, 0.25)' : 'rgba(30, 41, 59, 0.65)',
        boxShadow: isTopRanked ? '0 8px 32px rgba(59, 130, 246, 0.15)' : '0 8px 32px rgba(0, 0, 0, 0.3)',
        marginBottom: '1rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '8px', 
            background: isTopRanked ? '#2563eb' : '#334155', 
            color: '#ffffff', 
            fontWeight: 800, 
            fontSize: '0.9rem',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            #{rank}
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{strategy.strategy_name}</h4>
            <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600 }}>{strategy.strategic_focus}</span>
          </div>
        </div>
        <span style={{ fontSize: '0.8rem', background: '#0f172a', color: '#60a5fa', padding: '0.35rem 0.85rem', borderRadius: '20px', fontFamily: 'monospace', fontWeight: 700, border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          TOPSIS Score: {strategy.topsis_score}
        </span>
      </div>

      <p style={{ fontSize: '0.825rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
        {strategy.operational_approach}
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: '#94a3b8' }}>
        <div>
          <span>Est. Capital Required: </span>
          <strong style={{ color: '#ffffff' }}>LKR {strategy.estimated_capital_required_lkr?.toLocaleString()}</strong>
        </div>
        <div>
          <span>Monthly Budget: </span>
          <strong style={{ color: '#ffffff' }}>LKR {strategy.estimated_monthly_budget_lkr?.toLocaleString()}</strong>
        </div>
        <div>
          <span>Expected Impact: </span>
          <strong style={{ color: '#4ade80' }}>{strategy.expected_feasibility_impact}</strong>
        </div>
      </div>
    </div>
  );
}
