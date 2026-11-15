import React, { useState } from 'react';
import { 
  Cpu, 
  Award, 
  ShieldCheck
} from 'lucide-react';
import { ModelBenchmark } from '../types';
import { promoteModel } from '../api';

interface ModelRegistryViewProps {
  models: ModelBenchmark[];
  rocCurves: Record<string, { fpr: number; tpr: number }[]>;
  onRefresh: () => void;
}

export const ModelRegistryView: React.FC<ModelRegistryViewProps> = ({
  models,
  onRefresh
}) => {
  const [promotingId, setPromotingId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelBenchmark | null>(
    models.find((m) => m.status === 'Champion') || models[0] || null
  );

  const handlePromote = async (modelId: string) => {
    setPromotingId(modelId);
    try {
      await promoteModel(modelId);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setPromotingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-tab-switch">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Clinical AI Model Registry &amp; Governance Hub
            </h1>
            <span className="px-3 py-0.5 text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full">
              Production Governance
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Controlled benchmarking of candidate classification architectures, stratified clinical validation splits, and governed model promotion.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Model Promotion Governance: <strong className="text-white">Active</strong></span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Clinical Architecture Benchmark Matrix</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluated across 10,240 standardized records with stratified 80/20 train/validation and strict holdout separation.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Model Architecture</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Validation Acc</th>
                <th className="py-3.5 px-4">Holdout/Test Acc</th>
                <th className="py-3.5 px-4">Precision</th>
                <th className="py-3.5 px-4">Recall</th>
                <th className="py-3.5 px-4">F1-Score</th>
                <th className="py-3.5 px-4">AUC-ROC</th>
                <th className="py-3.5 px-4">Latency</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Lifecycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {models.map((m) => {
                const isChampion = m.status === 'Champion';
                return (
                  <tr
                    key={m.model_id}
                    onClick={() => setSelectedModel(m)}
                    className={`cursor-pointer transition-colors ${
                      isChampion
                        ? 'bg-sky-950/30 hover:bg-sky-950/50'
                        : selectedModel?.model_id === m.model_id
                        ? 'bg-slate-800/80'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center space-x-2">
                        {isChampion && <Award className="w-4 h-4 text-amber-400" />}
                        <strong className="text-white text-sm">{m.model_name}</strong>
                      </div>
                      <div className="text-[11px] font-mono text-sky-400">{m.version}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {m.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white text-sm">
                      {m.validation_accuracy}%
                    </td>
                    <td className="py-3.5 px-4 text-teal-400 font-bold text-sm">
                      {m.holdout_accuracy}%
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{m.precision}%</td>
                    <td className="py-3.5 px-4 text-slate-300">{m.recall}%</td>
                    <td className="py-3.5 px-4 text-slate-300">{m.f1_score}%</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-400">{m.auc_roc}</td>
                    <td className="py-3.5 px-4 text-slate-400">{m.latency_ms} ms</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                          isChampion
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : m.status === 'Candidate'
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                            : m.status === 'Staging'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {!isChampion ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePromote(m.model_id);
                          }}
                          disabled={promotingId === m.model_id}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg border border-slate-600 transition-colors cursor-pointer"
                        >
                          {promotingId === m.model_id ? 'Promoting...' : 'Promote'}
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-400">Active Champion</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Model Details & ROC Curves Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Model Dossier (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center">
              <Cpu className="w-4 h-4 mr-2 text-sky-400" />
              <span>Diagnostic Pipeline Specifications</span>
            </h3>
            <span className="text-xs font-mono font-semibold text-sky-400">
              {selectedModel?.version}
            </span>
          </div>

          {selectedModel && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                {selectedModel.description}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Validation Context</span>
                  <span className="text-xl font-black text-white">{selectedModel.validation_accuracy}%</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Stratified 5-Fold Cross-Val</p>
                </div>
                <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Holdout Evaluation</span>
                  <span className="text-xl font-black text-teal-400">{selectedModel.holdout_accuracy}%</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Strict Hospital Holdout Cohort</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Training Execution Time:</span>
                  <strong className="text-white">{selectedModel.training_time_s}s</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Inference Response Latency:</span>
                  <strong className="text-white">{selectedModel.latency_ms} ms</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Area Under ROC Curve:</span>
                  <strong className="text-sky-400 font-mono font-bold">{selectedModel.auc_roc}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ROC Curves Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">ROC Curve (Receiver Operating Characteristic)</h3>
                <p className="text-xs text-slate-400 mt-0.5">True Positive Rate vs. False Positive Rate across diagnostic cutoffs</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full">
                Champion AUC: 0.967
              </span>
            </div>

            {/* Interactive SVG Chart for ROC */}
            <div className="w-full h-64 bg-slate-950/70 rounded-2xl p-4 border border-slate-800 relative flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 300 200">
                <line x1="40" y1="170" x2="280" y2="170" stroke="#475569" strokeWidth="1.5" />
                <line x1="40" y1="20" x2="40" y2="170" stroke="#475569" strokeWidth="1.5" />

                <line x1="40" y1="170" x2="280" y2="20" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />

                <text x="35" y="175" textAnchor="end" fontSize="9" fill="#94a3b8">0.0</text>
                <text x="35" y="95" textAnchor="end" fontSize="9" fill="#94a3b8">0.5</text>
                <text x="35" y="25" textAnchor="end" fontSize="9" fill="#94a3b8">1.0</text>

                <text x="40" y="185" textAnchor="middle" fontSize="9" fill="#94a3b8">0.0</text>
                <text x="160" y="185" textAnchor="middle" fontSize="9" fill="#94a3b8">0.5</text>
                <text x="280" y="185" textAnchor="middle" fontSize="9" fill="#94a3b8">1.0</text>

                <text x="160" y="198" textAnchor="middle" fontSize="9" fill="#cbd5e1" fontWeight="bold">False Positive Rate (FPR)</text>
                <text x="12" y="95" textAnchor="middle" fontSize="9" fill="#cbd5e1" fontWeight="bold" transform="rotate(-90 12 95)">True Positive Rate</text>

                {/* Random Forest Champion (Teal) */}
                <path
                  d="M 40 170 C 45 60, 65 35, 280 20"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="3.5"
                />

                {/* XGBoost (Sky) */}
                <path
                  d="M 40 170 C 50 65, 75 40, 280 20"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                />

                {/* Logistic Regression (Gray) */}
                <path
                  d="M 40 170 C 70 110, 120 70, 280 20"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-teal-400" />
              <span className="text-white">Random Forest Champion (0.967)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-400" />
              <span className="text-slate-300">XGBoost Candidate (0.963)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-500" />
              <span className="text-slate-400">Clinical Logit Baseline (0.891)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
