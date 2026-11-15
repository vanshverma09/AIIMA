from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Patient(BaseModel):
    id: str
    name: str
    age: int
    gender: str  # Male, Female, Other
    bmi: float
    systolic_bp: int
    diastolic_bp: int
    cholesterol: int
    glucose: int
    heart_rate: int
    smoking_status: str  # Never, Former, Current
    alcohol_intake: str   # None, Moderate, Heavy
    physical_activity_hours: float
    family_history: str  # None, Heart Disease, Diabetes, Stroke, Multiple
    existing_conditions: List[str] = []
    heart_disease_risk: float = 0.0
    diabetes_risk: float = 0.0
    stroke_risk: float = 0.0
    composite_risk: float = 0.0
    risk_category: str = "Low"  # Low, Moderate, High, Critical
    last_updated: str = "2026-10-07"

class PredictionRequest(BaseModel):
    patient_id: Optional[str] = None
    patient_name: Optional[str] = "Clinical Evaluation Subject"
    age: int = Field(52, ge=18, le=100)
    gender: str = Field("Male")
    bmi: float = Field(27.8, ge=12.0, le=60.0)
    systolic_bp: int = Field(138, ge=70, le=240)
    diastolic_bp: int = Field(88, ge=40, le=140)
    cholesterol: int = Field(225, ge=100, le=400)
    glucose: int = Field(115, ge=50, le=350)
    heart_rate: int = Field(76, ge=40, le=200)
    smoking_status: str = Field("Current") # Never, Former, Current
    alcohol_intake: str = Field("Moderate") # None, Moderate, Heavy
    physical_activity_hours: float = Field(2.5, ge=0.0, le=25.0)
    family_history: str = Field("Heart Disease") # None, Heart Disease, Diabetes, Stroke, Multiple
    disease_target: str = Field("all") # all, heart_disease, diabetes, stroke

class ContributingFactor(BaseModel):
    factor: str
    value: str
    impact_weight: float # e.g. 0.32 (+32%)
    direction: str # "elevated", "optimal", "risk-factor"
    clinical_note: str

class Recommendation(BaseModel):
    type: str # "urgent", "clinical", "lifestyle", "monitoring"
    title: str
    description: str
    timeframe: str

class ConfidenceInterval(BaseModel):
    lower: float
    upper: float
    confidence_level: float = 0.95

class DiseasePredictionDetail(BaseModel):
    disease: str
    probability: float
    confidence_interval: ConfidenceInterval
    risk_category: str
    contributing_factors: List[ContributingFactor]

class PredictionResponse(BaseModel):
    patient_id: Optional[str]
    patient_name: str
    timestamp: str
    model_version: str = "RF-Champion-v2.4"
    disease_target: str
    primary_probability: float
    primary_ci: ConfidenceInterval
    composite_risk: float
    risk_category: str
    diseases: Dict[str, DiseasePredictionDetail]
    explainable_summary: str
    contributing_factors: List[ContributingFactor]
    recommendations: List[Recommendation]

class PredictionHistoryRecord(BaseModel):
    run_id: str
    timestamp: str
    patient_id: str
    patient_name: str
    disease_target: str
    probability: float
    ci_lower: float
    ci_upper: float
    composite_risk: float
    risk_category: str
    model_version: str = "RF-Champion-v2.4"
    status: str = "Verified"

class ModelBenchmark(BaseModel):
    model_id: str
    model_name: str
    category: str # "Baseline" or "Machine Learning"
    validation_accuracy: float
    holdout_accuracy: float
    precision: float
    recall: float
    f1_score: float
    auc_roc: float
    latency_ms: float
    training_time_s: float
    status: str # "Champion", "Candidate", "Staging", "Retired"
    version: str
    description: str

class DataQualityCheck(BaseModel):
    check_name: str
    category: str
    target_field: str
    expected_range: str
    total_checked: int
    compliant_records: int
    violation_count: int
    compliance_rate: float
    status: str # "Passed", "Warning", "Failed"

class DataQualityAuditResponse(BaseModel):
    total_records: int
    coverage_start: str
    coverage_end: str
    duplicate_collisions: int
    missing_identifiers: int
    overall_health_score: float
    passed_checks: int
    total_checks: int
    last_audit_run: str
    checks: List[DataQualityCheck]

class SystemHealthResponse(BaseModel):
    gateway_status: str
    database_status: str
    model_status: str
    environment: str
    gateway_latency_ms: float
    database_latency_ms: float
    inference_latency_ms: float
    active_champion: str
    total_patients_indexed: int
    total_predictions_served: int
    uptime_percentage: float
    server_time: str
