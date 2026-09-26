import React, { useEffect, useState } from 'react';
import { checkHealth } from '../services/api';
import { Download, Sparkles } from 'lucide-react';

export default function Navbar({ currentProfile, onExportJson }) {
  const [apiStatus, setApiStatus] = useState({ online: false, loading: true });

  useEffect(() => {
    async function verifyHealth() {
      const data = await checkHealth();
      setApiStatus({
        online: data.status === 'healthy',
        modelLoaded: data.model_loaded,
        loading: false,
      });
    }
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="navbar">
      <div className="brand-section">
        <div className="brand-logo">
          <Sparkles size={22} />
        </div>
        <div className="brand-title-group">
          <h1>
            AI SME Business Feasibility Decision Support System
            <span className="tag-component">Component 1</span>
          </h1>
          <div className="brand-subtitle">
            Colombo District Focus — Sri Lanka Small & Medium Enterprises
          </div>
        </div>
      </div>

      <div className="navbar-actions">
        <div className="status-indicator">
          <span className={`status-dot ${apiStatus.online ? 'online' : 'offline'}`}></span>
          <span style={{ color: apiStatus.online ? '#4ade80' : '#fca5a5' }}>
            {apiStatus.loading ? 'Checking API...' : apiStatus.online ? 'Backend Connected' : 'API Offline (Start Backend Server)'}
          </span>
        </div>

        {currentProfile && (
          <button onClick={onExportJson} className="btn btn-primary">
            <Download size={16} />
            Export JSON Profile
          </button>
        )}
      </div>
    </header>
  );
}
