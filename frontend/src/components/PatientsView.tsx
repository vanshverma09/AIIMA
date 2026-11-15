import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  HeartPulse,
  UserPlus,
  X
} from 'lucide-react';
import { Patient } from '../types';
import { createPatient } from '../api';

interface PatientsViewProps {
  patients: Patient[];
  totalPatients: number;
  loading: boolean;
  onSelectPatient: (patient: Patient) => void;
  onRefresh: () => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  totalPatients,
  onSelectPatient,
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // New Patient Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: 45,
    gender: 'Male',
    bmi: 26.5,
    systolic_bp: 130,
    diastolic_bp: 82,
    cholesterol: 210,
    glucose: 105,
    heart_rate: 72,
    smoking_status: 'Never',
    alcohol_intake: 'None',
    physical_activity_hours: 3.0,
    family_history: 'None'
  });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState<string | null>(null);

  const filtered = patients.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || p.risk_category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name.trim()) return;
    setCreating(true);
    setCreateMsg(null);
    try {
      await createPatient(newPatient);
      setCreateMsg('Patient successfully registered into EHR database!');
      setTimeout(() => {
        setShowAddModal(false);
        setCreateMsg(null);
        onRefresh();
      }, 1000);
    } catch (err: any) {
      setCreateMsg(`Error: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-tab-switch">
      {/* Title Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Hospital Patient Master Registry (EHR)
            </h1>
            <span className="px-3 py-0.5 text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-full">
              10,240 Validated Profiles
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Standardized electronic health records, continuous vital metrics, lab results, and composite risk stratification.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/20 flex items-center space-x-2 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Inpatient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by MRN or Patient Name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-300">Triage Priority Filter:</span>
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl font-bold text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="all">All Triage Tiers ({totalPatients})</option>
            <option value="critical">Critical (Code Red)</option>
            <option value="high">High Priority</option>
            <option value="moderate">Moderate Surveillance</option>
            <option value="low">Low Risk / Stable</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">MRN &amp; Name</th>
                <th className="py-3.5 px-4">Demographics</th>
                <th className="py-3.5 px-4">Blood Pressure</th>
                <th className="py-3.5 px-4">Cholesterol</th>
                <th className="py-3.5 px-4">Glucose</th>
                <th className="py-3.5 px-4">Tobacco Status</th>
                <th className="py-3.5 px-4">Risk Severity</th>
                <th className="py-3.5 px-4">Triage Classification</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {paginated.map((p) => {
                const isCrit = p.risk_category === 'Critical';
                const isHigh = p.risk_category === 'High';
                return (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-white text-sm">{p.name}</div>
                      <div className="text-[11px] font-mono text-sky-400">MRN: {p.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {p.age}y · {p.gender} · BMI {p.bmi}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-semibold ${p.systolic_bp >= 140 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                        {p.systolic_bp}/{p.diastolic_bp} mmHg
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-semibold ${p.cholesterol >= 240 ? 'text-amber-400 font-bold' : 'text-slate-200'}`}>
                        {p.cholesterol} mg/dL
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-semibold ${p.glucose >= 126 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                        {p.glucose} mg/dL
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.smoking_status === 'Current' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {p.smoking_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2 font-bold text-white">
                        <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isCrit ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : 'bg-teal-400'
                            }`}
                            style={{ width: `${p.composite_risk * 100}%` }}
                          />
                        </div>
                        <span>{(p.composite_risk * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-md font-bold text-[10px] border ${
                          isCrit
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : isHigh
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : p.risk_category === 'Moderate'
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {p.risk_category}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => onSelectPatient(p)}
                        className="px-3 py-1 bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 font-bold rounded-lg border border-sky-500/40 transition-colors inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <HeartPulse className="w-3.5 h-3.5" />
                        <span>Assess</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong>{(page - 1) * pageSize + 1}</strong> to{' '}
            <strong>{Math.min(page * pageSize, filtered.length)}</strong> of{' '}
            <strong>{filtered.length.toLocaleString()}</strong> records
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-white">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add New Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-700 space-y-6 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white">Register Inpatient into EHR</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Patient Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Age</label>
                  <input
                    type="number"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">BMI</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPatient.bmi}
                    onChange={(e) => setNewPatient({ ...newPatient, bmi: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={newPatient.systolic_bp}
                    onChange={(e) => setNewPatient({ ...newPatient, systolic_bp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={newPatient.diastolic_bp}
                    onChange={(e) => setNewPatient({ ...newPatient, diastolic_bp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Total Cholesterol (mg/dL)</label>
                  <input
                    type="number"
                    value={newPatient.cholesterol}
                    onChange={(e) => setNewPatient({ ...newPatient, cholesterol: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Fasting Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={newPatient.glucose}
                    onChange={(e) => setNewPatient({ ...newPatient, glucose: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              {createMsg && (
                <div className="p-3 bg-emerald-950/80 text-emerald-300 rounded-xl border border-emerald-700 text-xs">
                  {createMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                {creating ? 'Normalizing & Enrolling into Registry...' : 'Save & Initialize Baseline Triage'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
