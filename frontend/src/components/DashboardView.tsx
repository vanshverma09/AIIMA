import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  AlertOctagon, 
  Activity, 
  Award, 
  ArrowUpRight, 
  ChevronRight, 
  Heart, 
  Brain, 
  TrendingUp,
  ShieldCheck,
  Stethoscope,
  Building,
  FileSpreadsheet
} from 'lucide-react';
import { DashboardAnalytics, Patient } from '../types';
import { NavTab } from './Navbar';

interface DashboardViewProps {
  data: DashboardAnalytics | null;
  loading: boolean;
  onNavigate: (tab: NavTab) => void;
  onSelectPatient: (patient: Patient) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  loading,
  onNavigate,
  onSelectPatient
}) => {
  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-300 font-semibold tracking-wide">
          Aggregating real-time hospital surveillance analytics across 10,240 active patient records...
        </p>
      </div>
    );
  }

  const { kpis, risk_distribution, disease_overview, critical_alerts } = data;

  return (
    <div className="space-y-8 pb-16 animate-tab-switch">
      {/* Hospital Surveillance Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl backdrop-blur-sm">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Hospital Surveillance &amp; Command Center
            </h1>
            <span className="px-2.5 py-1 text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Inpatient &amp; Outpatient Stream</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Automated multi-condition risk stratification · CMS &amp; Joint Commission Quality Benchmark Standard
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('prediction')}
            className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/20 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Run Bedside Triage</span>
          </button>
          <button
            onClick={() => onNavigate('patients')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4 text-sky-400" />
            <span>All 10,240 EHR Profiles</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Census */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Patient Census</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">{kpis.total_patients.toLocaleString()}</div>
            <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>Standardized EHR Cohort</span>
            </p>
          </div>
        </div>

        {/* High Risk Cohort */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-amber-900/40 shadow-lg bg-amber-950/10">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">High Risk Cohort</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-amber-400">{kpis.high_risk_count.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1">
              {((kpis.high_risk_count / kpis.total_patients) * 100).toFixed(1)}% of Census (0.60–0.80)
            </p>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-rose-900/60 shadow-lg bg-rose-950/20">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-bold uppercase tracking-wider">Code Red Alerts</span>
            <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-rose-400">{kpis.critical_risk_count.toLocaleString()}</div>
            <p className="text-xs text-rose-300 font-semibold mt-1">
              Score &ge; 0.80 · Emergency Protocol
            </p>
          </div>
        </div>

        {/* Champion Model Accuracy */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Clinical AI Precision</span>
            <Award className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-teal-400">{kpis.champion_model_accuracy}%</div>
            <p className="text-xs text-slate-400 mt-1">
              Validation AUC: <strong className="text-slate-200">0.967</strong> (RF Ensemble)
            </p>
          </div>
        </div>

        {/* Severity Index */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Mean Risk Index</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-indigo-400">{kpis.average_risk_score}</div>
            <p className="text-xs text-slate-400 mt-1">
              Population Composite Median
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 4-Tier Population Risk Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Hospital-Wide 4-Tier Severity Stratification</h2>
              <p className="text-xs text-slate-400 mt-0.5">Clinical triage distribution based on continuous probability integration</p>
            </div>
            <span className="text-xs font-semibold text-sky-400 bg-sky-950/80 px-3 py-1 rounded-full border border-sky-800/40">
              Census: {kpis.total_patients.toLocaleString()}
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {risk_distribution.map((item) => (
              <div key={item.tier} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    {item.tier} Priority Tier ({item.tier === 'Critical' ? 'Score ≥ 0.80' : item.tier === 'High' ? '0.60 – 0.80' : item.tier === 'Moderate' ? '0.40 – 0.60' : '< 0.40'})
                  </span>
                  <span className="text-white font-bold">
                    {item.count.toLocaleString()} patients ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-5 border-t border-slate-800 grid grid-cols-4 gap-2.5 text-center text-xs">
            <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-900/50 text-rose-300">
              <div className="font-extrabold text-sm">Critical</div>
              <div className="text-[10px] text-rose-400 mt-0.5">Immediate Inpatient / ICU</div>
            </div>
            <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-900/50 text-amber-300">
              <div className="font-extrabold text-sm">High</div>
              <div className="text-[10px] text-amber-400 mt-0.5">Specialist Order &lt; 72h</div>
            </div>
            <div className="p-3 rounded-2xl bg-yellow-950/30 border border-yellow-900/50 text-yellow-300">
              <div className="font-extrabold text-sm">Moderate</div>
              <div className="text-[10px] text-yellow-400 mt-0.5">3-Month Outpatient Lab</div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-900/50 text-emerald-300">
              <div className="font-extrabold text-sm">Low</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Standard Maintenance</div>
            </div>
          </div>
        </div>

        {/* Multi-Disease Target Prevalence (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-white">Multi-Disease Pathological Prevalence</h2>
                <p className="text-xs text-slate-400 mt-0.5">Average predicted risk % &amp; elevated patient volumes</p>
              </div>
            </div>

            <div className="space-y-4">
              {disease_overview.map((d) => (
                <div key={d.disease} className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {d.disease === 'Heart Disease' && <Heart className="w-5 h-5 text-rose-400" />}
                      {d.disease === 'Diabetes' && <Activity className="w-5 h-5 text-amber-400" />}
                      {d.disease === 'Stroke' && <Brain className="w-5 h-5 text-teal-400" />}
                      <div>
                        <span className="text-xs font-bold text-white">{d.disease}</span>
                        <div className="text-[10px] text-slate-400">
                          {d.disease === 'Heart Disease' ? 'Coronary CAD (40% Weight)' : d.disease === 'Diabetes' ? 'Type-2 Glycemic (35% Weight)' : 'Cerebrovascular (25% Weight)'}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-white">{d.avg_risk}% Mean</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/40">
                    <span>Elevated / Critical Cohort:</span>
                    <strong className="text-slate-200">{d.high_risk_count.toLocaleString()} patients</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Ensemble Weights: Heart 40% · Diab 35% · Stroke 25%</span>
            <span className="text-teal-400 font-semibold">Joint Probability Matrix</span>
          </div>
        </div>
      </div>

      {/* Critical Patient Priority Queue Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">Priority Acute Care Triage Queue</h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                Immediate Action Required
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Top critical patients with compound cardiometabolic disease comorbidity requiring physician evaluation
            </p>
          </div>
          <button
            onClick={() => onNavigate('patients')}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center space-x-1 cursor-pointer"
          >
            <span>View Full Hospital Registry (10,240)</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">MRN / Patient Name</th>
                <th className="py-3.5 px-4">Demographics</th>
                <th className="py-3.5 px-4">Blood Pressure</th>
                <th className="py-3.5 px-4">Cholesterol</th>
                <th className="py-3.5 px-4">Fasting Glucose</th>
                <th className="py-3.5 px-4">Severity Score</th>
                <th className="py-3.5 px-4">Triage Priority</th>
                <th className="py-3.5 px-5 text-right">Clinical Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {critical_alerts.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-white text-sm">{patient.name}</div>
                    <div className="text-[11px] text-sky-400 font-mono">MRN: {patient.id}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {patient.age}y · {patient.gender} · BMI {patient.bmi}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-semibold ${patient.systolic_bp >= 140 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                      {patient.systolic_bp}/{patient.diastolic_bp} mmHg
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-semibold ${patient.cholesterol >= 240 ? 'text-amber-400 font-bold' : 'text-slate-200'}`}>
                      {patient.cholesterol} mg/dL
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-semibold ${patient.glucose >= 126 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                      {patient.glucose} mg/dL
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-14 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{ width: `${patient.composite_risk * 100}%` }}
                        />
                      </div>
                      <span className="font-extrabold text-white">
                        {(patient.composite_risk * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Critical Code Red
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => onSelectPatient(patient)}
                      className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md shadow-sky-600/20 transition-all inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Assess Patient</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
