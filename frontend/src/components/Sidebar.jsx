import React from 'react';
import { 
  FileEdit, 
  LayoutDashboard, 
  HelpCircle, 
  Lightbulb, 
  SlidersHorizontal, 
  TrendingUp, 
  FileText, 
  Code 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, hasResults }) {
  const navItems = [
    { id: 'input', label: '1. Business Input Form', icon: FileEdit, enabled: true },
    { id: 'dashboard', label: '2. Feasibility Dashboard', icon: LayoutDashboard, enabled: hasResults },
    { id: 'shap', label: '3. Why? (SHAP Drivers)', icon: HelpCircle, enabled: hasResults },
    { id: 'strategies', label: '4. Strategy Recommendations', icon: Lightbulb, enabled: hasResults },
    { id: 'topsis', label: '5. TOPSIS Strategy Ranking', icon: TrendingUp, enabled: hasResults },
    { id: 'whatif', label: '6. What-If Analysis', icon: SlidersHorizontal, enabled: hasResults },
    { id: 'plan', label: '7. Personalized Business Plan', icon: FileText, enabled: hasResults },
    { id: 'json', label: '8. Structured Profile JSON', icon: Code, enabled: hasResults },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-heading">
        Research Pipeline Stages
      </div>
      <nav className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDisabled = !item.enabled;

          return (
            <button
              key={item.id}
              disabled={isDisabled}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} style={{ color: isActive ? '#60a5fa' : '#94a3b8' }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {!hasResults && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(30, 58, 138, 0.3)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', fontSize: '0.75rem', color: '#93c5fd' }}>
          💡 Fill out and submit the Business Form to unlock all 7 analytical decision support modules.
        </div>
      )}
    </aside>
  );
}
