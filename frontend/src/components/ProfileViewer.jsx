import React, { useState } from 'react';
import { UserCheck, Copy, Download, Check, Code, ChevronDown, ChevronUp, Building, DollarSign, Users, MapPin } from 'lucide-react';

export default function ProfileViewer({ profile, onExportJson }) {
  const [showRawJson, setShowRawJson] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!profile) return null;

  const { business_input = {}, metadata = {} } = profile;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(profile, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCheck size={22} style={{ color: '#60a5fa' }} />
            Business Profile & Verified Record
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Record ID: <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>{metadata.record_id || 'N/A'}</span> | Schema Version: <span style={{ color: '#60a5fa', fontFamily: 'monospace', fontWeight: 700 }}>{metadata.schema_version || '1.0.0'}</span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={handleCopy} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }}>
            {copied ? <Check size={14} style={{ color: '#4ade80' }} /> : <Copy size={14} />}
            {copied ? 'Copied Profile' : 'Copy Data'}
          </button>

          <button onClick={onExportJson} className="btn btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }}>
            <Download size={14} />
            Export JSON
          </button>
        </div>
      </div>

      {/* Structured Info Cards Grid */}
      <div className="grid-2">
        
        {/* Card 1: Business Overview */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={16} />
            Business Information
          </h4>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>Business Category: <strong style={{ color: '#fff' }}>{business_input.business_category}</strong></div>
            <div>Business Stage: <strong style={{ color: '#fff' }}>{business_input.business_stage}</strong></div>
            <div>District Location: <strong style={{ color: '#fff' }}>{business_input.district}</strong></div>
            <div>Business Ownership: <strong style={{ color: '#fff' }}>Sole Proprietorship / SME</strong></div>
          </div>
        </div>

        {/* Card 2: Financial Information */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4ade80', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={16} />
            Financial Parameters
          </h4>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>Available Capital: <strong style={{ color: '#4ade80' }}>LKR {Number(business_input.available_capital_lkr || 0).toLocaleString()}</strong></div>
            <div>Monthly Operating Budget: <strong style={{ color: '#fff' }}>LKR {Number(business_input.monthly_budget_lkr || 0).toLocaleString()}</strong></div>
            <div>Target Unit Price: <strong style={{ color: '#fff' }}>LKR {business_input.expected_price_lkr}</strong></div>
            <div>External Debt/Loan: <strong style={{ color: '#fff' }}>{business_input.has_existing_loans ? 'Yes' : 'None'}</strong></div>
          </div>
        </div>

        {/* Card 3: Market Parameters */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} />
            Market & Location Information
          </h4>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>Expected Customers/Day: <strong style={{ color: '#fff' }}>{business_input.expected_customers_per_day}</strong></div>
            <div>Competition Level: <strong style={{ color: '#fff' }}>{business_input.competition_level}</strong></div>
            <div>Commercial Location: <strong style={{ color: '#fff' }}>{business_input.district} Focus Zone</strong></div>
            <div>Target Demographics: <strong style={{ color: '#fff' }}>Local District Consumers</strong></div>
          </div>
        </div>

        {/* Card 4: Operational Readiness */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fde047', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} />
            Operational & Team Setup
          </h4>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>Entrepreneur Experience: <strong style={{ color: '#fff' }}>{business_input.entrepreneur_experience_years} Years</strong></div>
            <div>Available Staffing: <strong style={{ color: '#fff' }}>{business_input.available_staff_count || 1} Person(s)</strong></div>
            <div>Equipment Readiness: <strong style={{ color: '#fff' }}>{business_input.has_equipment ? 'Ready' : 'Pending Acquisition'}</strong></div>
            <div>Supplier Contracts: <strong style={{ color: '#fff' }}>{business_input.has_supplier_contacts ? 'Established' : 'Sourcing'}</strong></div>
          </div>
        </div>

      </div>

      {/* Developer / Academic Raw JSON Accordion */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        <button 
          onClick={() => setShowRawJson(!showRawJson)}
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
            <Code size={16} style={{ color: '#60a5fa' }} />
            Developer & Research Raw JSON Schema Data
          </span>
          {showRawJson ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showRawJson && (
          <div style={{ marginTop: '0.75rem' }}>
            <pre className="json-viewer">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
}
