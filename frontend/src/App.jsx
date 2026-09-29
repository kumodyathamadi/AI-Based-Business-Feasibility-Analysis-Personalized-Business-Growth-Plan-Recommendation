import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Breadcrumbs from './components/Breadcrumbs';
import Dashboard from './components/Dashboard';
import MyBusinesses from './components/MyBusinesses';
import BusinessOverview from './components/BusinessOverview';
import AiIntakeAssistant from './components/AiIntakeAssistant';
import BusinessForm from './components/BusinessForm';
import FeasibilityCard from './components/FeasibilityCard';
import ShapExplanation from './components/ShapExplanation';
import TopsisTable from './components/TopsisTable';
import StrategyCard from './components/StrategyCard';
import WhatIfSimulator from './components/WhatIfSimulator';
import BusinessPlan from './components/BusinessPlan';
import ProfileViewer from './components/ProfileViewer';
import { analyzeBusiness, fetchAnalysisRecordById } from './services/api';
import { Lightbulb, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [intakeMode, setIntakeMode] = useState('ai_assistant'); // 'ai_assistant' or 'manual_form'
  const [loading, setLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState(null);
  const [structuredProfile, setStructuredProfile] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      setCurrentInput(formData);
      const profileResult = await analyzeBusiness(formData);
      setStructuredProfile(profileResult);
      setActiveTab('overview');
    } catch (err) {
      alert(`Error running AI Business Analysis: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecordById = async (recordId, targetTab = 'overview') => {
    setLoading(true);
    try {
      const recordData = await fetchAnalysisRecordById(recordId);
      setStructuredProfile(recordData);
      setCurrentInput(recordData.business_input);
      setActiveTab(targetTab);
    } catch (err) {
      alert(`Could not load record ${recordId}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioSuccess = (updatedProfile) => {
    setStructuredProfile(updatedProfile);
  };

  const handleExportJson = () => {
    if (!structuredProfile) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(structuredProfile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sme360_ai_profile_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="app-container">
      {/* Top Navbar Header */}
      <Navbar currentProfile={structuredProfile} onExportJson={handleExportJson} />

      {/* Main SaaS Layout with Sidebar + Workspace */}
      <div className="main-layout">

        {/* Left Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeProfile={structuredProfile}
        />

        {/* Primary Content Viewport */}
        <main className="content-viewport">

          {/* Top Breadcrumb Navigation */}
          <Breadcrumbs
            activeTab={activeTab}
            activeProfile={structuredProfile}
            onNavigate={setActiveTab}
          />

          {/* 1. Dashboard View */}
          {activeTab === 'dashboard' && (
            <Dashboard
              activeProfile={structuredProfile}
              onStartNew={() => setActiveTab('new_analysis')}
              onViewMyBusinesses={() => setActiveTab('my_businesses')}
              onSelectRecord={handleSelectRecordById}
            />
          )}

          {/* 2. My Businesses View */}
          {activeTab === 'my_businesses' && (
            <MyBusinesses
              onSelectRecord={handleSelectRecordById}
              onStartNew={() => setActiveTab('new_analysis')}
            />
          )}

          {/* 3. New Analysis View (AI Assistant or Manual Entry) */}
          {activeTab === 'new_analysis' && (
            <div>
              {intakeMode === 'ai_assistant' ? (
                <AiIntakeAssistant
                  onCompleteIntake={handleFormSubmit}
                  onSwitchToManual={() => setIntakeMode('manual_form')}
                />
              ) : (
                <BusinessForm
                  onSubmit={handleFormSubmit}
                  loading={loading}
                  onSwitchToAi={() => setIntakeMode('ai_assistant')}
                />
              )}
            </div>
          )}

          {/* 4. Active Business Workspace Tabs */}

          {/* Business Overview */}
          {activeTab === 'overview' && structuredProfile && (
            <BusinessOverview
              profile={structuredProfile}
              onNavigate={setActiveTab}
            />
          )}

          {/* Feasibility Assessment */}
          {activeTab === 'feasibility' && structuredProfile && (
            <FeasibilityCard
              feasibilityData={structuredProfile.feasibility_analysis}
              executiveSummary={structuredProfile.personalized_business_plan?.executive_overview?.business_summary}
            />
          )}

          {/* Key Insights (SHAP Drivers) */}
          {activeTab === 'insights' && structuredProfile && (
            <ShapExplanation shapData={structuredProfile.explainability} />
          )}

          {/* Recommendations */}
          {activeTab === 'recommendations' && structuredProfile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={22} style={{ color: '#c084fc' }} />
                  Strategic Recommendations & Actions
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Contextual strategic directions generated to improve business feasibility and capital efficiency.
                </p>
              </div>

              <div>
                {structuredProfile.strategic_recommendations?.candidate_strategies?.map((strat, idx) => (
                  <StrategyCard key={idx} strategy={strat} rank={idx + 1} />
                ))}
              </div>
            </div>
          )}

          {/* Explore Options (TOPSIS Decision Ranking) */}
          {activeTab === 'options' && structuredProfile && (
            <TopsisTable topsisRanking={structuredProfile.strategic_recommendations?.topsis_ranking} />
          )}

          {/* Scenario Explorer (What-If Analysis) */}
          {activeTab === 'scenario' && structuredProfile && (
            <WhatIfSimulator
              scenarioData={structuredProfile.scenario_analysis}
              currentInput={currentInput}
              onScenarioSuccess={handleScenarioSuccess}
            />
          )}

          {/* Business Plan */}
          {activeTab === 'plan' && structuredProfile && (
            <BusinessPlan profile={structuredProfile} />
          )}

          {/* Business Profile */}
          {activeTab === 'profile' && structuredProfile && (
            <ProfileViewer profile={structuredProfile} onExportJson={handleExportJson} />
          )}

        </main>
      </div>

      {/* Product Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1rem 2rem', textAlign: 'center', fontSize: '0.75rem', color: '#64748b', background: 'rgba(9, 13, 22, 0.95)' }}>
        <strong style={{ color: '#94a3b8' }}>SME360 AI</strong> - Smarter Decisions • Stronger SMEs | AI-Driven SME Business Lifecycle Decision Support System
      </footer>
    </div>
  );
}
