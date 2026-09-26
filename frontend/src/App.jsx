import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BusinessForm from './components/BusinessForm';
import FeasibilityCard from './components/FeasibilityCard';
import ShapExplanation from './components/ShapExplanation';
import TopsisTable from './components/TopsisTable';
import StrategyCard from './components/StrategyCard';
import WhatIfSimulator from './components/WhatIfSimulator';
import BusinessPlan from './components/BusinessPlan';
import ProfileViewer from './components/ProfileViewer';
import { analyzeBusiness } from './services/api';
import { Lightbulb } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('input');
  const [loading, setLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState(null);
  const [structuredProfile, setStructuredProfile] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      setCurrentInput(formData);
      const profileResult = await analyzeBusiness(formData);
      setStructuredProfile(profileResult);
      setActiveTab('dashboard');
    } catch (err) {
      alert(`Error running AI Business Analysis: ${err.message}`);
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
    downloadAnchor.setAttribute('download', `sme_structured_profile_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="app-container">
      {/* Header Navbar */}
      <Navbar currentProfile={structuredProfile} onExportJson={handleExportJson} />

      {/* Main Layout with Sidebar + Workspace */}
      <div className="main-layout">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasResults={Boolean(structuredProfile)}
        />

        {/* Content Viewport */}
        <main className="content-viewport">
          
          {/* 1. Business Input Form Tab */}
          {activeTab === 'input' && (
            <BusinessForm onSubmit={handleFormSubmit} loading={loading} />
          )}

          {/* 2. Feasibility Dashboard Tab */}
          {activeTab === 'dashboard' && structuredProfile && (
            <FeasibilityCard
              feasibilityData={structuredProfile.feasibility_analysis}
              executiveSummary={structuredProfile.personalized_business_plan?.executive_overview?.business_summary}
            />
          )}

          {/* 3. SHAP Explanation Drivers Tab */}
          {activeTab === 'shap' && structuredProfile && (
            <ShapExplanation shapData={structuredProfile.explainability} />
          )}

          {/* 4. Strategy Recommendations Tab */}
          {activeTab === 'strategies' && structuredProfile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lightbulb size={20} style={{ color: '#60a5fa' }} />
                Multi-Objective Candidate SME Strategies
              </h3>
              <div>
                {structuredProfile.strategic_recommendations?.candidate_strategies?.map((strat, idx) => (
                  <StrategyCard key={idx} strategy={strat} rank={idx + 1} />
                ))}
              </div>
            </div>
          )}

          {/* 5. TOPSIS Multi-Criteria Ranking Tab */}
          {activeTab === 'topsis' && structuredProfile && (
            <TopsisTable topsisRanking={structuredProfile.strategic_recommendations?.topsis_ranking} />
          )}

          {/* 6. What-If Scenario Analysis Tab */}
          {activeTab === 'whatif' && structuredProfile && (
            <WhatIfSimulator
              scenarioData={structuredProfile.scenario_analysis}
              currentInput={currentInput}
              onScenarioSuccess={handleScenarioSuccess}
            />
          )}

          {/* 7. Personalized Business Plan Tab */}
          {activeTab === 'plan' && structuredProfile && (
            <BusinessPlan planData={structuredProfile.personalized_business_plan} />
          )}

          {/* 8. Structured Profile JSON Tab */}
          {activeTab === 'json' && structuredProfile && (
            <ProfileViewer profile={structuredProfile} onExportJson={handleExportJson} />
          )}

        </main>
      </div>
    </div>
  );
}
