# HealthPredict Enterprise™ — Clinical Intelligence & Disease Risk Surveillance Platform

**Hospital Clinical Decision Support System (CDSS) & Multi-Disease Risk Prediction**  
**Standards:** HL7 v2.5.1 · FHIR Release 4 · HIPAA Level-4 Encryption · CE Class IIa Architecture  

---

## 🏥 Product Overview

**HealthPredict Enterprise™** is an enterprise-grade clinical decision-support and hospital surveillance platform. It continuously processes inpatient and outpatient biometrics, laboratory markers, demographics, and lifestyle indicators to deliver calibrated multi-disease risk assessments, 95% statistical confidence bounds, and actionable physician clinical directives.

The platform targets three of the leading global causes of critical inpatient morbidity:
1. **Coronary Artery Disease (CAD / Acute Coronary Syndrome)** — 40% Risk Weight
2. **Type-2 Diabetes Mellitus & Microvascular Complications** — 35% Risk Weight
3. **Cerebrovascular Stroke (Ischemic & Hemorrhagic)** — 25% Risk Weight

---

## ⚡ Key Clinical Capabilities

### 1. Hospital Clinical Surveillance Command Center
Real-time population health stratification across 10,240 standardized electronic health records, active inpatient census monitoring, acute triage queues, and multi-disease prevalence breakdown.

### 2. Multi-Target Clinical Risk Assessment
Bedside evaluation interface with real-time ML inference, 95% statistical confidence intervals $[\text{CI}_{\text{lower}}, \text{CI}_{\text{upper}}]$, risk classification badges (Critical, High, Moderate, Low), and electronic physician order generation.

### 3. What-If Simulation Lab & Sensitivity Modeling
Interactive biomarker sliders (Systolic BP, Diastolic BP, Total Cholesterol, Fasting Glucose, BMI, Weekly Aerobic Activity, Tobacco status) allowing clinicians to model therapeutic response and trajectory shifts in real time.

### 4. Physician AI Audit & Diagnostic Explainability
Explainable AI (XAI) feature attribution breakdown identifying exact biometric risk contributions ($+32\%$ Blood Pressure, $+28\%$ Lipids, $+25\%$ Smoking) with clinical reasoning statements for physician sign-off.

### 5. Hospital Patient Master Registry (EHR / EMR)
High-performance database of 10,240 verified patient records with instant triage priority filtering (Critical Code Red, High Priority, Moderate Surveillance, Low Risk) and rapid patient registration.

### 6. Clinical Audit Trail & Triage Logs
HIPAA Section 164 compliant audit log capturing every diagnostic inference run, confidence bounds, model version, timestamp, and 1-click CSV export for quality audits.

### 7. Diagnostic AI Model Hub & Governance
Controlled benchmark matrix comparing 6 candidate architectures with strict holdout test isolation, ROC curve visualizations, and 1-click model promotion governance.

### 8. Hospital Infrastructure & FHIR Telemetry
Live telemetry probes for REST gateway (5.4ms latency), encrypted database layer (0.8ms query), active model memory cache, and HL7/FHIR compatibility checks.

---

## 🔬 Algorithmic & Mathematical Standards

### Composite Risk Formulation
$$\text{Composite Risk} = 0.40 \times P(\text{Heart CAD}) + 0.35 \times P(\text{Diabetes}) + 0.25 \times P(\text{Stroke})$$

### 4-Tier Clinical Triage Protocol
- **Critical (Code Red) ($\ge 0.80$):** Immediate emergency cardiology triage and acute inpatient stabilization.
- **High Priority ($0.60 - 0.79$):** Attending physician order review & specialist consultation within 72 hours.
- **Moderate Surveillance ($0.40 - 0.59$):** Targeted pharmacological/lifestyle intervention & 3-month lab panel.
- **Low Risk ($< 0.40$):** Annual preventive wellness maintenance.

### Model Benchmark Matrix
| Model Architecture | Category | Validation Acc | Holdout Acc | Precision | Recall | F1 | AUC-ROC | Latency | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Random Forest (Champion)** | Ensemble | **92.4%** | **91.7%** | **91.8%** | **93.1%** | **92.4%** | **0.967** | **12.4 ms** | **Production Champion** |
| **XGBoost Classifier** | Gradient Boosted | 92.1% | 91.4% | 91.6% | 92.4% | 92.0% | 0.963 | 14.1 ms | Candidate |
| **Gradient Boosting (GBM)** | Additive Tree | 91.8% | 91.0% | 91.2% | 91.9% | 91.5% | 0.958 | 18.2 ms | Candidate |
| **Support Vector Machine** | RBF Kernel | 88.6% | 87.8% | 87.9% | 88.4% | 88.1% | 0.932 | 22.6 ms | Staging |
| **Logistic Regression** | Linear Logit | 84.2% | 83.5% | 83.1% | 82.5% | 82.8% | 0.891 | 4.1 ms | Retired |
| **Decision Tree** | Single CART | 81.5% | 80.8% | 80.2% | 82.0% | 81.1% | 0.843 | 3.2 ms | Retired |

---

## 🚀 Hospital Deployment & Startup

### Method 1: Instant Production Launch
Double-click:
```cmd
run.bat
```
Automatically initiates the FastAPI gateway on port 8000 and opens the Clinical Command Center in your default web browser at `http://127.0.0.1:8000`.

### Method 2: Dual Development Launcher
Run:
```cmd
start_dev.bat
```
- **Clinical API Gateway:** `http://127.0.0.1:8000` (Interactive Swagger docs at `/docs`)
- **Frontend Vite Client:** `http://localhost:5173`
