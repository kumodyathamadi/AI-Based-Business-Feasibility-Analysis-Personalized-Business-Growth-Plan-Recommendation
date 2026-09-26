const API_BASE_URL = "http://127.0.0.1:8000/api/business";

let currentStructuredProfile = null;

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initFormHandler();
  initExportHandlers();
  checkApiHealth();
});

// Check API Health
async function checkApiHealth() {
  const statusEl = document.getElementById("api-status");
  try {
    const res = await fetch("http://127.0.0.1:8000/api/health");
    if (res.ok) {
      const data = await res.json();
      statusEl.textContent = "API Connected";
      statusEl.parentElement.style.background = "rgba(34, 197, 94, 0.15)";
    } else {
      throw new Error("Health check failed");
    }
  } catch (err) {
    statusEl.textContent = "API Offline (Start Backend Server)";
    statusEl.parentElement.style.background = "rgba(239, 68, 68, 0.15)";
    statusEl.parentElement.style.color = "#fca5a5";
  }
}

// Tab Switching Handler
function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      
      btn.classList.add("active");
      const targetId = btn.getAttribute("data-tab");
      document.getElementById(targetId).classList.add("active");
    });
  });
}

// Form Submit Handler
function initFormHandler() {
  const form = document.getElementById("sme-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const payload = {};
    
    formData.forEach((value, key) => {
      if (["available_capital_lkr", "loan_amount_lkr", "monthly_budget_lkr", "initial_inventory_cost_lkr", "expected_price_lkr"].includes(key)) {
        payload[key] = parseFloat(value) || 0;
      } else if (["expected_customers_per_day", "customer_demand_score", "entrepreneur_experience_years", "available_staff_count"].includes(key)) {
        payload[key] = parseInt(value, 10) || 0;
      } else {
        payload[key] = value;
      }
    });

    // Mandatory default values for remaining schema fields
    payload.location_suitability_score = 4;
    payload.required_staff_count = payload.available_staff_count || 3;
    payload.available_equipment_score = 4;
    payload.required_equipment_score = 4;
    payload.supplier_availability_score = 5;
    payload.expected_operating_days_per_month = 26;

    // Show Loading Spinner
    document.getElementById("loading-spinner").style.display = "block";
    document.getElementById("section-results").style.display = "none";

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${await response.text()}`);
      }

      currentStructuredProfile = await response.json();
      renderResults(currentStructuredProfile);

      document.getElementById("section-results").style.display = "block";
      document.getElementById("btn-export-json").style.display = "inline-block";
      
      // Scroll to results
      document.getElementById("section-results").scrollIntoView({ behavior: "smooth" });

    } catch (err) {
      alert(`Error running business analysis: ${err.message}`);
    } finally {
      document.getElementById("loading-spinner").style.display = "none";
    }
  });
}

// Render Results Data to Dashboard Views
function renderResults(profile) {
  const feas = profile.feasibility_analysis;
  const shap = profile.explainability;
  const strat = profile.strategic_recommendations;
  const whatif = profile.scenario_analysis;
  const plan = profile.personalized_business_plan;

  // 1. Feasibility Badge & Probas
  const badgeEl = document.getElementById("res-badge");
  badgeEl.textContent = feas.predicted_label;
  if (feas.predicted_label === "Feasible") {
    badgeEl.className = "badge-feasible";
  } else if (feas.predicted_label === "Conditionally Feasible") {
    badgeEl.className = "badge-conditionally";
  } else {
    badgeEl.className = "badge-infeasible";
  }

  document.getElementById("res-confidence").textContent = `${(feas.confidence_score * 100).toFixed(1)}%`;

  // Render Probabilities
  const probContainer = document.getElementById("probabilities-container");
  probContainer.innerHTML = "";
  Object.entries(feas.probabilities).forEach(([cls, prob]) => {
    const pct = (prob * 100).toFixed(1);
    let fillClass = "fill-conditional";
    if (cls === "Feasible") fillClass = "fill-feasible";
    if (cls === "Infeasible") fillClass = "fill-infeasible";

    probContainer.innerHTML += `
      <div class="progress-container">
        <div class="progress-header">
          <span>${cls}</span>
          <span style="font-weight:700;">${pct}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill ${fillClass}" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  });

  document.getElementById("res-summary").textContent = plan.executive_overview.business_summary;

  // 2. SHAP Positive & Negative Drivers
  const posList = document.getElementById("positive-drivers-list");
  posList.innerHTML = shap.positive_drivers.map(d => `
    <div style="background: rgba(34, 197, 94, 0.1); border-left: 3px solid #22c55e; padding: 0.6rem 0.8rem; margin-bottom: 0.5rem; border-radius: 4px;">
      <div style="font-weight: 600; font-size: 0.9rem;">+ ${d.feature}</div>
      <div style="font-size: 0.75rem; color: var(--text-secondary);">SHAP Impact: +${d.impact_score}</div>
    </div>
  `).join("");

  const negList = document.getElementById("negative-drivers-list");
  negList.innerHTML = shap.negative_drivers.map(d => `
    <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 0.6rem 0.8rem; margin-bottom: 0.5rem; border-radius: 4px;">
      <div style="font-weight: 600; font-size: 0.9rem;">- ${d.feature}</div>
      <div style="font-size: 0.75rem; color: var(--text-secondary);">SHAP Impact: ${d.impact_score}</div>
    </div>
  `).join("");

  // 3. TOPSIS Ranked Strategies
  const stratList = document.getElementById("strategies-list");
  const rankedStrats = strat.topsis_ranking.ranked_strategies;
  stratList.innerHTML = rankedStrats.map(s => `
    <div class="strategy-card ${s.rank === 1 ? 'top-ranked' : ''}">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="rank-badge">${s.rank}</div>
          <h4 style="font-size: 1rem; font-weight: 700;">${s.strategy_name}</h4>
        </div>
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--accent-blue);">TOPSIS Score: ${s.topsis_score}</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">${s.operational_approach}</p>
      <div style="display: flex; gap: 1.5rem; font-size: 0.8rem; color: var(--text-muted);">
        <span>Est. Capital: <strong>LKR ${s.estimated_capital_required_lkr.toLocaleString()}</strong></span>
        <span>Monthly Budget: <strong>LKR ${s.estimated_monthly_budget_lkr.toLocaleString()}</strong></span>
        <span>Impact: <strong style="color: var(--accent-green);">${s.expected_feasibility_impact}</strong></span>
      </div>
    </div>
  `).join("");

  // 4. What-If Scenario Simulations
  const whatIfList = document.getElementById("whatif-list");
  whatIfList.innerHTML = whatif.what_if_simulations.map(w => `
    <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem;">
      <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 0.95rem; margin-bottom: 0.25rem;">
        <span>${w.title}</span>
        <span style="color: ${w.feasibility_probability_delta >= 0 ? '#4ade80' : '#fca5a5'};">${(w.feasibility_probability_delta * 100).toFixed(1)}%</span>
      </div>
      <div style="font-size: 0.85rem; color: var(--text-secondary);">${w.impact_summary}</div>
    </div>
  `).join("");

  document.getElementById("res-counterfactual").textContent = whatif.counterfactual_boundary.recommendation;

  // 5. Personalized Plan Sections
  const planContainer = document.getElementById("plan-sections-container");
  planContainer.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h4 style="color: var(--accent-blue); font-size: 1rem; margin-bottom: 0.5rem;">1. Business Overview</h4>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">${plan.executive_overview.business_summary}</p>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="color: var(--accent-indigo); font-size: 1rem; margin-bottom: 0.5rem;">2. Operational & Resource Setup</h4>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">${plan.operational_plan.staffing_requirements}</p>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">${plan.operational_plan.equipment_readiness}</p>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="color: var(--accent-purple); font-size: 1rem; margin-bottom: 0.5rem;">3. Marketing & Customer Demand</h4>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">${plan.marketing_plan.demand_score} | Target Daily Customers: ${plan.marketing_plan.target_daily_customers}</p>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="color: var(--accent-green); font-size: 1rem; margin-bottom: 0.5rem;">4. Financial Planning</h4>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">${plan.financial_plan.counterfactual_guidance}</p>
    </div>

    <div>
      <h4 style="color: var(--accent-yellow); font-size: 1rem; margin-bottom: 0.5rem;">5. Time-Phased Action Roadmap (Phase 1: 0 to 3 Months)</h4>
      <ul style="padding-left: 1.25rem; font-size: 0.9rem; color: var(--text-secondary);">
        ${plan.action_roadmap.phase_1_immediate_0_to_3_months.map(item => `<li style="margin-bottom: 0.3rem;">${item}</li>`).join("")}
      </ul>
    </div>
  `;

  // 6. JSON Viewer
  document.getElementById("json-viewer").textContent = JSON.stringify(profile, null, 2);
}

// Export & Copy JSON Handlers
function initExportHandlers() {
  document.getElementById("btn-export-json").addEventListener("click", exportJsonFile);
  document.getElementById("btn-copy-json").addEventListener("click", () => {
    if (!currentStructuredProfile) return;
    navigator.clipboard.writeText(JSON.stringify(currentStructuredProfile, null, 2));
    alert("Structured Profile JSON copied to clipboard!");
  });
}

function exportJsonFile() {
  if (!currentStructuredProfile) return;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentStructuredProfile, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `structured_business_profile_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
