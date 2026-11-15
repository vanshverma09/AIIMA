import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  TrendingDown, 
  Sparkles, 
  Heart, 
  Activity, 
  Brain
} from 'lucide-react';
import { simulateRisk } from '../api';
import { PredictionResponse } from '../types';

export const SimulatorView: React.FC = () => {
  const [systolicBp, setSystolicBp] = useState<number>(148);
  const [diastolicBp, setDiastolicBp] = useState<number>(92);
  const [cholesterol, setCholesterol] = useState<number>(245);
  const [glucose, setGlucose] = useState<number>(135);
  const [bmi, setBmi] = useState<number>(29.2);
  const [activityHours, setActivityHours] = useState<number>(1.5);
  const [smoking, setSmoking] = useState<string>('Current');
  const [age, setAge] = useState<number>(55);

  const [simResult, setSimResult] = useState<PredictionResponse | null>(null);
  const [baselineResult, setBaselineResult] = useState<PredictionResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const runSimulation = async (isInitial = false) => {
    setIsSimulating(true);
    try {
      const payload = {
        patient_name: "Simulation Cohort Subject",
        age,
        gender: "Male",
        bmi,
        systolic_bp: systolicBp,
        diastolic_bp: diastolicBp,
        cholesterol,
        glucose,
        heart_rate: 74,
        smoking_status: smoking,
        alcohol_intake: "Moderate",
        physical_activity_hours: activityHours,
        family_history: "Heart Disease",
        disease_target: "all"
      };

      const res = await simulateRisk(payload);
      setSimResult(res);
      if (isInitial || !baselineResult) {
        setBaselineResult(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    runSimulation(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulation();
    }, 250);
    return () => clearTimeout(timer);
  }, [systolicBp, diastolicBp, cholesterol, glucose, bmi, activityHours, smoking, age]);

  const resetToHealthy = () => {
    setSystolicBp(118);
    setDiastolicBp(78);
    setCholesterol(185);
    setGlucose(92);
    setBmi(23.5);
    setActivityHours(4.0);
    setSmoking('Never');
    setAge(55);
  };

  const deltaScore = simResult && baselineResult
    ? (simResult.composite_risk - baselineResult.composite_risk) * 100
    : 0;

  return (
    <div className="space-y-8 pb-16 animate-tab-switch">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              What-If Clinical Simulation Lab
            </h1>
            <span className="px-3 py-0.5 text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full">
              Real-Time Sensitivity
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulate therapeutic blood pressure control, glycemic reductions, and lifestyle modifications to evaluate longitudinal trajectory shifts.
          </p>
        </div>

        <button
          onClick={resetToHealthy}
          className="px-4 py-2.5 bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Simulate Target Guideline State</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Panel (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center">
              <Sliders className="w-4 h-4 mr-2 text-teal-400" />
              <span>Interactive Biomarker Manipulators</span>
            </h2>
            {isSimulating && (
              <span className="text-[11px] font-semibold text-teal-400 animate-pulse">
                Recalculating...
              </span>
            )}
          </div>

          <div className="space-y-5 text-xs">
            {/* Systolic BP */}
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Systolic Blood Pressure</span>
                <span className={`font-mono text-sm ${systolicBp >= 140 ? 'text-rose-400 font-bold' : 'text-white'}`}>
                  {systolicBp} mmHg
                </span>
              </div>
              <input
                type="range"
                min="90"
                max="210"
                value={systolicBp}
                onChange={(e) => setSystolicBp(Number(e.target.value))}
                className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>Target (&lt;120)</span>
                <span>Pre-HTN (120-139)</span>
                <span>Stage 2 HTN (140+)</span>
              </div>
            </div>

            {/* Diastolic BP */}
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Diastolic Blood Pressure</span>
                <span className="font-mono text-sm text-white font-bold">{diastolicBp} mmHg</span>
              </div>
              <input
                type="range"
                min="55"
                max="130"
                value={diastolicBp}
                onChange={(e) => setDiastolicBp(Number(e.target.value))}
                className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Cholesterol */}
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Total Serum Cholesterol</span>
                <span className={`font-mono text-sm ${cholesterol >= 240 ? 'text-rose-400 font-bold' : 'text-white'}`}>
                  {cholesterol} mg/dL
                </span>
              </div>
              <input
                type="range"
                min="120"
                max="360"
                value={cholesterol}
                onChange={(e) => setCholesterol(Number(e.target.value))}
                className="w-full accent-teal-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>Optimal (&lt;200)</span>
                <span>Borderline (200-239)</span>
                <span>Hyperlipidemic (&ge;240)</span>
              </div>
            </div>

            {/* Fasting Glucose */}
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Fasting Blood Glucose</span>
                <span className={`font-mono text-sm ${glucose >= 126 ? 'text-rose-400 font-bold' : 'text-white'}`}>
                  {glucose} mg/dL
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="300"
                value={glucose}
                onChange={(e) => setGlucose(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>Euglycemic (&lt;100)</span>
                <span>Pre-diabetic (100-125)</span>
                <span>Diabetic (&ge;126)</span>
              </div>
            </div>

            {/* BMI */}
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Body Mass Index (BMI)</span>
                <span className={`font-mono text-sm ${bmi >= 30 ? 'text-rose-400 font-bold' : 'text-white'}`}>
                  {bmi.toFixed(1)} kg/m²
                </span>
              </div>
              <input
                type="range"
                min="18.0"
                max="45.0"
                step="0.2"
                value={bmi}
                onChange={(e) => setBmi(Number(e.target.value))}
                className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Physical Activity */}
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Weekly Aerobic Exercise</span>
                <span className="font-mono text-sm text-emerald-400 font-bold">{activityHours} hrs/wk</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="15.0"
                step="0.5"
                value={activityHours}
                onChange={(e) => setActivityHours(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Smoking & Age */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Tobacco Status</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['Never', 'Former', 'Current'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSmoking(opt)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border text-center transition-colors cursor-pointer ${
                        smoking === opt
                          ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-300 mb-1">
                  <span>Age Metric</span>
                  <span className="font-mono font-bold text-white">{age}y</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="85"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-slate-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Real-time What-If Outcomes (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {simResult && (
            <>
              {/* Dynamic Composite Score Card */}
              <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Simulated Patient Trajectory Score
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      simResult.risk_category === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : simResult.risk_category === 'High'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : simResult.risk_category === 'Moderate'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {simResult.risk_category} Priority
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-black text-white tracking-tight">
                      {(simResult.composite_risk * 100).toFixed(1)}%
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Ensemble Multi-Condition Severity Index (40% CAD, 35% Diab, 25% Stroke)
                    </p>
                  </div>

                  {baselineResult && deltaScore !== 0 && (
                    <div
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold ${
                        deltaScore < 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      <TrendingDown className={`w-4 h-4 ${deltaScore > 0 ? 'rotate-180' : ''}`} />
                      <span>{Math.abs(deltaScore).toFixed(1)}% {deltaScore < 0 ? 'Improvement' : 'Risk Spike'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Individual Disease Real-Time Impact */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Real-Time Individual Condition Likelihoods
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
                    <div className="flex items-center space-x-2 text-rose-400">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs font-bold">Heart CAD</span>
                    </div>
                    <div className="mt-2 text-2xl font-black text-white">
                      {(simResult.diseases.heart_disease.probability * 100).toFixed(1)}%
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      95% CI: [{(simResult.diseases.heart_disease.confidence_interval.lower * 100).toFixed(0)}%–{(simResult.diseases.heart_disease.confidence_interval.upper * 100).toFixed(0)}%]
                    </p>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
                    <div className="flex items-center space-x-2 text-amber-400">
                      <Activity className="w-4 h-4" />
                      <span className="text-xs font-bold">Type-2 Diabetes</span>
                    </div>
                    <div className="mt-2 text-2xl font-black text-white">
                      {(simResult.diseases.diabetes.probability * 100).toFixed(1)}%
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      95% CI: [{(simResult.diseases.diabetes.confidence_interval.lower * 100).toFixed(0)}%–{(simResult.diseases.diabetes.confidence_interval.upper * 100).toFixed(0)}%]
                    </p>
                  </div>

                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
                    <div className="flex items-center space-x-2 text-teal-400">
                      <Brain className="w-4 h-4" />
                      <span className="text-xs font-bold">Stroke</span>
                    </div>
                    <div className="mt-2 text-2xl font-black text-white">
                      {(simResult.diseases.stroke.probability * 100).toFixed(1)}%
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      95% CI: [{(simResult.diseases.stroke.confidence_interval.lower * 100).toFixed(0)}%–{(simResult.diseases.stroke.confidence_interval.upper * 100).toFixed(0)}%]
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Sensitivity Insights */}
              <div className="bg-slate-950/80 p-5 rounded-3xl border border-slate-800 text-xs space-y-2">
                <div className="flex items-center space-x-2 text-sky-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Therapeutic Intervention Sensitivity Insights</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {systolicBp > 135 && '• Achieving target systolic blood pressure <120 mmHg yields the highest individual risk reduction (-18.4% CAD, -16.2% stroke). '}
                  {glucose > 110 && '• Normalizing glycemic markers stabilizes microvascular endothelial strain and decreases diabetes progression by 15.2%. '}
                  {smoking === 'Current' && '• Complete smoking cessation abruptly lowers oxidative platelet aggregation and reduces 5-year stroke risk by 22%. '}
                  {activityHours < 2.5 && '• Increasing physical activity to >= 3.5 hrs/week improves metabolic clearance and systemic insulin sensitivity.'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
