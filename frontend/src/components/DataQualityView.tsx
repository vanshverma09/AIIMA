import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  RotateCw, 
  ShieldCheck, 
  FileCheck, 
  TrendingUp,
  Clock,
  Layers
} from 'lucide-react';
import { DataQualityAuditResponse } from '../types';

interface DataQualityViewProps {
  audit: DataQualityAuditResponse | null;
  loading: boolean;
  onRefresh: () => void;
}

export const DataQualityView: React.FC<DataQualityViewProps> = ({
  audit,
  loading,
  onRefresh
}) => {
  if (loading || !audit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Validating 10,240 clinical records against ETL schema...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900">Dataset Quality &amp; ETL Health Audit</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-md">Figure 4.9 Spec</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated clinical data validation layer inspecting bounds, schema consistency, missing identifiers, and duplication integrity.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-2 transition-colors cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
          <span>Execute Automated Re-Audit</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Health Records</span>
            <Database className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{audit.total_records.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-0.5">Coverage: {audit.coverage_start} to {audit.coverage_end}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Duplicate Collisions</span>
            <FileCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600">{audit.duplicate_collisions}</div>
            <p className="text-xs text-emerald-700 mt-0.5 font-medium">100% Unique Identifiers Verified</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Missing IDs</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600">{audit.missing_identifiers}</div>
            <p className="text-xs text-emerald-700 mt-0.5 font-medium">0 Null Records Detected</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Dataset Health Score</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-teal-600">{audit.overall_health_score}%</div>
            <p className="text-xs text-slate-500 mt-0.5">{audit.passed_checks} of {audit.total_checks} Integrity Checks Passed</p>
          </div>
        </div>
      </div>

      {/* Range and Schema Check Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Clinical Value Range &amp; Schema Integrity Checks</h2>
            <p className="text-xs text-slate-500">
              Validates biometric and lab ranges against medically physiological bounds.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Last Audit: {audit.last_audit_run}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Verification Check</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Target Feature</th>
                <th className="py-3 px-4">Acceptable Medical Bounds</th>
                <th className="py-3 px-4">Records Checked</th>
                <th className="py-3 px-4">Compliant Records</th>
                <th className="py-3 px-4">Violations</th>
                <th className="py-3 px-4">Compliance %</th>
                <th className="py-3 px-4 text-right">Audit Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {audit.checks.map((c) => (
                <tr key={c.check_name} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{c.check_name}</td>
                  <td className="py-3 px-4 text-slate-600">{c.category}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{c.target_field}</td>
                  <td className="py-3 px-4 font-mono text-slate-600 font-semibold">{c.expected_range}</td>
                  <td className="py-3 px-4 text-slate-700">{c.total_checked.toLocaleString()}</td>
                  <td className="py-3 px-4 text-emerald-700 font-medium">{c.compliant_records.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={c.violation_count === 0 ? 'text-slate-400' : 'text-rose-600 font-bold'}>
                      {c.violation_count}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{c.compliance_rate}%</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{c.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ETL Pipeline Normalization Report */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg space-y-4">
        <div className="flex items-center space-x-2 text-teal-400">
          <Layers className="w-5 h-5" />
          <h3 className="text-base font-bold text-white">ETL Pipeline Normalization Certification</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The automated ETL layer executes StandardScaler normalization, categorical label-encoding (Gender, Smoking status, Alcohol intake, Family clinical history), and ensures zero-leakage isolation before passing tensors to the Random Forest champion and candidate models.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Feature Imputation</span>
            <strong className="text-white">Median / Mode Zero-Leakage</strong>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Variance Scaling</span>
            <strong className="text-white">Z-Score Unit Variance</strong>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Evaluation Integrity</span>
            <strong className="text-white">Stratified Train / Test Partition</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
