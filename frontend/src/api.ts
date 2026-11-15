import {
  Patient,
  PredictionResponse,
  PredictionHistoryRecord,
  ModelBenchmark,
  DataQualityAuditResponse,
  SystemHealthResponse,
  DashboardAnalytics
} from './types';

const API_BASE = '/api/v1';

export async function fetchHealth(): Promise<SystemHealthResponse> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch system health');
  return res.json();
}

export async function fetchDashboard(): Promise<DashboardAnalytics> {
  const res = await fetch(`${API_BASE}/analytics/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch dashboard data');
  return res.json();
}

export async function fetchPatients(
  search = '',
  riskCategory = 'all',
  sortBy = 'composite_risk',
  order = 'desc',
  offset = 0,
  limit = 25
): Promise<{ total: number; offset: number; limit: number; items: Patient[] }> {
  const params = new URLSearchParams({
    search,
    risk_category: riskCategory,
    sort_by: sortBy,
    order,
    offset: String(offset),
    limit: String(limit)
  });
  const res = await fetch(`${API_BASE}/patients?${params}`);
  if (!res.ok) throw new Error('Failed to fetch patients list');
  return res.json();
}

export async function fetchPatient(id: string): Promise<Patient> {
  const res = await fetch(`${API_BASE}/patients/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch patient ${id}`);
  return res.json();
}

export async function createPatient(patientData: Partial<Patient>): Promise<Patient> {
  const res = await fetch(`${API_BASE}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData)
  });
  if (!res.ok) throw new Error('Failed to register new patient');
  return res.json();
}

export async function predictRisk(payload: any): Promise<PredictionResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Prediction request failed');
  return res.json();
}

export async function simulateRisk(payload: any): Promise<PredictionResponse> {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Simulation failed');
  return res.json();
}

export async function fetchPredictionHistory(limit = 50): Promise<PredictionHistoryRecord[]> {
  const res = await fetch(`${API_BASE}/predictions/history?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch prediction history');
  return res.json();
}

export async function fetchModelRegistry(): Promise<{
  models: ModelBenchmark[];
  roc_curves: Record<string, { fpr: number; tpr: number }[]>;
}> {
  const res = await fetch(`${API_BASE}/models/registry`);
  if (!res.ok) throw new Error('Failed to fetch model registry');
  return res.json();
}

export async function promoteModel(modelId: string): Promise<{ status: string; champion: ModelBenchmark }> {
  const res = await fetch(`${API_BASE}/models/promote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model_id: modelId })
  });
  if (!res.ok) throw new Error('Failed to promote candidate model');
  return res.json();
}

export async function fetchDataQuality(): Promise<DataQualityAuditResponse> {
  const res = await fetch(`${API_BASE}/data-quality/audit`);
  if (!res.ok) throw new Error('Failed to fetch data quality audit');
  return res.json();
}
