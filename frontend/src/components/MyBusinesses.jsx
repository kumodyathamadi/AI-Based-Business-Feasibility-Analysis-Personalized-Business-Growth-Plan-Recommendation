import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  Search, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  FileText, 
  Sliders, 
  MapPin, 
  DollarSign, 
  Calendar 
} from 'lucide-react';
import { fetchAnalysisRecords, fetchAnalysisRecordById } from '../services/api';

export default function MyBusinesses({ onSelectRecord, onStartNew }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('All');

  useEffect(() => {
    async function loadAllRecords() {
      try {
        const data = await fetchAnalysisRecords(50);
        setRecords(data);
      } catch (err) {
        console.error('Failed to load business records:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllRecords();
  }, []);

  const getBadgeIcon = (label) => {
    if (label === 'Feasible') return <CheckCircle2 size={16} style={{ color: '#4ade80' }} />;
    if (label === 'Conditionally Feasible') return <AlertTriangle size={16} style={{ color: '#fde047' }} />;
    return <XCircle size={16} style={{ color: '#fca5a5' }} />;
  };

  const getBadgeClass = (label) => {
    if (label === 'Feasible') return 'badge-feasible';
    if (label === 'Conditionally Feasible') return 'badge-conditionally';
    return 'badge-infeasible';
  };

  const filteredRecords = records.filter((rec) => {
    const matchesSearch = 
      rec.business_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.predicted_label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'All' || rec.business_stage === filterStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={24} style={{ color: '#60a5fa' }} />
            My Saved Businesses & Analysis History
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Manage, review, and track your SME business feasibility evaluations stored in PostgreSQL database.
          </p>
        </div>

        <button onClick={onStartNew} className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
          <PlusCircle size={16} />
          New Business Analysis
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by category, district, or result..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2.3rem', fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Filter Stage:</span>
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="form-control"
            style={{ width: 'auto', fontSize: '0.85rem', padding: '0.45rem 1rem' }}
          >
            <option value="All">All Stages</option>
            <option value="New Startup">New Startup</option>
            <option value="Existing Business">Existing Business</option>
          </select>
        </div>
      </div>

      {/* Loading & Empty States */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          Loading saved business profiles...
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Building2 size={40} style={{ color: '#64748b', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>No Matching Business Records Found</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            {searchTerm || filterStage !== 'All' ? 'Try adjusting your search or stage filters.' : 'Start your first business analysis to save records.'}
          </p>
          <button onClick={onStartNew} className="btn btn-primary" style={{ margin: '0 auto' }}>
            <PlusCircle size={16} />
            Start New Business Analysis
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {filteredRecords.map((rec) => (
            <div 
              key={rec.id} 
              className="glass-card"
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justify: 'space-between',
                gap: '1rem',
                border: '1px solid var(--border-color)',
                transition: 'transform 0.2s, border-color 0.2s',
                cursor: 'pointer'
              }}
              onClick={() => onSelectRecord(rec.id, 'overview')}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#60a5fa', fontWeight: 700 }}>
                      {rec.business_stage}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginTop: '0.1rem' }}>
                      {rec.business_category}
                    </h3>
                  </div>

                  <div className={getBadgeClass(rec.predicted_label)} style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
                    {getBadgeIcon(rec.predicted_label)}
                    <span>{rec.predicted_label}</span>
                  </div>
                </div>

                <div className="grid-2" style={{ fontSize: '0.8rem', color: '#cbd5e1', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.5)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} style={{ color: '#60a5fa' }} />
                    <span>Location: <strong>{rec.district}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <DollarSign size={14} style={{ color: '#4ade80' }} />
                    <span>Capital: <strong>LKR {Number(rec.available_capital_lkr).toLocaleString()}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} style={{ color: '#c084fc' }} />
                    <span>Analyzed: <strong>{new Date(rec.created_at).toLocaleDateString()}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sliders size={14} style={{ color: '#fde047' }} />
                    <span>Customers: <strong>{rec.expected_customers_per_day}/day</strong></span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Record ID: <code style={{ fontFamily: 'monospace' }}>{rec.id.substring(0, 8)}...</code>
                </span>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRecord(rec.id, 'overview');
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}
                >
                  <span>Open Workspace</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
