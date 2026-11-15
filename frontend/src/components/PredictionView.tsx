import React, { useState } from 'react';
import { 
  HeartPulse, 
  Send, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  FileText,
  UserCheck,
  CheckCircle2,
  Stethoscope,
  Printer
} from 'lucide-react';
import { Patient, PredictionResponse } from '../types';
import { predictRisk } from '../api';

interface PredictionViewProps {
  initialPatient?: Patient | null;
  onPredictionComplete?: (res: PredictionResponse) => void;
}

export const PredictionView: React.FC<PredictionViewProps> = ({
  initialPatient,
  onPredictionComplete
}) => {
  const [formData, setFormData] = useState({
    patient_id: initialPatient?.id || 'MRN-84920',
    patient_name: initialPatient?.name || 'Marcus Vance (Inpatient)',
    age: initialPatient?.age || 58,
    gender: initialPatient?.gender || 'Male',
    bmi: initialPatient?.bmi || 29.4,
    systolic_bp: initialPatient?.systolic_bp || 152,
    diastolic_bp: initialPatient?.diastolic_bp || 94,
    cholesterol: initialPatient?.cholesterol || 254,
    glucose: initialPatient?.glucose || 142,
    heart_rate: initialPatient?.heart_rate || 78,
    smoking_status: initialPatient?.smoking_status || 'Current',
    alcohol_intake: initialPatient?.alcohol_intake || 'Moderate',
    physical_activity_hours: initialPatient?.physical_activity_hours || 1.5,
    family_history: initialPatient?.family_history || 'Heart Disease',
    disease_target: 'all'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [authorized, setAuthorized] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['age', 'bmi', 'systolic_bp', 'diastolic_bp', 'cholesterol', 'glucose', 'heart_rate', 'physical_activity_hours'].includes(name)
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleRunPrediction = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setAuthorized(false);
    try {
      const resp = await predictRisk(formData);
      setResult(resp);
      if (onPredictionComplete) onPredictionComplete(resp);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'High':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Moderate':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-tab-switch">
      {/* Page Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Clinical Assessment &amp; Diagnostic Orders
            </h1>
            <span className="px-3 py-0.5 text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-full">
              Automated Triage
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Accepts real-time patient biometrics, executes calibrated multi-target inference, and derives 95% statistical confidence bounds.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700">
          <Clock className="w-4 h-4 text-sky-400" />
          <span>Active Champion Engine: <strong className="text-white">Random Forest v2.4</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Clinical Parameters (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center">
              <UserCheck className="w-4 h-4 mr-2 text-sky-400" />
              <span>Patient Clinical Data Inputs</span>
            </h2>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  patient_id: 'MRN-84920',
                  patient_name: 'Marcus Vance (Inpatient)',
                  age: 58,
                  gender: 'Male',
                  bmi: 29.4,
                  systolic_bp: 152,
                  diastolic_bp: 94,
                  cholesterol: 254,
                  glucose: 142,
                  heart_rate: 78,
                  smoking_status: 'Current',
                  alcohol_intake: 'Moderate',
                  physical_activity_hours: 1.5,
                  family_history: 'Heart Disease',
                  disease_target: 'all'
                });
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Reset Standards</span>
            </button>
          </div>

          <form onSubmit={handleRunPrediction} className="space-y-4 text-xs">
            {/* MRN & Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Medical Record # (MRN)</label>
                <input
                  type="text"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Target condition selection */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Target Assessment Diagnostic</label>
              <select
                name="disease_target"
                value={formData.disease_target}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl font-bold text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="all">Composite Multi-Condition (Heart + Diabetes + Stroke)</option>
                <option value="heart_disease">Heart Disease (Coronary CAD - 40% Weight)</option>
                <option value="diabetes">Type-2 Diabetes Mellitus (35% Weight)</option>
                <option value="stroke">Cerebrovascular Stroke (25% Weight)</option>
              </select>
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Age (Years)</label>
                <input
                  type="number"
                  name="age"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">BMI (kg/m²)</label>
                <input
                  type="number"
                  step="0.1"
                  name="bmi"
                  min="12"
                  max="60"
                  value={formData.bmi}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>

            {/* Blood Pressure */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  name="systolic_bp"
                  min="70"
                  max="240"
                  value={formData.systolic_bp}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  name="diastolic_bp"
                  min="40"
                  max="140"
                  value={formData.diastolic_bp}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>
            </div>

            {/* Labs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Total Cholesterol (mg/dL)</label>
                <input
                  type="number"
                  name="cholesterol"
                  min="100"
                  max="400"
                  value={formData.cholesterol}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Fasting Glucose (mg/dL)</label>
                <input
                  type="number"
                  name="glucose"
                  min="50"
                  max="350"
                  value={formData.glucose}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>
            </div>

            {/* Lifestyle */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tobacco Status</label>
                <select
                  name="smoking_status"
                  value={formData.smoking_status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white cursor-pointer"
                >
                  <option value="Never">Never</option>
                  <option value="Former">Former</option>
                  <option value="Current">Current</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Alcohol</label>
                <select
                  name="alcohol_intake"
                  value={formData.alcohol_intake}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white cursor-pointer"
                >
                  <option value="None">None</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Heavy">Heavy</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Activity (hrs/wk)</label>
                <input
                  type="number"
                  step="0.5"
                  name="physical_activity_hours"
                  min="0"
                  max="25"
                  value={formData.physical_activity_hours}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>

            {/* Family History */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Hereditary Clinical Preposition</label>
              <select
                name="family_history"
                value={formData.family_history}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white cursor-pointer"
              >
                <option value="None">None Documented</option>
                <option value="Heart Disease">Cardiovascular Disease (CAD)</option>
                <option value="Diabetes">Type-2 Diabetes Mellitus</option>
                <option value="Stroke">Cerebrovascular Stroke</option>
                <option value="Multiple">Multiple Chronic Syndromes</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white rounded-xl font-black text-xs shadow-xl shadow-sky-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Computing Multi-Condition Pathological Inference...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Generate Risk Assessment &amp; Clinical Orders</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Clinical Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !loading && (
            <div className="bg-slate-900/90 p-12 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center text-slate-400 min-h-[460px]">
              <HeartPulse className="w-16 h-16 text-sky-400/40 mb-4 animate-pulse" />
              <h3 className="text-lg font-bold text-white">Diagnostic Inference Engine Ready</h3>
              <p className="text-xs text-slate-400 max-w-md mt-1.5 leading-relaxed">
                Provide patient clinical parameters and execute prediction to generate calibrated probabilities, statistical 95% confidence bounds, and physician action directives.
              </p>
              <button
                onClick={() => handleRunPrediction()}
                className="mt-6 px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/20 cursor-pointer"
              >
                Load Sample Clinical Case
              </button>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Primary Score Card */}
              <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Patient Risk Dossier
                    </span>
                    <h2 className="text-xl font-black text-white mt-0.5">
                      {result.patient_name} <span className="text-xs text-sky-400 font-mono font-normal">({result.patient_id})</span>
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getTierBadge(result.risk_category)}`}>
                      {result.risk_category} Priority Tier
                    </span>
                    <span className="text-[11px] text-slate-400 bg-slate-800 px-3 py-1 rounded-full font-mono border border-slate-700">
                      {result.model_version}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                  {/* Gauge */}
                  <div className="sm:col-span-1 flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-800"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={result.risk_category === 'Critical' ? 'text-rose-500' : result.risk_category === 'High' ? 'text-amber-500' : 'text-teal-400'}
                          strokeDasharray={`${result.primary_probability * 100}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-black text-white">
                          {(result.primary_probability * 100).toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">Risk Score</span>
                      </div>
                    </div>
                  </div>

                  {/* 95% Confidence Interval & Summary */}
                  <div className="sm:col-span-2 space-y-3">
                    <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                        <span>95% Statistical Confidence Bounds</span>
                        <span className="font-mono text-sky-400 font-bold">
                          [{(result.primary_ci.lower * 100).toFixed(1)}% — {(result.primary_ci.upper * 100).toFixed(1)}%]
                        </span>
                      </div>
                      <div className="mt-2 w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-teal-400 rounded-full"
                          style={{
                            marginLeft: `${result.primary_ci.lower * 100}%`,
                            width: `${(result.primary_ci.upper - result.primary_ci.lower) * 100}%`
                          }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        Statistically bounded via binomial ensemble variance across bootstrap feature bagging.
                      </p>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
                      <strong className="text-white">Attending Note: </strong>
                      {result.explainable_summary}
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Disease Targets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {Object.entries(result.diseases).map(([key, detail]) => (
                  <div key={key} className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
                    <div className="text-xs font-bold text-slate-300">{detail.disease}</div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-xl font-black text-white">
                        {(detail.probability * 100).toFixed(1)}%
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${getTierBadge(detail.risk_category)}`}>
                        {detail.risk_category}
                      </span>
                    </div>
                    <div className="mt-1 text-[10px] text-slate-400 font-mono">
                      95% CI: [{(detail.confidence_interval.lower * 100).toFixed(0)}%–{(detail.confidence_interval.upper * 100).toFixed(0)}%]
                    </div>
                  </div>
                ))}
              </div>

              {/* Contributing Clinical Factors */}
              <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-3.5 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-teal-400" />
                  <span>Explainable Decision Audit — Clinical Factor Attribution</span>
                </h3>
                <div className="space-y-2.5">
                  {result.contributing_factors.map((cf, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <strong className="text-white">{cf.factor}:</strong>
                          <span className="font-mono text-sky-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                            {cf.value}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{cf.clinical_note}</p>
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            cf.impact_weight > 0
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {cf.impact_weight > 0 ? `+${(cf.impact_weight * 100).toFixed(0)}% Risk Impact` : `${(cf.impact_weight * 100).toFixed(0)}% Protective`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Clinical Recommendations & Physician Sign-off */}
              <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-sky-400" />
                    <span>Physician Clinical Directives &amp; Action Orders</span>
                  </h3>
                  <button
                    onClick={() => setAuthorized(true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{authorized ? 'Orders Authorized & Synced' : 'Authorize & Sign Orders'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {result.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border text-xs ${
                        rec.type === 'urgent'
                          ? 'bg-rose-950/20 border-rose-900/50 text-rose-200'
                          : rec.type === 'clinical'
                          ? 'bg-amber-950/20 border-amber-900/50 text-amber-200'
                          : 'bg-sky-950/20 border-sky-900/50 text-sky-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-white">{rec.title}</h4>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-900/80 rounded-md border border-current">
                          {rec.timeframe}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                        {rec.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
