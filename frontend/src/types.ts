export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bmi: number;
  systolic_bp: number;
  diastolic_bp: number;
  cholesterol: number;
  glucose: number;
  heart_rate: number;
  smoking_status: string;
  alcohol_intake: string;
  physical_activity_hours: number;
  family_history: string;
  existing_conditions: string[];
  heart_disease_risk: number;
  diabetes_risk: number;
  stroke_risk: number;
  composite_risk: number;
  risk_category: 'Critical' | 'High' | 'Moderate' | 'Low';
  last_updated: string;
}

export interface ContributingFactor {
  factor: string;
  value: string;
  impact_weight: number;
  direction: 'elevated' | 'optimal' | 'risk-factor';
  clinical_note: string;
}

export interface Recommendation {
  type: 'urgent' | 'clinical' | 'lifestyle' | 'monitoring';
  title: string;
  description: string;
  timeframe: string;
}

export interface ConfidenceInterval {
  lower: number;
  upper: number;
  confidence_level: number;
}

export interface DiseasePredictionDetail {
  disease: string;
  probability: number;
  confidence_interval: ConfidenceInterval;
  risk_category: string;
  contributing_factors: ContributingFactor[];
}

export interface PredictionResponse {
  patient_id?: string;
  patient_name: string;
  timestamp: string;
  model_version: string;
  disease_target: string;
  primary_probability: number;
  primary_ci: ConfidenceInterval;
  composite_risk: number;
  risk_category: 'Critical' | 'High' | 'Moderate' | 'Low';
  diseases: Record<string, DiseasePredictionDetail>;
  explainable_summary: string;
  contributing_factors: ContributingFactor[];
  recommendations: Recommendation[];
}

export interface PredictionHistoryRecord {
  run_id: string;
  timestamp: string;
  patient_id: string;
  patient_name: string;
  disease_target: string;
  probability: number;
  ci_lower: number;
  ci_upper: number;
  composite_risk: number;
  risk_category: 'Critical' | 'High' | 'Moderate' | 'Low';
  model_version: string;
  status: string;
}

export interface ModelBenchmark {
  model_id: string;
  model_name: string;
  category: 'Baseline' | 'Machine Learning';
  validation_accuracy: number;
  holdout_accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  auc_roc: number;
  latency_ms: number;
  training_time_s: number;
  status: 'Champion' | 'Candidate' | 'Staging' | 'Retired';
  version: string;
  description: string;
}

export interface DataQualityCheck {
  check_name: string;
  category: string;
  target_field: string;
  expected_range: string;
  total_checked: number;
  compliant_records: number;
  violation_count: number;
  compliance_rate: number;
  status: 'Passed' | 'Warning' | 'Failed';
}

export interface DataQualityAuditResponse {
  total_records: number;
  coverage_start: string;
  coverage_end: string;
  duplicate_collisions: number;
  missing_identifiers: number;
  overall_health_score: number;
  passed_checks: number;
  total_checks: number;
  last_audit_run: string;
  checks: DataQualityCheck[];
}

export interface SystemHealthResponse {
  gateway_status: string;
  database_status: string;
  model_status: string;
  environment: string;
  gateway_latency_ms: number;
  database_latency_ms: number;
  inference_latency_ms: number;
  active_champion: string;
  total_patients_indexed: number;
  total_predictions_served: number;
  uptime_percentage: number;
  server_time: string;
}

export interface DashboardAnalytics {
  kpis: {
    total_patients: number;
    high_risk_count: number;
    critical_risk_count: number;
    moderate_risk_count: number;
    low_risk_count: number;
    average_risk_score: number;
    champion_model_accuracy: number;
    champion_holdout_accuracy: number;
    champion_model_name: string;
    champion_model_version: string;
    coverage_dates: string;
  };
  risk_distribution: {
    tier: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  disease_overview: {
    disease: string;
    avg_risk: number;
    high_risk_count: number;
  }[];
  critical_alerts: Patient[];
}
