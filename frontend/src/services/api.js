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
