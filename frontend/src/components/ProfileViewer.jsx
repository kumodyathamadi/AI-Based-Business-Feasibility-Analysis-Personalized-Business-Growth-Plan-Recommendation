import React, { useState } from 'react';
import { Code, Copy, Download, Check } from 'lucide-react';

export default function ProfileViewer({ profile, onExportJson }) {
  if (!profile) return null;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(profile, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={20} style={{ color: '#60a5fa' }} />
            Standardized Machine-Readable Structured Business Profile
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Schema Version: <span style={{ color: '#60a5fa', fontFamily: 'monospace', fontWeight: 700 }}>{profile.metadata?.schema_version || '1.0.0'}</span> | Record ID: <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>{profile.metadata?.record_id || 'N/A'}</span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={handleCopy} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }}>
            {copied ? <Check size={14} style={{ color: '#4ade80' }} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>

          <button onClick={onExportJson} className="btn btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }}>
            <Download size={14} />
            Download File
          </button>
        </div>
      </div>

      <pre className="json-viewer">
        {JSON.stringify(profile, null, 2)}
      </pre>
    </div>
  );
}
