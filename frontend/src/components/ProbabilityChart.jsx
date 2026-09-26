import React from 'react';

export default function ProbabilityChart({ probabilities }) {
  if (!probabilities) return null;

  const getFillClass = (cls) => {
    if (cls === 'Feasible') return 'fill-feasible';
    if (cls === 'Conditionally Feasible') return 'fill-conditional';
    return 'fill-infeasible';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {Object.entries(probabilities).map(([cls, prob]) => {
        const pct = (prob * 100).toFixed(1);
        return (
          <div key={cls} className="progress-container">
            <div className="progress-header">
              <span style={{ color: '#cbd5e1' }}>{cls}</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>{pct}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className={`progress-bar-fill ${getFillClass(cls)}`}
                style={{ width: `${pct}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
