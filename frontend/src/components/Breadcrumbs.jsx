import React from 'react';
import { ChevronRight, Home, Building2 } from 'lucide-react';

export default function Breadcrumbs({ activeTab, activeProfile, onNavigate }) {
  const getTabLabel = (tab) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'my_businesses': return 'My Businesses';
      case 'new_analysis': return 'New Analysis';
      case 'overview': return 'Business Overview';
      case 'feasibility': return 'Feasibility Assessment';
      case 'insights': return 'Key Insights';
      case 'recommendations': return 'Recommendations';
      case 'options': return 'Explore Options';
      case 'scenario': return 'Scenario Explorer';
      case 'plan': return 'Business Plan';
      case 'profile': return 'Business Profile';
      default: return 'Overview';
    }
  };

  const isWorkspaceTab = [
    'overview', 'feasibility', 'insights', 'recommendations', 'options', 'scenario', 'plan', 'profile'
  ].includes(activeTab);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.25rem', userSelect: 'none' }}>
      <button 
        onClick={() => onNavigate('dashboard')}
        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
      >
        <Home size={14} />
        <span>SME360 AI</span>
      </button>

      {isWorkspaceTab && activeProfile && (
        <>
          <ChevronRight size={14} style={{ color: '#64748b' }} />
          <button 
            onClick={() => onNavigate('my_businesses')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Building2 size={14} />
            <span>My Businesses</span>
          </button>
          
          <ChevronRight size={14} style={{ color: '#64748b' }} />
          <span style={{ color: '#cbd5e1', fontWeight: 600 }}>
            {activeProfile.business_input?.business_category || 'Active Business'}
          </span>
        </>
      )}

      <ChevronRight size={14} style={{ color: '#64748b' }} />
      <span style={{ color: '#60a5fa', fontWeight: 600 }}>
        {getTabLabel(activeTab)}
      </span>
    </div>
  );
}
