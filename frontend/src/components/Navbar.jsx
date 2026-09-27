import React, { useEffect, useState } from 'react';
import { checkHealth } from '../services/api';
import { Download } from 'lucide-react';
import Logo from './Logo';

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
        <Logo variant="header" height={42} />
        <div className="brand-title-group">
          <h1>
            SME360 AI
            <span className="tag-component">Feasibility & Growth Engine</span>
          </h1>
          <div className="brand-subtitle">
            AI-Driven SME Business Lifecycle Decision Support System
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
