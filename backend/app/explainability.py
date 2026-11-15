from typing import List, Dict, Any
from .models_schema import ContributingFactor, Recommendation

def generate_contributing_factors(params: Dict[str, Any], disease: str) -> List[ContributingFactor]:
    factors = []
    
    age = params.get("age", 50)
    systolic_bp = params.get("systolic_bp", 120)
    diastolic_bp = params.get("diastolic_bp", 80)
    cholesterol = params.get("cholesterol", 190)
    glucose = params.get("glucose", 95)
    bmi = params.get("bmi", 24.5)
    smoking = params.get("smoking_status", "Never")
    activity = params.get("physical_activity_hours", 3.0)
    family_hist = params.get("family_history", "None")

    # Systolic BP
    if systolic_bp >= 140 or diastolic_bp >= 90:
        factors.append(ContributingFactor(
            factor="Blood Pressure",
            value=f"{systolic_bp}/{diastolic_bp} mmHg",
            impact_weight=0.32 if disease in ["heart_disease", "stroke", "all"] else 0.15,
            direction="elevated",
            clinical_note="Stage 2 Hypertension significantly exacerbates vascular resistance and arterial wall stress."
        ))
    elif systolic_bp >= 130 or diastolic_bp >= 85:
        factors.append(ContributingFactor(
            factor="Blood Pressure",
            value=f"{systolic_bp}/{diastolic_bp} mmHg",
            impact_weight=0.18,
            direction="elevated",
            clinical_note="Stage 1 Hypertension; pre-hypertensive load on cardiovascular pathways."
        ))
    else:
        factors.append(ContributingFactor(
            factor="Blood Pressure",
            value=f"{systolic_bp}/{diastolic_bp} mmHg",
            impact_weight=-0.12,
            direction="optimal",
            clinical_note="Normotensive blood pressure exerts protective cardiovascular effect."
        ))

    # Cholesterol
    if cholesterol >= 240:
        factors.append(ContributingFactor(
            factor="Total Serum Cholesterol",
            value=f"{cholesterol} mg/dL",
            impact_weight=0.28 if disease in ["heart_disease", "all"] else 0.16,
            direction="elevated",
            clinical_note="High hypercholesterolemia markedly accelerates coronary and cerebrovascular atherosclerotic plaque formation."
        ))
    elif cholesterol >= 200:
        factors.append(ContributingFactor(
            factor="Total Serum Cholesterol",
            value=f"{cholesterol} mg/dL",
            impact_weight=0.15,
            direction="elevated",
            clinical_note="Borderline high cholesterol level; warrants dietary optimization."
        ))
    else:
        factors.append(ContributingFactor(
            factor="Total Serum Cholesterol",
            value=f"{cholesterol} mg/dL",
            impact_weight=-0.10,
            direction="optimal",
            clinical_note="Favorable lipid profile with low atherogenic risk."
        ))

    # Fasting Glucose
    if glucose >= 126:
        factors.append(ContributingFactor(
            factor="Fasting Plasma Glucose",
            value=f"{glucose} mg/dL",
            impact_weight=0.35 if disease in ["diabetes", "all"] else 0.18,
            direction="elevated",
            clinical_note="Diabetic range hyperglycemia induces microvascular endothelial injury and osmotic strain."
        ))
    elif glucose >= 100:
        factors.append(ContributingFactor(
            factor="Fasting Plasma Glucose",
            value=f"{glucose} mg/dL",
            impact_weight=0.18 if disease in ["diabetes", "all"] else 0.10,
            direction="elevated",
            clinical_note="Impaired fasting glucose indicates metabolic syndrome and insulin resistance predisposition."
        ))
    else:
        factors.append(ContributingFactor(
            factor="Fasting Plasma Glucose",
            value=f"{glucose} mg/dL",
            impact_weight=-0.14,
            direction="optimal",
            clinical_note="Euglycemic fasting reading reflects intact insulin sensitivity."
        ))

    # BMI
    if bmi >= 30:
        factors.append(ContributingFactor(
            factor="Body Mass Index (BMI)",
            value=f"{bmi:.1f} kg/m²",
            impact_weight=0.22,
            direction="elevated",
            clinical_note="Class I/II Obesity elevates systemic inflammation and metabolic cardiac workload."
        ))
    elif bmi >= 25:
        factors.append(ContributingFactor(
            factor="Body Mass Index (BMI)",
            value=f"{bmi:.1f} kg/m²",
            impact_weight=0.12,
            direction="elevated",
            clinical_note="Overweight threshold increases cardiometabolic susceptibility."
        ))
    else:
        factors.append(ContributingFactor(
            factor="Body Mass Index (BMI)",
            value=f"{bmi:.1f} kg/m²",
            impact_weight=-0.08,
            direction="optimal",
            clinical_note="Healthy body mass range mitigates metabolic risk."
        ))

    # Smoking
    if smoking == "Current":
        factors.append(ContributingFactor(
            factor="Tobacco Smoking",
            value="Active Smoker",
            impact_weight=0.25,
            direction="risk-factor",
            clinical_note="Combustion byproducts promote oxidative stress, platelet aggregation, and endothelial dysfunction."
        ))
    elif smoking == "Former":
        factors.append(ContributingFactor(
            factor="Tobacco Smoking",
            value="Former Smoker",
            impact_weight=0.08,
            direction="risk-factor",
            clinical_note="Residual vascular remodeling present; risk trending downward post-cessation."
        ))

    # Physical Activity
    if activity < 1.5:
        factors.append(ContributingFactor(
            factor="Physical Activity",
            value=f"{activity:.1f} hrs/week",
            impact_weight=0.15,
            direction="risk-factor",
            clinical_note="Sedentary baseline impairs autonomic tone and endothelial nitric oxide synthesis."
        ))
    elif activity >= 3.5:
        factors.append(ContributingFactor(
            factor="Physical Activity",
            value=f"{activity:.1f} hrs/week",
            impact_weight=-0.16,
            direction="optimal",
            clinical_note="Cardiorespiratory fitness delivers strong cardioprotective and insulin-sensitizing benefits."
        ))

    # Age & Family History
    if age >= 60:
        factors.append(ContributingFactor(
            factor="Age Metric",
            value=f"{age} years",
            impact_weight=0.20,
            direction="risk-factor",
            clinical_note="Cumulative biological arterial stiffness and vascular senescence with advancing age."
        ))

    if family_hist in ["Heart Disease", "Diabetes", "Stroke", "Multiple"]:
        factors.append(ContributingFactor(
            factor="Family Clinical History",
            value=family_hist,
            impact_weight=0.18,
            direction="risk-factor",
            clinical_note=f"Hereditary predisposition for {family_hist} documented in first-degree relatives."
        ))

    # Sort factors by impact magnitude descending
    factors.sort(key=lambda x: abs(x.impact_weight), reverse=True)
    return factors

def generate_explainable_summary(patient_name: str, disease: str, prob: float, tier: str, factors: List[ContributingFactor]) -> str:
    high_factors = [f.factor.lower() for f in factors if f.impact_weight > 0.15]
    disease_label = {
        "heart_disease": "Heart Disease",
        "diabetes": "Type-2 Diabetes",
        "stroke": "Ischemic/Hemorrhagic Stroke",
        "all": "Multi-Condition Cardiovascular & Metabolic Risk"
    }.get(disease, "Disease")

    pct = round(prob * 100, 1)

    if tier == "Critical":
        primary = ", ".join(high_factors[:3]) if high_factors else "multiple compound clinical anomalies"
        return (
            f"{patient_name} presents with a Critical risk profile ({pct}%) for {disease_label}. "
            f"The primary clinical drivers include {primary}. Immediate emergency-grade physician evaluation "
            f"and therapeutic intervention are strongly indicated to prevent acute adverse outcomes."
        )
    elif tier == "High":
        primary = ", ".join(high_factors[:2]) if high_factors else "elevated biometric indicators"
        return (
            f"{patient_name} has an elevated risk score ({pct}%) classified in the High priority tier. "
            f"Key risk contributors are {primary}. Priority outpatient consultation, diagnostic lab review, "
            f"and structured pharmacological/lifestyle protocols should be instituted promptly."
        )
    elif tier == "Moderate":
        primary = ", ".join(high_factors[:2]) if high_factors else "borderline clinical thresholds"
        return (
            f"Assessment indicates Moderate risk ({pct}%) for {disease_label}. "
            f"Borderline metrics such as {primary} require targeted lifestyle modifications, dietary restructuring, "
            f"and routine re-evaluation at 3-month intervals."
        )
    else:
        return (
            f"{patient_name} demonstrates a Low risk profile ({pct}%) for {disease_label}. "
            f"Biometrics and lab markers align well with clinical target ranges. Recommend continuing "
            f"proactive health habits and standard annual wellness screenings."
        )

def generate_recommendations(params: Dict[str, Any], risk_category: str) -> List[Recommendation]:
    recs = []
    
    systolic_bp = params.get("systolic_bp", 120)
    cholesterol = params.get("cholesterol", 190)
    glucose = params.get("glucose", 95)
    bmi = params.get("bmi", 24.5)
    smoking = params.get("smoking_status", "Never")
    activity = params.get("physical_activity_hours", 3.0)

    if risk_category == "Critical":
        recs.append(Recommendation(
            type="urgent",
            title="Immediate Cardiology & Medical Triage",
            description="Schedule same-day or 24-hour comprehensive clinical evaluation; perform 12-lead ECG, cardiac troponins, and emergency vitals stabilization.",
            timeframe="Immediate (24–48 hours)"
        ))
    elif risk_category == "High":
        recs.append(Recommendation(
            type="clinical",
            title="Specialist Outpatient Consultation",
            description="Refer to cardiology and endocrinology for multi-parameter risk reduction and medical therapy evaluation.",
            timeframe="Within 7–14 days"
        ))

    # Blood pressure specific
    if systolic_bp >= 140:
        recs.append(Recommendation(
            type="clinical",
            title="Antihypertensive Regimen Review",
            description=f"Systolic BP is markedly elevated at {systolic_bp} mmHg. Implement daily home blood pressure logging and evaluate ACE-inhibitor/ARB therapy.",
            timeframe="Weekly monitoring"
        ))

    # Cholesterol specific
    if cholesterol >= 220:
        recs.append(Recommendation(
            type="clinical",
            title="Lipid Panel & Statin Evaluation",
            description=f"Serum cholesterol ({cholesterol} mg/dL) exceeds optimal thresholds. Order fractionated lipid panel (LDL-C, HDL-C, ApoB) and evaluate statin initiation.",
            timeframe="Within 30 days"
        ))

    # Glucose specific
    if glucose >= 110:
        recs.append(Recommendation(
            type="monitoring",
            title="Glycemic Control & HbA1c Lab Test",
            description=f"Fasting glucose of {glucose} mg/dL indicates insulin dysregulation. Administer 3-month HbA1c test and postprandial glycemic testing.",
            timeframe="Within 14 days"
        ))

    # Smoking
    if smoking == "Current":
        recs.append(Recommendation(
            type="lifestyle",
            title="Tobacco Cessation Protocol",
            description="Active smoking multiplies cardiovascular risk. Enroll in structured behavioral cessation counseling and consider nicotine replacement therapy.",
            timeframe="Initiate immediately"
        ))

    # Activity & BMI
    if activity < 2.5 or bmi >= 27.5:
        recs.append(Recommendation(
            type="lifestyle",
            title="Cardioprotective Exercise & Nutritional Plan",
            description="Prescribe progressive aerobic physical activity targeting >= 150 minutes/week, paired with Mediterranean-style dietary counseling to reduce visceral adiposity.",
            timeframe="Ongoing daily routine"
        ))

    if not recs:
        recs.append(Recommendation(
            type="lifestyle",
            title="Routine Wellness Maintenance",
            description="Maintain balanced nutrition, adequate hydration, regular physical activity, and repeat clinical biomarkers at next annual exam.",
            timeframe="Annual review"
        ))

    return recs
