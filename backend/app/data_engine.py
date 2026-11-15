import json
import os
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple, Optional
from .models_schema import (
    Patient, DataQualityAuditResponse, DataQualityCheck,
    PredictionHistoryRecord
)
from .risk_engine import calculate_composite_risk, classify_risk_tier

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
PATIENTS_FILE = os.path.join(DATA_DIR, "patients_10240.json")
HISTORY_FILE = os.path.join(DATA_DIR, "prediction_history.json")

# In-memory stores
PATIENTS_STORE: List[Dict[str, Any]] = []
HISTORY_STORE: List[Dict[str, Any]] = []

FIRST_NAMES = [
    "Aarav", "Aditi", "Rohan", "Priya", "Ananya", "Vikram", "Neha", "Rahul", "Pooja", "Arjun",
    "Siddharth", "Kavita", "Deepak", "Sneha", "Karan", "Divya", "Suresh", "Meera", "Rajesh", "Sunita",
    "Michael", "Sarah", "David", "Emily", "James", "Jessica", "Robert", "Jennifer", "William", "Elizabeth",
    "Daniel", "Sophia", "Matthew", "Olivia", "Alexander", "Emma", "Christopher", "Ava", "Andrew", "Mia"
]

LAST_NAMES = [
    "Verma", "Sharma", "Gupta", "Malhotra", "Kapoor", "Bhatia", "Chopra", "Mehta", "Singh", "Arora",
    "Patel", "Joshi", "Deshmukh", "Reddy", "Nair", "Iyer", "Banerjee", "Das", "Saxena", "Agarwal",
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson", "Anderson", "Taylor"
]

def generate_patient_record(i: int, rng: random.Random) -> Dict[str, Any]:
    gender = rng.choice(["Male", "Female", "Male", "Female"])
    age = int(rng.gauss(54, 14))
    age = max(21, min(89, age))

    first_name = rng.choice(FIRST_NAMES)
    last_name = rng.choice(LAST_NAMES)
    name = f"{first_name} {last_name}"
    pid = f"PT-{10000 + i}"

    # BMI with mild skew
    bmi = round(rng.gauss(27.4, 4.8), 1)
    bmi = max(18.2, min(48.5, bmi))

    # Blood Pressure (Systolic & Diastolic)
    systolic_bp = int(rng.gauss(132, 18))
    systolic_bp = max(95, min(198, systolic_bp))
    
    diastolic_bp = int(systolic_bp * 0.64 + rng.gauss(0, 5))
    diastolic_bp = max(60, min(118, diastolic_bp))

    # Cholesterol (mg/dL)
    cholesterol = int(rng.gauss(212, 36))
    cholesterol = max(130, min(340, cholesterol))

    # Fasting Glucose (mg/dL)
    glucose = int(rng.gauss(108, 32))
    glucose = max(70, min(290, glucose))

    # Heart Rate
    heart_rate = int(rng.gauss(74, 10))
    heart_rate = max(52, min(118, heart_rate))

    # Lifestyle indicators
    smoking_status = rng.choices(["Never", "Former", "Current"], weights=[0.55, 0.25, 0.20])[0]
    alcohol_intake = rng.choices(["None", "Moderate", "Heavy"], weights=[0.50, 0.40, 0.10])[0]
    activity_hours = round(max(0.0, rng.gauss(3.0, 2.2)), 1)
    activity_hours = min(15.0, activity_hours)

    family_hist = rng.choices(
        ["None", "Heart Disease", "Diabetes", "Stroke", "Multiple"],
        weights=[0.45, 0.22, 0.18, 0.10, 0.05]
    )[0]

    existing_conditions = []
    if systolic_bp >= 140 or diastolic_bp >= 90:
        existing_conditions.append("Hypertension")
    if cholesterol >= 240:
        existing_conditions.append("Hyperlipidemia")
    if glucose >= 126:
        existing_conditions.append("Type-2 Diabetes")
    if bmi >= 30.0:
        existing_conditions.append("Obesity")

    # Multi-disease probability approximations based on clinical calculators
    # Heart Disease risk
    hd_base = 0.05 + (age - 30) * 0.008 + (systolic_bp - 120) * 0.005 + (cholesterol - 180) * 0.003
    if smoking_status == "Current":
        hd_base += 0.22
    elif smoking_status == "Former":
        hd_base += 0.08
    if gender == "Male":
        hd_base += 0.06
    if family_hist in ["Heart Disease", "Multiple"]:
        hd_base += 0.14
    heart_risk = round(min(max(hd_base, 0.03), 0.96), 4)

    # Diabetes risk
    db_base = 0.04 + (glucose - 90) * 0.006 + (bmi - 23) * 0.015 + (age - 35) * 0.004
    if activity_hours < 2.0:
        db_base += 0.12
    if family_hist in ["Diabetes", "Multiple"]:
        db_base += 0.16
    diabetes_risk = round(min(max(db_base, 0.02), 0.95), 4)

    # Stroke risk
    str_base = 0.03 + (systolic_bp - 120) * 0.007 + (age - 45) * 0.007
    if smoking_status == "Current":
        str_base += 0.18
    if heart_risk > 0.60:
        str_base += 0.15
    if family_hist in ["Stroke", "Multiple"]:
        str_base += 0.12
    stroke_risk = round(min(max(str_base, 0.02), 0.94), 4)

    composite_risk = calculate_composite_risk(heart_risk, diabetes_risk, stroke_risk)
    risk_category = classify_risk_tier(composite_risk)

    days_offset = rng.randint(0, 2400) # Covers window from 2020 to 2026
    start_date = datetime(2020, 1, 1)
    record_date = (start_date + timedelta(days=days_offset)).strftime("%Y-%m-%d")

    return {
        "id": pid,
        "name": name,
        "age": age,
        "gender": gender,
        "bmi": bmi,
        "systolic_bp": systolic_bp,
        "diastolic_bp": diastolic_bp,
        "cholesterol": cholesterol,
        "glucose": glucose,
        "heart_rate": heart_rate,
        "smoking_status": smoking_status,
        "alcohol_intake": alcohol_intake,
        "physical_activity_hours": activity_hours,
        "family_history": family_hist,
        "existing_conditions": existing_conditions,
        "heart_disease_risk": heart_risk,
        "diabetes_risk": diabetes_risk,
        "stroke_risk": stroke_risk,
        "composite_risk": composite_risk,
        "risk_category": risk_category,
        "last_updated": record_date
    }

def initialize_dataset():
    global PATIENTS_STORE, HISTORY_STORE
    os.makedirs(DATA_DIR, exist_ok=True)

    if os.path.exists(PATIENTS_FILE):
        try:
            with open(PATIENTS_FILE, "r") as f:
                loaded = json.load(f)
            if len(loaded) == 10240:
                PATIENTS_STORE.clear()
                PATIENTS_STORE.extend(loaded)
                print(f"[DATA ENGINE] Loaded {len(PATIENTS_STORE)} records from {PATIENTS_FILE}")
            else:
                _generate_and_save_data()
        except Exception:
            _generate_and_save_data()
    else:
        _generate_and_save_data()

    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r") as f:
                hist = json.load(f)
            HISTORY_STORE.clear()
            HISTORY_STORE.extend(hist)
        except Exception:
            _seed_prediction_history()
    else:
        _seed_prediction_history()

def get_all_patients() -> List[Dict[str, Any]]:
    return PATIENTS_STORE

def _generate_and_save_data():
    global PATIENTS_STORE
    print("[DATA ENGINE] Generating authoritative dataset of 10,240 patient records...")
    rng = random.Random(42) # Reproducible seed
    records = [generate_patient_record(i, rng) for i in range(10240)]
    PATIENTS_STORE.clear()
    PATIENTS_STORE.extend(records)
    with open(PATIENTS_FILE, "w") as f:
        json.dump(PATIENTS_STORE, f)
    print(f"[DATA ENGINE] Successfully generated and stored 10,240 records to {PATIENTS_FILE}")

def _seed_prediction_history():
    global HISTORY_STORE
    HISTORY_STORE = []
    # Seed past 40 prediction runs from representative patients
    rng = random.Random(1337)
    sample_patients = rng.sample(PATIENTS_STORE, min(40, len(PATIENTS_STORE)))
    
    base_time = datetime(2026, 10, 7, 14, 30)
    for idx, p in enumerate(sample_patients):
        disease = rng.choice(["all", "heart_disease", "diabetes", "stroke"])
        if disease == "heart_disease":
            prob = p["heart_disease_risk"]
        elif disease == "diabetes":
            prob = p["diabetes_risk"]
        elif disease == "stroke":
            prob = p["stroke_risk"]
        else:
            prob = p["composite_risk"]

        margin = round(rng.uniform(0.04, 0.08), 3)
        ci_lower = max(0.01, round(prob - margin, 3))
        ci_upper = min(0.99, round(prob + margin, 3))

        ts = (base_time - timedelta(minutes=idx * 28)).strftime("%Y-%m-%d %H:%M:%S")

        HISTORY_STORE.append({
            "run_id": f"RUN-2026-{1000 + idx}",
            "timestamp": ts,
            "patient_id": p["id"],
            "patient_name": p["name"],
            "disease_target": disease,
            "probability": prob,
            "ci_lower": ci_lower,
            "ci_upper": ci_upper,
            "composite_risk": p["composite_risk"],
            "risk_category": p["risk_category"],
            "model_version": "RF-Champion-v2.4",
            "status": "Verified"
        })

    with open(HISTORY_FILE, "w") as f:
        json.dump(HISTORY_STORE, f, indent=2)

def get_patients_page(
    search: str = "",
    risk_category: str = "",
    sort_by: str = "composite_risk",
    order: str = "desc",
    offset: int = 0,
    limit: int = 25
) -> Tuple[List[Dict[str, Any]], int]:
    filtered = PATIENTS_STORE

    if search:
        s = search.lower().strip()
        filtered = [
            p for p in filtered
            if s in p["name"].lower() or s in p["id"].lower()
        ]

    if risk_category and risk_category.lower() != "all":
        filtered = [
            p for p in filtered
            if p["risk_category"].lower() == risk_category.lower()
        ]

    reverse = (order == "desc")
    try:
        filtered = sorted(filtered, key=lambda x: x.get(sort_by, 0), reverse=reverse)
    except Exception:
        pass

    total = len(filtered)
    page_items = filtered[offset : offset + limit]
    return page_items, total

def get_patient_by_id(patient_id: str) -> Optional[Dict[str, Any]]:
    for p in PATIENTS_STORE:
        if p["id"].lower() == patient_id.lower():
            return p
    return None

def add_new_patient(patient_data: Dict[str, Any]) -> Dict[str, Any]:
    global PATIENTS_STORE
    new_id = f"PT-{10000 + len(PATIENTS_STORE)}"
    patient_data["id"] = new_id
    patient_data["last_updated"] = datetime.now().strftime("%Y-%m-%d")

    # Calculate risks
    comp = calculate_composite_risk(
        patient_data.get("heart_disease_risk", 0.1),
        patient_data.get("diabetes_risk", 0.1),
        patient_data.get("stroke_risk", 0.1)
    )
    patient_data["composite_risk"] = comp
    patient_data["risk_category"] = classify_risk_tier(comp)

    PATIENTS_STORE.insert(0, patient_data)
    with open(PATIENTS_FILE, "w") as f:
        json.dump(PATIENTS_STORE, f)
    return patient_data

def get_data_quality_audit() -> DataQualityAuditResponse:
    total = len(PATIENTS_STORE)
    
    # 1. Duplicate check
    ids = [p["id"] for p in PATIENTS_STORE]
    duplicate_count = len(ids) - len(set(ids))

    # 2. Missing IDs
    missing_ids = sum(1 for p in PATIENTS_STORE if not p.get("id"))

    # Range checks
    def evaluate_check(name, field, r_min, r_max, category):
        compliant = sum(1 for p in PATIENTS_STORE if r_min <= p.get(field, 0) <= r_max)
        violations = total - compliant
        rate = round((compliant / total) * 100, 2)
        return DataQualityCheck(
            check_name=name,
            category=category,
            target_field=field,
            expected_range=f"[{r_min} - {r_max}]",
            total_checked=total,
            compliant_records=compliant,
            violation_count=violations,
            compliance_rate=rate,
            status="Passed" if violations == 0 else ("Warning" if rate >= 98.0 else "Failed")
        )

    checks = [
        evaluate_check("Systolic Blood Pressure Bounds", "systolic_bp", 70, 240, "Clinical Vitals"),
        evaluate_check("Diastolic Blood Pressure Bounds", "diastolic_bp", 40, 140, "Clinical Vitals"),
        evaluate_check("Serum Total Cholesterol Bounds", "cholesterol", 100, 400, "Laboratory"),
        evaluate_check("Fasting Plasma Glucose Bounds", "glucose", 50, 350, "Laboratory"),
        evaluate_check("Body Mass Index (BMI) Bounds", "bmi", 12.0, 65.0, "Biometrics"),
        evaluate_check("Patient Age Validity", "age", 18, 110, "Demographics"),
        evaluate_check("Resting Heart Rate Bounds", "heart_rate", 40, 200, "Clinical Vitals"),
        evaluate_check("Physical Activity Weekly Hours", "physical_activity_hours", 0.0, 30.0, "Lifestyle"),
    ]

    passed_count = sum(1 for c in checks if c.status == "Passed")
    overall_health = round((passed_count / len(checks)) * 100, 1)

    return DataQualityAuditResponse(
        total_records=total,
        coverage_start="2020-01-01",
        coverage_end="2026-10-07",
        duplicate_collisions=duplicate_count,
        missing_identifiers=missing_ids,
        overall_health_score=overall_health,
        passed_checks=passed_count,
        total_checks=len(checks),
        last_audit_run="2026-10-07 18:45:00 UTC",
        checks=checks
    )

def add_prediction_history_record(rec: Dict[str, Any]):
    global HISTORY_STORE
    HISTORY_STORE.insert(0, rec)
    try:
        with open(HISTORY_FILE, "w") as f:
            json.dump(HISTORY_STORE, f, indent=2)
    except Exception:
        pass

def get_prediction_history(limit: int = 50) -> List[PredictionHistoryRecord]:
    return [PredictionHistoryRecord(**h) for h in HISTORY_STORE[:limit]]
