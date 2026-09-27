import React, { useState } from 'react';
import { Sliders, RefreshCw, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { analyzeBusiness } from '../services/api';

export default function WhatIfSimulator({ scenarioData, currentInput, onScenarioSuccess }) {
  if (!scenarioData) return null;

  const { what_if_simulations = [], counterfactual_boundary = {} } = scenarioData;

  // Interactive Scenario State
  const [customCapital, setCustomCapital] = useState(currentInput?.available_capital_lkr || 800000);
  const [customBudget, setCustomBudget] = useState(currentInput?.monthly_budget_lkr || 150000);
  const [customCustomers, setCustomCustomers] = useState(currentInput?.expected_customers_per_day || 45);
  const [customPrice, setCustomPrice] = useState(currentInput?.expected_price_lkr || 350);
  
  const [simulating, setSimulating] = useState(false);
  const [activeCustomResult, setActiveCustomResult] = useState(null);

  const handleRunCustomScenario = async () => {
    setSimulating(true);
    try {
      const modifiedInput = {
        ...currentInput,
        available_capital_lkr: parseFloat(customCapital),
        monthly_budget_lkr: parseFloat(customBudget),
        expected_customers_per_day: parseInt(customCustomers, 10),
        expected_price_lkr: parseFloat(customPrice),
      };
      
      const newResult = await analyzeBusiness(modifiedInput);
      setActiveCustomResult(newResult);
      if (onScenarioSuccess) onScenarioSuccess(newResult);
    } catch (err) {
      alert(`Scenario execution failed: ${err.message}`);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={20} style={{ color: '#60a5fa' }} />
          SME360 AI What-If Scenario Simulator
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem' }}>
          Evaluate how variations in financial capital, operating budget, and customer demand alter the feasibility outcome through the exact same trained model pipeline.
        </p>
      </div>

      {/* Pre-calculated What-If Simulations */}
      <div className="grid-2">
        {what_if_simulations.map((sim, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <span style={{ color: '#ffffff' }}>{sim.title}</span>
              <span style={{ 
                padding: '0.2rem 0.5rem', 
                borderRadius: '4px', 
                fontSize: '0.725rem', 
                fontFamily: 'monospace',
                background: sim.feasibility_probability_delta >= 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: sim.feasibility_probability_delta >= 0 ? '#4ade80' : '#fca5a5'
              }}>
                Delta: {(sim.feasibility_probability_delta * 100).toFixed(1)}%
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>{sim.impact_summary}</p>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              New Predicted Outcome: <strong style={{ color: '#60a5fa' }}>{sim.new_prediction}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Counterfactual Boundary Card */}
      {counterfactual_boundary && counterfactual_boundary.recommendation && (
        <div className="glass-card" style={{ border: '1px solid rgba(99, 102, 241, 0.4)', background: 'rgba(49, 46, 129, 0.25)' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', uppercase: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <ShieldAlert size={18} />
            Counterfactual Minimum Boundary Search
          </h4>
          <p style={{ fontSize: '0.825rem', color: '#e2e8f0', lineHeight: '1.6' }}>
            {counterfactual_boundary.recommendation}
          </p>
        </div>
      )}

      {/* Interactive What-If Simulator Panel */}
      <div className="glass-card" style={{ border: '1px solid rgba(59, 130, 246, 0.4)' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          <Sparkles size={18} style={{ color: '#60a5fa' }} />
          Interactive Live Scenario Builder
        </h4>

        <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
          
          <div className="form-group">
            <label className="form-label">
              Available Capital (LKR): <strong style={{ color: '#60a5fa' }}>LKR {Number(customCapital).toLocaleString()}</strong>
            </label>
            <input
              type="range"
              min="100000"
              max="3000000"
              step="50000"
              value={customCapital}
              onChange={(e) => setCustomCapital(e.target.value)}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Monthly Budget (LKR): <strong style={{ color: '#818cf8' }}>LKR {Number(customBudget).toLocaleString()}</strong>
            </label>
            <input
              type="range"
              min="50000"
              max="1000000"
              step="25000"
              value={customBudget}
              onChange={(e) => setCustomBudget(e.target.value)}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Expected Customers / Day: <strong style={{ color: '#c084fc' }}>{customCustomers} customers</strong>
            </label>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={customCustomers}
              onChange={(e) => setCustomCustomers(e.target.value)}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Expected Unit Price (LKR): <strong style={{ color: '#4ade80' }}>LKR {customPrice}</strong>
            </label>
            <input
              type="range"
              min="50"
              max="2500"
              step="25"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>
            * Runs modified scenario through trained Random Forest ML pipeline in real-time.
          </span>
          
          <button
            onClick={handleRunCustomScenario}
            disabled={simulating}
            className="btn btn-primary"
          >
            <RefreshCw size={16} className={simulating ? 'spin' : ''} />
            <span>{simulating ? 'Simulating...' : 'Re-run Model Scenario'}</span>
          </button>
        </div>

        {/* Dynamic Scenario Result Display */}
        {activeCustomResult && (
          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '10px', background: '#050811', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
            <h5 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
              Scenario Result Comparison
            </h5>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
              <div>
                Original Prediction: <strong style={{ color: '#cbd5e1' }}>{currentInput?.predicted_label || 'Base'}</strong>
              </div>
              <ArrowRight size={16} style={{ color: '#64748b' }} />
              <div>
                Scenario Prediction: <strong style={{ color: '#4ade80' }}>{activeCustomResult.feasibility_analysis?.predicted_label}</strong>
              </div>
              <div style={{ marginLeft: 'auto', color: '#94a3b8' }}>
                Confidence: <strong style={{ color: '#ffffff' }}>{(activeCustomResult.feasibility_analysis?.confidence_score * 100).toFixed(1)}%</strong>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
