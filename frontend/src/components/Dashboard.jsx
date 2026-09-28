import React, { useEffect, useState } from 'react';
import { 
  PlusCircle, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Sparkles
} from 'lucide-react';
import { fetchAnalysisRecords } from '../services/api';

export default function Dashboard({ activeProfile, onStartNew, onViewMyBusinesses, onSelectRecord }) {
  const [recentRecords, setRecentRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);

  useEffect(() => {
    async function loadRecords() {
      try {
        const data = await fetchAnalysisRecords(5);
        setRecentRecords(data);
      } catch (err) {
        console.error('Failed to load recent analysis records:', err);
      } finally {
        setLoadingRecords(false);
      }
    }
    loadRecords();
  }, []);

  const getFeasibilityBadge = (label) => {
    if (label === 'Feasible') {
      return (
        <span className="badge-feasible" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
          <CheckCircle2 size={14} /> Feasible
        </span>
      );
    }
    if (label === 'Conditionally Feasible') {
      return (
        <span className="badge-conditionally" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
          <AlertTriangle size={14} /> Conditionally Feasible
        </span>
      );
    }
    return (
      <span className="badge-infeasible" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
        <XCircle size={14} /> Infeasible
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Welcome Hero Card */}
      <div 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(15, 23, 42, 0.8))', 
          border: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '1.75rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600, marginBottom: '0.5rem' }}>
              <Sparkles size={14} /> AI Decision Support Engine
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
              Welcome to SME360 AI
            </h2>
          </div>

          <div>
            <button 
              onClick={onStartNew}
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.6rem', fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}
            >
              <PlusCircle size={18} />
              <span>Start New Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Business Snapshot (If an analysis is currently loaded in active workspace) */}
      {activeProfile && (
        <div className="glass-card" style={{ border: '1px solid rgba(34, 197, 94, 0.3)', background: 'rgba(6, 78, 59, 0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 700, uppercase: 'uppercase', letterSpacing: '1px' }}>
                Active Business Analysis Workspace
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginTop: '0.25rem' }}>
                {activeProfile.business_input?.business_category || 'SME Enterprise'} ({activeProfile.business_input?.business_stage || 'Startup'} Stage)
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                Location: {activeProfile.business_input?.district} | Capital: LKR {Number(activeProfile.business_input?.available_capital_lkr || 0).toLocaleString()}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div>
                {getFeasibilityBadge(activeProfile.feasibility_analysis?.predicted_label)}
              </div>
              <button 
                onClick={() => onSelectRecord(activeProfile.metadata?.record_id, 'overview')} 
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
              >
                <span>Open Workspace</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Business Analyses Section */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} style={{ color: '#60a5fa' }} />
              Recent Business Analyses
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Recently analyzed SME business profiles.
            </p>
          </div>

          {recentRecords.length > 0 && (
            <button onClick={onViewMyBusinesses} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
              View All ({recentRecords.length})
            </button>
          )}
        </div>

        {loadingRecords ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
            Loading saved business records...
          </div>
        ) : recentRecords.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '10px' }}>
            <Building2 size={36} style={{ color: '#64748b', marginBottom: '0.75rem' }} />
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 600 }}>No Business Analyses Yet</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
              Start your first SME business feasibility evaluation with our AI Assistant.
            </p>
            <button onClick={onStartNew} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
              <PlusCircle size={16} />
              Start First Analysis
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Stage</th>
                  <th>District</th>
                  <th>Feasibility Result</th>
                  <th>Capital (LKR)</th>
                  <th>Analyzed Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((rec) => (
                  <tr key={rec.id}>
                    <td style={{ fontWeight: 700, color: '#ffffff' }}>{rec.business_category}</td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: '#93c5fd', background: 'rgba(59, 130, 246, 0.15)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        {rec.business_stage}
                      </span>
                    </td>
                    <td>{rec.district}</td>
                    <td>{getFeasibilityBadge(rec.predicted_label)}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>LKR {Number(rec.available_capital_lkr).toLocaleString()}</td>
                    <td style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(rec.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => onSelectRecord(rec.id, 'overview')} 
                        className="btn btn-secondary"
                        style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem' }}
                      >
                        Open Workspace
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
