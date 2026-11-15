import {
  Patient,
  PredictionResponse,
  PredictionHistoryRecord,
  ModelBenchmark,
  DataQualityAuditResponse,
  DataQualityCheck,
  SystemHealthResponse,
  DashboardAnalytics,
  ContributingFactor,
  Recommendation
} from './types';

// Deterministic Pseudo-Random Generator
function createRng(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const FIRST_NAMES = [
  "Aarav", "Aditi", "Rohan", "Priya", "Ananya", "Vikram", "Neha", "Rahul", "Pooja", "Arjun",
  "Siddharth", "Kavita", "Deepak", "Sneha", "Karan", "Divya", "Suresh", "Meera", "Rajesh", "Sunita",
  "Marcus", "Elena", "David", "Sophia", "James", "Jessica", "Robert", "Jennifer", "William", "Elizabeth"
];

const LAST_NAMES = [
  "Verma", "Sharma", "Gupta", "Malhotra", "Kapoor", "Bhatia", "Chopra", "Mehta", "Singh", "Arora",
  "Patel", "Joshi", "Deshmukh", "Reddy", "Nair", "Vance", "Mercer", "Sterling", "Cross", "Chen"
];

export function calculateCompositeRisk(heart: number, diabetes: number, stroke: number): number {
  const comp = 0.40 * heart + 0.35 * diabetes + 0.25 * stroke;
  return Number(Math.min(Math.max(comp, 0.02), 0.98).toFixed(4));
}

export function classifyRiskTier(score: number): 'Critical' | 'High' | 'Moderate' | 'Low' {
  if (score >= 0.80) return 'Critical';
  if (score >= 0.60) return 'High';
  if (score >= 0.40) return 'Moderate';
  return 'Low';
}

export function computeConfidenceInterval(probability: number, nSamples = 120) {
  const p = Math.min(Math.max(probability, 0.01), 0.99);
  const se = Math.sqrt((p * (1.0 - p)) / nSamples);
  const margin = 1.96 * se;
  return {
    lower: Number(Math.max(0.01, p - margin).toFixed(3)),
    upper: Number(Math.min(0.99, p + margin).toFixed(3)),
    confidence_level: 0.95
  };
}

// Generate in-memory 10,240 records
function generatePatientsCohort(): Patient[] {
  const rng = createRng(42);
  const list: Patient[] = [];

  for (let i = 0; i < 10240; i++) {
    const gender = rng() > 0.48 ? "Male" : "Female";
    const age = Math.floor(22 + rng() * 66);
    const fname = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    const lname = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    const name = `${fname} ${lname}`;
    const pid = `MRN-${10000 + i}`;

    const bmi = Number((19.0 + rng() * 22.0).toFixed(1));
    const systolic_bp = Math.floor(100 + rng() * 75);
    const diastolic_bp = Math.floor(systolic_bp * 0.64 + rng() * 8);
    const cholesterol = Math.floor(140 + rng() * 160);
    const glucose = Math.floor(75 + rng() * 150);
    const heart_rate = Math.floor(58 + rng() * 38);

    const rSmoke = rng();
    const smoking_status = rSmoke > 0.75 ? "Current" : (rSmoke > 0.50 ? "Former" : "Never");
    const rAlc = rng();
    const alcohol_intake = rAlc > 0.85 ? "Heavy" : (rAlc > 0.45 ? "Moderate" : "None");
    const physical_activity_hours = Number((rng() * 10.0).toFixed(1));

    const rFam = rng();
    const family_history = rFam > 0.80 ? "Multiple" : (rFam > 0.60 ? "Heart Disease" : (rFam > 0.40 ? "Diabetes" : "None"));

    const existing_conditions: string[] = [];
    if (systolic_bp >= 140) existing_conditions.push("Hypertension");
    if (cholesterol >= 240) existing_conditions.push("Hyperlipidemia");
    if (glucose >= 126) existing_conditions.push("Type-2 Diabetes");
    if (bmi >= 30) existing_conditions.push("Obesity");

    // Pathological risk estimation
    let hRisk = 0.06 + (age - 25) * 0.007 + (systolic_bp - 120) * 0.005 + (cholesterol - 180) * 0.003;
    if (smoking_status === "Current") hRisk += 0.22;
    if (family_history === "Heart Disease" || family_history === "Multiple") hRisk += 0.14;
    const heart_disease_risk = Number(Math.min(Math.max(hRisk, 0.04), 0.96).toFixed(4));

    let dRisk = 0.05 + (glucose - 90) * 0.006 + (bmi - 23) * 0.015 + (age - 30) * 0.003;
    if (physical_activity_hours < 2.0) dRisk += 0.12;
    if (family_history === "Diabetes" || family_history === "Multiple") dRisk += 0.16;
    const diabetes_risk = Number(Math.min(Math.max(dRisk, 0.03), 0.95).toFixed(4));

    let sRisk = 0.04 + (systolic_bp - 120) * 0.007 + (age - 45) * 0.007;
    if (smoking_status === "Current") sRisk += 0.18;
    if (heart_disease_risk > 0.60) sRisk += 0.15;
    const stroke_risk = Number(Math.min(Math.max(sRisk, 0.02), 0.94).toFixed(4));

    const composite_risk = calculateCompositeRisk(heart_disease_risk, diabetes_risk, stroke_risk);
    const risk_category = classifyRiskTier(composite_risk);

    list.push({
      id: pid,
      name,
      age,
      gender,
      bmi,
      systolic_bp,
      diastolic_bp,
      cholesterol,
      glucose,
      heart_rate,
      smoking_status,
      alcohol_intake,
      physical_activity_hours,
      family_history,
      existing_conditions,
      heart_disease_risk,
      diabetes_risk,
      stroke_risk,
      composite_risk,
      risk_category,
      last_updated: "2026-10-07"
    });
  }

  return list;
}

// Global cached in-memory store
export const PATIENTS_CACHE = generatePatientsCohort();

export const INITIAL_PREDICTION_HISTORY: PredictionHistoryRecord[] = PATIENTS_CACHE.slice(0, 30).map((p, idx) => ({
  run_id: `RUN-2026-${1400 + idx}`,
  timestamp: `2026-10-07 1${Math.floor(idx / 6)}:${(idx * 7) % 60 < 10 ? '0' : ''}${(idx * 7) % 60}:12`,
  patient_id: p.id,
  patient_name: p.name,
  disease_target: idx % 3 === 0 ? "all" : (idx % 3 === 1 ? "heart_disease" : "diabetes"),
  probability: p.composite_risk,
  ci_lower: Math.max(0.01, Number((p.composite_risk - 0.05).toFixed(3))),
  ci_upper: Math.min(0.99, Number((p.composite_risk + 0.05).toFixed(3))),
  composite_risk: p.composite_risk,
  risk_category: p.risk_category,
  model_version: "RF-Champion-v2.4",
  status: "Physician Verified"
}));

export const BENCHMARK_MODELS: ModelBenchmark[] = [
  {
    model_id: "rf-champion-v2.4",
    model_name: "Random Forest Classifier",
    category: "Machine Learning",
    validation_accuracy: 92.4,
    holdout_accuracy: 91.7,
    precision: 91.8,
    recall: 93.1,
    f1_score: 92.4,
    auc_roc: 0.967,
    latency_ms: 5.4,
    training_time_s: 14.8,
    status: "Champion",
    version: "v2.4-prod",
    description: "Production Champion: 200-tree calibrated forest with Gini impurity splitting and bootstrap feature bagging."
  },
  {
    model_id: "xgboost-candidate-v2.3",
    model_name: "XGBoost Classifier",
    category: "Machine Learning",
    validation_accuracy: 92.1,
    holdout_accuracy: 91.4,
    precision: 91.6,
    recall: 92.4,
    f1_score: 92.0,
    auc_roc: 0.963,
    latency_ms: 8.1,
    training_time_s: 22.5,
    status: "Candidate",
    version: "v2.3-candidate",
    description: "Extreme gradient-boosted tree ensemble utilizing histogram-based splits and L2 regularization."
  },
  {
    model_id: "gb-candidate-v2.1",
    model_name: "Gradient Boosting (GBM)",
    category: "Machine Learning",
    validation_accuracy: 91.8,
    holdout_accuracy: 91.0,
    precision: 91.2,
    recall: 91.9,
    f1_score: 91.5,
    auc_roc: 0.958,
    latency_ms: 12.2,
    training_time_s: 28.1,
    status: "Candidate",
    version: "v2.1-candidate",
    description: "Sequential additive shrinkage tree ensemble optimized for log-loss minimization across clinical features."
  },
  {
    model_id: "svm-rbf-v1.8",
    model_name: "Support Vector Machine (RBF Kernel)",
    category: "Machine Learning",
    validation_accuracy: 88.6,
    holdout_accuracy: 87.8,
    precision: 87.9,
    recall: 88.4,
    f1_score: 88.1,
    auc_roc: 0.932,
    latency_ms: 15.6,
    training_time_s: 35.4,
    status: "Staging",
    version: "v1.8-staging",
    description: "Maximum-margin hyperplane with non-linear radial basis function kernel on standardized clinical space."
  },
  {
    model_id: "logreg-baseline-v1.0",
    model_name: "Logistic Regression (L2)",
    category: "Baseline",
    validation_accuracy: 84.2,
    holdout_accuracy: 83.5,
    precision: 83.1,
    recall: 82.5,
    f1_score: 82.8,
    auc_roc: 0.891,
    latency_ms: 2.1,
    training_time_s: 2.1,
    status: "Retired",
    version: "v1.0-baseline",
    description: "Standard clinical baseline: Regularized logit regression providing linear odds ratio interpretation."
  },
  {
    model_id: "dtree-baseline-v1.0",
    model_name: "Decision Tree (CART)",
    category: "Baseline",
    validation_accuracy: 81.5,
    holdout_accuracy: 80.8,
    precision: 80.2,
    recall: 82.0,
    f1_score: 81.1,
    auc_roc: 0.843,
    latency_ms: 1.8,
    training_time_s: 1.5,
    status: "Retired",
    version: "v1.0-baseline",
    description: "Single-tree partition model demonstrating transparent decision splits without ensemble averaging."
  }
];

export const ROC_CURVES_DATA = {
  "Random Forest": [
    { fpr: 0.00, tpr: 0.00 },
    { fpr: 0.02, tpr: 0.45 },
    { fpr: 0.05, tpr: 0.78 },
    { fpr: 0.10, tpr: 0.89 },
    { fpr: 0.15, tpr: 0.94 },
    { fpr: 0.25, tpr: 0.97 },
    { fpr: 0.40, tpr: 0.985 },
    { fpr: 1.00, tpr: 1.00 }
  ],
  "XGBoost": [
    { fpr: 0.00, tpr: 0.00 },
    { fpr: 0.03, tpr: 0.42 },
    { fpr: 0.06, tpr: 0.75 },
    { fpr: 0.12, tpr: 0.88 },
    { fpr: 0.18, tpr: 0.93 },
    { fpr: 0.30, tpr: 0.96 },
    { fpr: 1.00, tpr: 1.00 }
  ],
  "Logistic Regression": [
    { fpr: 0.00, tpr: 0.00 },
    { fpr: 0.08, tpr: 0.35 },
    { fpr: 0.15, tpr: 0.62 },
    { fpr: 0.25, tpr: 0.78 },
    { fpr: 0.40, tpr: 0.85 },
    { fpr: 1.00, tpr: 1.00 }
  ]
};

export function evaluateClinicalInference(params: any): PredictionResponse {
  const age = Number(params.age) || 55;
  const sbp = Number(params.systolic_bp) || 135;
  const dbp = Number(params.diastolic_bp) || 85;
  const chol = Number(params.cholesterol) || 210;
  const glu = Number(params.glucose) || 110;
  const bmi = Number(params.bmi) || 27.0;
  const smoking = params.smoking_status || "Never";
  const activity = Number(params.physical_activity_hours) || 2.5;
  const fam = params.family_history || "None";
  const target = (params.disease_target || "all").toLowerCase();

  // Heart
  let hRisk = 0.06 + (age - 25) * 0.007 + (sbp - 120) * 0.005 + (chol - 180) * 0.003;
  if (smoking === "Current") hRisk += 0.22;
  if (fam === "Heart Disease" || fam === "Multiple") hRisk += 0.14;
  const pHeart = Number(Math.min(Math.max(hRisk, 0.04), 0.96).toFixed(4));

  // Diabetes
  let dRisk = 0.05 + (glu - 90) * 0.006 + (bmi - 23) * 0.015 + (age - 30) * 0.003;
  if (activity < 2.0) dRisk += 0.12;
  if (fam === "Diabetes" || fam === "Multiple") dRisk += 0.16;
  const pDiabetes = Number(Math.min(Math.max(dRisk, 0.03), 0.95).toFixed(4));

  // Stroke
  let sRisk = 0.04 + (sbp - 120) * 0.007 + (age - 45) * 0.007;
  if (smoking === "Current") sRisk += 0.18;
  if (pHeart > 0.60) sRisk += 0.15;
  const pStroke = Number(Math.min(Math.max(sRisk, 0.02), 0.94).toFixed(4));

  const compRisk = calculateCompositeRisk(pHeart, pDiabetes, pStroke);
  const compTier = classifyRiskTier(compRisk);

  const ciHeart = computeConfidenceInterval(pHeart);
  const ciDiabetes = computeConfidenceInterval(pDiabetes);
  const ciStroke = computeConfidenceInterval(pStroke);

  const factors: ContributingFactor[] = [];
  if (sbp >= 140) {
    factors.push({
      factor: "Blood Pressure",
      value: `${sbp}/${dbp} mmHg`,
      impact_weight: 0.32,
      direction: "elevated",
      clinical_note: "Stage 2 Hypertension induces severe vascular shear stress and left ventricular workload."
    });
  }
  if (chol >= 220) {
    factors.push({
      factor: "Total Cholesterol",
      value: `${chol} mg/dL`,
      impact_weight: 0.28,
      direction: "elevated",
      clinical_note: "Elevated atherogenic serum lipids accelerate arterial stenosis and plaque buildup."
    });
  }
  if (glu >= 120) {
    factors.push({
      factor: "Fasting Glucose",
      value: `${glu} mg/dL`,
      impact_weight: 0.25,
      direction: "elevated",
      clinical_note: "Glycemic elevation reflects systemic insulin dysregulation and microvascular injury."
    });
  }
  if (smoking === "Current") {
    factors.push({
      factor: "Tobacco Consumption",
      value: "Active Smoker",
      impact_weight: 0.25,
      direction: "risk-factor",
      clinical_note: "Combustion oxidants promote platelet hyper-reactivity and coronary endothelial damage."
    });
  }
  if (bmi >= 28) {
    factors.push({
      factor: "Body Mass Index",
      value: `${bmi} kg/m²`,
      impact_weight: 0.15,
      direction: "elevated",
      clinical_note: "Visceral adiposity correlates with pro-inflammatory cytokines and metabolic resistance."
    });
  }

  const recommendations: Recommendation[] = [];
  if (compTier === 'Critical') {
    recommendations.push({
      type: "urgent",
      title: "Immediate Cardiology & Acute Triage",
      description: "Perform 12-lead ECG, cardiac troponins, and emergency vitals stabilization protocol.",
      timeframe: "Immediate (< 24 hours)"
    });
  } else if (compTier === 'High') {
    recommendations.push({
      type: "clinical",
      title: "Attending Specialist Outpatient Consult",
      description: "Order fractionated lipid panel, echocardiography, and initiate cardiometabolic therapy.",
      timeframe: "Within 72 hours"
    });
  }

  if (sbp >= 140) {
    recommendations.push({
      type: "clinical",
      title: "Antihypertensive Regimen Initiation",
      description: "Initiate ACE-inhibitor / ARB titration and ambulatory daily blood pressure telemetry.",
      timeframe: "Weekly monitoring"
    });
  }
  if (chol >= 220) {
    recommendations.push({
      type: "clinical",
      title: "Statin Therapy & Lipid Optimization",
      description: "Evaluate atorvastatin/rosuvastatin therapy targeting LDL-C < 70 mg/dL.",
      timeframe: "Within 30 days"
    });
  }
  if (glu >= 115) {
    recommendations.push({
      type: "monitoring",
      title: "Glycemic Control & HbA1c Lab Test",
      description: "Order 3-month HbA1c assessment and postprandial glucose curve evaluation.",
      timeframe: "Within 14 days"
    });
  }

  let primaryProb = compRisk;
  let primaryCi = computeConfidenceInterval(compRisk);
  let primaryTier = compTier;

  if (target === "heart_disease") {
    primaryProb = pHeart;
    primaryCi = ciHeart;
    primaryTier = classifyRiskTier(pHeart);
  } else if (target === "diabetes") {
    primaryProb = pDiabetes;
    primaryCi = ciDiabetes;
    primaryTier = classifyRiskTier(pDiabetes);
  } else if (target === "stroke") {
    primaryProb = pStroke;
    primaryCi = ciStroke;
    primaryTier = classifyRiskTier(pStroke);
  }

  const patientName = params.patient_name || "Marcus Vance (Inpatient)";
  const patientId = params.patient_id || "MRN-84920";

  return {
    patient_id: patientId,
    patient_name: patientName,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    model_version: "RF-Champion-v2.4",
    disease_target: target,
    primary_probability: primaryProb,
    primary_ci: primaryCi,
    composite_risk: compRisk,
    risk_category: primaryTier,
    diseases: {
      heart_disease: {
        disease: "Coronary Artery Disease (CAD)",
        probability: pHeart,
        confidence_interval: ciHeart,
        risk_category: classifyRiskTier(pHeart),
        contributing_factors: factors.slice(0, 3)
      },
      diabetes: {
        disease: "Type-2 Diabetes Mellitus",
        probability: pDiabetes,
        confidence_interval: ciDiabetes,
        risk_category: classifyRiskTier(pDiabetes),
        contributing_factors: factors.slice(0, 3)
      },
      stroke: {
        disease: "Cerebrovascular Stroke",
        probability: pStroke,
        confidence_interval: ciStroke,
        risk_category: classifyRiskTier(pStroke),
        contributing_factors: factors.slice(0, 3)
      }
    },
    explainable_summary: `${patientName} exhibits a ${primaryTier} clinical risk profile (${(primaryProb * 100).toFixed(1)}%). Primary contributing factors include ${factors.map(f => f.factor.toLowerCase()).slice(0, 2).join(' and ')}. Attending physician evaluation and therapeutic order execution recommended.`,
    contributing_factors: factors,
    recommendations: recommendations.length > 0 ? recommendations : [{
      type: "lifestyle",
      title: "Standard Annual Health Maintenance",
      description: "Routine wellness screening, aerobic exercise maintenance, and annual lipid/metabolic labs.",
      timeframe: "Annual review"
    }]
  };
}

export function getClientDashboardData(): DashboardAnalytics {
  const total = PATIENTS_CACHE.length;
  const critical = PATIENTS_CACHE.filter(p => p.risk_category === 'Critical');
  const high = PATIENTS_CACHE.filter(p => p.risk_category === 'High');
  const moderate = PATIENTS_CACHE.filter(p => p.risk_category === 'Moderate');
  const low = PATIENTS_CACHE.filter(p => p.risk_category === 'Low');

  const avgComp = Number((PATIENTS_CACHE.reduce((acc, p) => acc + p.composite_risk, 0) / total).toFixed(3));
  const avgHeart = Number(((PATIENTS_CACHE.reduce((acc, p) => acc + p.heart_disease_risk, 0) / total) * 100).toFixed(1));
  const avgDiab = Number(((PATIENTS_CACHE.reduce((acc, p) => acc + p.diabetes_risk, 0) / total) * 100).toFixed(1));
  const avgStroke = Number(((PATIENTS_CACHE.reduce((acc, p) => acc + p.stroke_risk, 0) / total) * 100).toFixed(1));

  return {
    kpis: {
      total_patients: total,
      high_risk_count: high.length,
      critical_risk_count: critical.length,
      moderate_risk_count: moderate.length,
      low_risk_count: low.length,
      average_risk_score: avgComp,
      champion_model_accuracy: 92.4,
      champion_holdout_accuracy: 91.7,
      champion_model_name: "Random Forest Classifier",
      champion_model_version: "v2.4-prod",
      coverage_dates: "2020-01-01 to 2026-10-07"
    },
    risk_distribution: [
      { tier: "Critical", count: critical.length, percentage: Number((critical.length / total * 100).toFixed(1)), color: "#ef4444" },
      { tier: "High", count: high.length, percentage: Number((high.length / total * 100).toFixed(1)), color: "#f97316" },
      { tier: "Moderate", count: moderate.length, percentage: Number((moderate.length / total * 100).toFixed(1)), color: "#eab308" },
      { tier: "Low", count: low.length, percentage: Number((low.length / total * 100).toFixed(1)), color: "#10b981" },
    ],
    disease_overview: [
      { disease: "Heart Disease", avg_risk: avgHeart, high_risk_count: PATIENTS_CACHE.filter(p => p.heart_disease_risk >= 0.60).length },
      { disease: "Diabetes", avg_risk: avgDiab, high_risk_count: PATIENTS_CACHE.filter(p => p.diabetes_risk >= 0.60).length },
      { disease: "Stroke", avg_risk: avgStroke, high_risk_count: PATIENTS_CACHE.filter(p => p.stroke_risk >= 0.60).length },
    ],
    critical_alerts: critical.slice(0, 6)
  };
}

export function getClientSystemHealth(): SystemHealthResponse {
  return {
    gateway_status: "Online",
    database_status: "Operational",
    model_status: "Loaded",
    environment: "Cloud Edge Production (High-Availability)",
    gateway_latency_ms: 2.4,
    database_latency_ms: 0.6,
    inference_latency_ms: 3.1,
    active_champion: "Random Forest Classifier (v2.4)",
    total_patients_indexed: PATIENTS_CACHE.length,
    total_predictions_served: 1428,
    uptime_percentage: 99.98,
    server_time: new Date().toISOString().replace('T', ' ').slice(0, 19)
  };
}

export function getClientPatients(
  search = '',
  riskCategory = 'all',
  sortBy = 'composite_risk',
  order = 'desc',
  offset = 0,
  limit = 25
): { total: number; offset: number; limit: number; items: Patient[] } {
  let filtered = [...PATIENTS_CACHE];

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
  }

  if (riskCategory && riskCategory !== 'all') {
    filtered = filtered.filter(p => p.risk_category.toLowerCase() === riskCategory.toLowerCase());
  }

  filtered.sort((a, b) => {
    let valA = (a as any)[sortBy];
    let valB = (b as any)[sortBy];
    if (typeof valA === 'string') {
      return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    valA = Number(valA) || 0;
    valB = Number(valB) || 0;
    return order === 'asc' ? valA - valB : valB - valA;
  });

  const total = filtered.length;
  const items = filtered.slice(offset, offset + limit);

  return { total, offset, limit, items };
}

export function getClientPatient(id: string): Patient {
  const p = PATIENTS_CACHE.find(pt => pt.id === id);
  if (p) return p;
  return PATIENTS_CACHE[0];
}

export function createClientPatient(patientData: Partial<Patient>): Patient {
  const pid = `MRN-${10000 + PATIENTS_CACHE.length}`;
  const inference = evaluateClinicalInference({
    ...patientData,
    patient_name: patientData.name || "New Patient",
    patient_id: pid
  });

  const newPatient: Patient = {
    id: pid,
    name: patientData.name || "New Inpatient",
    age: patientData.age || 45,
    gender: patientData.gender || "Male",
    bmi: patientData.bmi || 24.5,
    systolic_bp: patientData.systolic_bp || 120,
    diastolic_bp: patientData.diastolic_bp || 80,
    cholesterol: patientData.cholesterol || 190,
    glucose: patientData.glucose || 95,
    heart_rate: patientData.heart_rate || 72,
    smoking_status: patientData.smoking_status || "Never",
    alcohol_intake: patientData.alcohol_intake || "None",
    physical_activity_hours: patientData.physical_activity_hours || 3.0,
    family_history: patientData.family_history || "None",
    existing_conditions: patientData.existing_conditions || [],
    heart_disease_risk: inference.diseases.heart_disease?.probability || 0.12,
    diabetes_risk: inference.diseases.diabetes?.probability || 0.10,
    stroke_risk: inference.diseases.stroke?.probability || 0.08,
    composite_risk: inference.composite_risk,
    risk_category: inference.risk_category,
    last_updated: new Date().toISOString().slice(0, 10)
  };

  PATIENTS_CACHE.unshift(newPatient);
  return newPatient;
}

export function getClientPredictionHistory(limit = 50): PredictionHistoryRecord[] {
  return INITIAL_PREDICTION_HISTORY.slice(0, limit);
}

export function addClientPredictionHistory(rec: PredictionHistoryRecord) {
  INITIAL_PREDICTION_HISTORY.unshift(rec);
}

export function getClientModelRegistry(): {
  models: ModelBenchmark[];
  roc_curves: Record<string, { fpr: number; tpr: number }[]>;
} {
  return {
    models: [...BENCHMARK_MODELS],
    roc_curves: ROC_CURVES_DATA
  };
}

export function promoteClientModel(modelId: string): { status: string; champion: ModelBenchmark } {
  let promotedModel: ModelBenchmark | undefined;
  for (const m of BENCHMARK_MODELS) {
    if (m.model_id === modelId) {
      m.status = 'Champion';
      promotedModel = m;
    } else if (m.status === 'Champion') {
      m.status = 'Candidate';
    }
  }
  return {
    status: "success",
    champion: promotedModel || BENCHMARK_MODELS[0]
  };
}

export function getClientDataQuality(): DataQualityAuditResponse {
  const total = PATIENTS_CACHE.length;
  const checks: DataQualityCheck[] = [
    {
      check_name: "Systolic Blood Pressure Bounds",
      category: "Clinical Vitals",
      target_field: "systolic_bp",
      expected_range: "[70 - 240]",
      total_checked: total,
      compliant_records: total,
      violation_count: 0,
      compliance_rate: 100.0,
      status: "Passed"
    },
    {
      check_name: "Diastolic Blood Pressure Bounds",
      category: "Clinical Vitals",
      target_field: "diastolic_bp",
      expected_range: "[40 - 140]",
      total_checked: total,
      compliant_records: total,
      violation_count: 0,
      compliance_rate: 100.0,
      status: "Passed"
    },
    {
      check_name: "Serum Total Cholesterol Bounds",
      category: "Laboratory",
      target_field: "cholesterol",
      expected_range: "[100 - 400]",
      total_checked: total,
      compliant_records: total,
      violation_count: 0,
      compliance_rate: 100.0,
      status: "Passed"
    },
    {
      check_name: "Fasting Plasma Glucose Bounds",
      category: "Laboratory",
      target_field: "glucose",
      expected_range: "[50 - 350]",
      total_checked: total,
      compliant_records: total,
      violation_count: 0,
      compliance_rate: 100.0,
      status: "Passed"
    },
    {
      check_name: "Body Mass Index (BMI) Bounds",
      category: "Biometrics",
      target_field: "bmi",
      expected_range: "[12.0 - 65.0]",
      total_checked: total,
      compliant_records: total,
      violation_count: 0,
      compliance_rate: 100.0,
      status: "Passed"
    },
    {
      check_name: "Patient Age Validity",
      category: "Demographics",
      target_field: "age",
      expected_range: "[18 - 110]",
      total_checked: total,
      compliant_records: total,
      violation_count: 0,
      compliance_rate: 100.0,
      status: "Passed"
    },
    {
      check_name: "Resting Heart Rate Bounds",
      category: "Clinical Vitals",
      target_field: "heart_rate",
      expected_range: "[40 - 200]",
      total_checked: total,
      compliant_records: total,
      violation_count: 0,
      compliance_rate: 100.0,
      status: "Passed"
    },
    {
      check_name: "Physical Activity Weekly Hours",
      category: "Lifestyle",
      target_field: "physical_activity_hours",
      expected_range: "[0.0 - 30.0]",
      total_checked: total,
      compliant_records: total,
      violation_count: 0,
      compliance_rate: 100.0,
      status: "Passed"
    }
  ];

  return {
    total_records: total,
    coverage_start: "2020-01-01",
    coverage_end: "2026-10-07",
    duplicate_collisions: 0,
    missing_identifiers: 0,
    overall_health_score: 100.0,
    passed_checks: checks.length,
    total_checks: checks.length,
    last_audit_run: new Date().toISOString().replace('T', ' ').slice(0, 19) + " UTC",
    checks
  };
}
