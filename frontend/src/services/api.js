import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

/**
 * Checks API server health and model status
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('API Health Check Error:', error);
    return { status: 'offline', model_loaded: false, error: error.message };
  }
};

/**
 * Retrieves available Business Stages and Context-Specific Business Goals
 */
export const getStagesAndGoals = async () => {
  try {
    const response = await apiClient.get('/business/intake/stages-and-goals');
    return response.data;
  } catch (error) {
    console.error('Fetch Stages & Goals Error:', error);
    return { stages: [], goals: {} };
  }
};

/**
 * Retrieves Dynamic Context-Aware Field Requirements (Required, Optional, Hidden)
 */
export const getFieldConfiguration = async (stage, goal, category) => {
  try {
    const response = await apiClient.post('/business/intake/config', {
      business_stage: stage,
      business_goal: goal,
      business_category: category
    });
    return response.data;
  } catch (error) {
    console.error('Fetch Field Config Error:', error);
    return { field_config: {} };
  }
};

/**
 * Calls AI Business Intake Assistant NLP Extraction API
 * Parses free text (English, Singlish) and returns mapped context-aware schema fields and states
 */
export const extractIntakeInformation = async (text, stage = '', goal = '') => {
  try {
    const response = await apiClient.post('/business/intake/extract', { 
      text, 
      business_stage: stage, 
      business_goal: goal 
    });
    return response.data;
  } catch (error) {
    console.error('AI Intake Extraction Error:', error);
    const errorMessage = error.response?.data?.detail || error.message || 'Information extraction failed';
    throw new Error(errorMessage);
  }
};

/**
 * Executes complete Component 1 End-to-End Business Analysis
 * @param {Object} businessInput Raw SME parameters dictionary
 */
export const analyzeBusiness = async (businessInput) => {
  try {
    const response = await apiClient.post('/business/analyze', businessInput);
    return response.data;
  } catch (error) {
    console.error('API Business Analysis Error:', error);
    const errorMessage = error.response?.data?.detail || error.message || 'Analysis failed';
    throw new Error(errorMessage);
  }
};

/**
 * Retrieves recent analysis runs from Database
 */
export const fetchAnalysisRecords = async (limit = 10) => {
  try {
    const response = await apiClient.get(`/business/records?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Fetch Records Error:', error);
    return [];
  }
};

/**
 * Fetches single full structured profile by record ID
 */
export const fetchAnalysisRecordById = async (recordId) => {
  try {
    const response = await apiClient.get(`/business/record/${recordId}`);
    return response.data;
  } catch (error) {
    console.error(`Fetch Record ${recordId} Error:`, error);
    throw error;
  }
};

/**
 * Triggers PDF Business Plan document generation & download from backend
 */
export const downloadBusinessPlanPdf = async (profile) => {
  try {
    const response = await apiClient.post('/business/plan/generate-pdf', profile, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const bizName = profile.business_input?.business_name || profile.business_input?.business_category || 'Business';
    const cleanName = bizName.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `SME360_AI_Business_Plan_${cleanName}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('PDF Business Plan Generation Error:', error);
    throw error;
  }
};

/**
 * Triggers Word (.docx) Business Plan document generation & download from backend
 */
export const downloadBusinessPlanDocx = async (profile) => {
  try {
    const response = await apiClient.post('/business/plan/generate-docx', profile, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    const bizName = profile.business_input?.business_name || profile.business_input?.business_category || 'Business';
    const cleanName = bizName.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `SME360_AI_Business_Plan_${cleanName}.docx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('DOCX Business Plan Generation Error:', error);
    throw error;
  }
};
