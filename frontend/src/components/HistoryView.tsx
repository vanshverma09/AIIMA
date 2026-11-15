import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Download, 
  CheckCircle2, 
  Clock
} from 'lucide-react';
import { PredictionHistoryRecord } from '../types';

interface HistoryViewProps {
  history: PredictionHistoryRecord[];
  loading: boolean;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const [search, setSearch] = useState('');
  const [targetFilter, setTargetFilter] = useState('all');

  const filtered = history.filter((h) => {
    const matchesSearch =
      search === '' ||
      h.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      h.patient_id.toLowerCase().includes(search.toLowerCase()) ||
      h.run_id.toLowerCase().includes(search.toLowerCase());
    const matchesTarget =
      targetFilter === 'all' || h.disease_target.toLowerCase() === targetFilter.toLowerCase();
    return matchesSearch && matchesTarget;
  });

  const exportCSV = () => {
    const headers = ['Audit ID', 'Timestamp UTC', 'MRN', 'Patient Legal Name', 'Diagnostic Target', 'Probability', 'CI Lower', 'CI Upper', 'Severity Score', 'Triage Tier', 'Model Version', 'Audit Status'];
    const rows = filtered.map((r) => [
      r.run_id,
      r.timestamp,
      r.patient_id,
      `"${r.patient_name}"`,
      r.disease_target,
      (r.probability * 100).toFixed(1) + '%',
      (r.ci_lower * 100).toFixed(1) + '%',
      (r.ci_upper * 100).toFixed(1) + '%',
      (r.composite_risk * 100).toFixed(1) + '%',
      r.risk_category,
      r.model_version,
      r.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hospital_clinical_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16 animate-tab-switch">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Clinical Audit Trail &amp; Triage Logs
            </h1>
            <span className="px-3 py-0.5 text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-full">
              HIPAA Section 164 Audit Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Centralized inference audit trail supporting retrospective physician verification and quality assurance reporting.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 shadow-lg flex items-center space-x-2 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-sky-400" />
          <span>Export Clinical Audit Log (CSV)</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Audit ID, MRN, Patient Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-300">Target Condition:</span>
          <select
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl font-bold text-sky-400 cursor-pointer"
          >
            <option value="all">All Diagnoses</option>
            <option value="heart_disease">Heart Disease (CAD)</option>
            <option value="diabetes">Type-2 Diabetes</option>
            <option value="stroke">Stroke</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Audit Identifier</th>
                <th className="py-3.5 px-4">Timestamp (UTC)</th>
                <th className="py-3.5 px-4">Patient Profile</th>
                <th className="py-3.5 px-4">Diagnostic Target</th>
                <th className="py-3.5 px-4">Calculated Risk</th>
                <th className="py-3.5 px-4">95% Confidence Interval</th>
                <th className="py-3.5 px-4">Triage Priority</th>
                <th className="py-3.5 px-4">Model Engine</th>
                <th className="py-3.5 px-5 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filtered.map((r) => {
                const isCrit = r.risk_category === 'Critical';
                const isHigh = r.risk_category === 'High';
                return (
                  <tr key={r.run_id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-sky-400">{r.run_id}</td>
                    <td className="py-3.5 px-4 text-slate-400 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{r.timestamp}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{r.patient_name}</div>
                      <div className="text-[11px] font-mono text-slate-400">MRN: {r.patient_id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize font-semibold text-slate-300">
                        {r.disease_target.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-white text-sm">
                      {(r.probability * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      [{(r.ci_lower * 100).toFixed(1)}% — {(r.ci_upper * 100).toFixed(1)}%]
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-md font-bold text-[10px] border ${
                          isCrit
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : isHigh
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {r.risk_category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {r.model_version}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="inline-flex items-center space-x-1 text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{r.status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
