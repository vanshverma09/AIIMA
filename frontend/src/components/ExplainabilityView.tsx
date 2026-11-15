import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Activity,
  AlertOctagon,
  AlertTriangle
} from 'lucide-react';
import { Patient } from '../types';

interface ExplainabilityViewProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

export const ExplainabilityView: React.FC<ExplainabilityViewProps> = ({
  patients,
  onSelectPatient
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('Critical');

  const filteredPatients = patients.filter(
    (p) => selectedFilter === 'All' || p.risk_category === selectedFilter
  );

  return (
    <div className="space-y-8 pb-16 animate-tab-switch">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Physician AI Audit &amp; Decision Explainability
            </h1>
            <span className="px-3 py-0.5 text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
              Explainable AI (XAI)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Algorithmic feature attribution, clinical rationales, and underlying comorbidity pathology for attending physician sign-off.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
          {['Critical', 'High', 'Moderate', 'Low', 'All'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                selectedFilter === tab
                  ? 'bg-sky-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Decision Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.slice(0, 12).map((patient) => {
          const isCritical = patient.risk_category === 'Critical';
          const isHigh = patient.risk_category === 'High';

          return (
            <div
              key={patient.id}
              className={`bg-slate-900/90 rounded-3xl border p-6 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01] ${
                isCritical
                  ? 'border-rose-900/60 hover:border-rose-700/80 bg-rose-950/10'
                  : isHigh
                  ? 'border-amber-900/50 hover:border-amber-700/80 bg-amber-950/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{patient.name}</h3>
                    <p className="text-xs text-sky-400 font-mono">MRN: {patient.id} · {patient.age}y · {patient.gender}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : isHigh
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {patient.risk_category} ({(patient.composite_risk * 100).toFixed(1)}%)
                  </span>
                </div>

                {/* Biometric Snapshot */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">BP</span>
                    <strong className={patient.systolic_bp >= 140 ? 'text-rose-400' : 'text-slate-200'}>
                      {patient.systolic_bp}/{patient.diastolic_bp}
                    </strong>
                  </div>
                  <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">CHOL</span>
                    <strong className={patient.cholesterol >= 240 ? 'text-amber-400' : 'text-slate-200'}>
                      {patient.cholesterol}
                    </strong>
                  </div>
                  <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">GLUCOSE</span>
                    <strong className={patient.glucose >= 126 ? 'text-rose-400' : 'text-slate-200'}>
                      {patient.glucose}
                    </strong>
                  </div>
                </div>

                {/* Explainable Reasoning Statement */}
                <div className="mt-4 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <div className="flex items-center space-x-1.5 text-white font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>Clinical Reasoning Attribution:</span>
                  </div>
                  <p>
                    {patient.systolic_bp >= 140 && `Elevated BP (${patient.systolic_bp}/${patient.diastolic_bp} mmHg) `}
                    {patient.cholesterol >= 220 && `combined with hypercholesterolemia (${patient.cholesterol} mg/dL) `}
                    {patient.smoking_status === 'Current' && `and active tobacco smoking `}
                    {patient.glucose >= 120 && `with glycemic elevation (${patient.glucose} mg/dL) `}
                    contributes directly to a {patient.risk_category.toLowerCase()} risk classification.
                    {isCritical && " Immediate medical intervention indicated to avoid acute cardiac or cerebrovascular event."}
                  </p>
                </div>

                {/* Condition Breakdown Bars */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Heart CAD Risk:</span>
                    <strong className="text-white">{(patient.heart_disease_risk * 100).toFixed(1)}%</strong>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${patient.heart_disease_risk * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Type-2 Diabetes Risk:</span>
                    <strong className="text-white">{(patient.diabetes_risk * 100).toFixed(1)}%</strong>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${patient.diabetes_risk * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {patient.smoking_status === 'Current' ? 'Active Tobacco' : 'Non-Smoker'} · BMI {patient.bmi}
                </span>
                <button
                  onClick={() => onSelectPatient(patient)}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center space-x-1 cursor-pointer"
                >
                  <span>Review Clinical Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
