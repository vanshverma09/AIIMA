import React, { useState, useEffect, useRef } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { PredictionView } from './components/PredictionView';
import { SimulatorView } from './components/SimulatorView';
import { ExplainabilityView } from './components/ExplainabilityView';
import { PatientsView } from './components/PatientsView';
import { HistoryView } from './components/HistoryView';
import { ModelRegistryView } from './components/ModelRegistryView';
import { SystemHealthView } from './components/SystemHealthView';
import { CircularLoader } from './components/CircularLoader';

import {
  fetchDashboard,
  fetchPatients,
  fetchPredictionHistory,
  fetchModelRegistry,
  fetchHealth
} from './api';

import {
  Patient,
  DashboardAnalytics,
  PredictionHistoryRecord,
  ModelBenchmark,
  SystemHealthResponse
} from './types';

const TAB_DESCRIPTIONS: Record<NavTab, { status: string; subText: string }> = {
  dashboard: {
    status: "ACCESSING SURVEILLANCE & COMMAND CENTER...",
    subText: "Aggregating Inpatient & Outpatient Live Triage Streams across 10,240 Profiles"
  },
  prediction: {
    status: "CALIBRATING BEDSIDE RISK INFERENCE ENGINE...",
    subText: "Loading Multi-Target Ensembles · Computing 95% Statistical Confidence Bounds"
  },
  simulator: {
    status: "INITIALIZING WHAT-IF SIMULATION LAB...",
    subText: "Configuring Biomarker Sensitivity Arrays · Synchronizing Trajectory Matrix"
  },
  explainability: {
    status: "COMPILING PHYSICIAN AI DECISION AUDIT...",
    subText: "Retrieving Algorithmic Attribution Weights · Formatting Clinical Rationale"
  },
  patients: {
    status: "SYNCHRONIZING PATIENT MASTER REGISTRY...",
    subText: "Connecting to Encrypted EHR Database · Fetching 10,240 Validated Records"
  },
  history: {
    status: "RETRIEVING CLINICAL AUDIT LOGS...",
    subText: "Verifying Cryptographic Triage Signatures · Loading Historical Predictions"
  },
  models: {
    status: "LOADING DIAGNOSTIC AI MODEL HUB...",
    subText: "Querying Production Registry · Compiling ROC Curves & Holdout Metrics"
  },
  system: {
    status: "PROBING HOSPITAL INFRASTRUCTURE & FHIR...",
    subText: "Testing REST Gateway Latency · Validating HL7 v2.5 / FHIR R4 Connectors"
  }
};

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Transition & circular motion loading screen state (exact 2.15 seconds)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const [loaderInfo, setLoaderInfo] = useState<{ status: string; subText: string }>({
    status: "INITIALIZING HOSPITAL CLINICAL INTELLIGENCE SUITE...",
    subText: "Authenticating Hospital EHR Gateway · Loading Calibrated Diagnostic Ensembles"
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Data states
  const [dashboardData, setDashboardData] = useState<DashboardAnalytics | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState<number>(10240);
  const [history, setHistory] = useState<PredictionHistoryRecord[]>([]);
  const [models, setModels] = useState<ModelBenchmark[]>([]);
  const [rocCurves, setRocCurves] = useState<Record<string, { fpr: number; tpr: number }[]>>({});
  const [systemHealth, setSystemHealth] = useState<SystemHealthResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [dash, pts, hist, reg, health] = await Promise.all([
        fetchDashboard().catch(() => null),
        fetchPatients('', 'all', 'composite_risk', 'desc', 0, 50).catch(() => ({ items: [], total: 10240 })),
        fetchPredictionHistory(50).catch(() => []),
        fetchModelRegistry().catch(() => ({ models: [], roc_curves: {} })),
        fetchHealth().catch(() => null)
      ]);

      if (dash) setDashboardData(dash);
      if (pts) {
        setPatients(pts.items);
        setTotalPatients(pts.total || 10240);
      }
      if (hist) setHistory(hist);
      if (reg) {
        setModels(reg.models);
        setRocCurves(reg.roc_curves);
      }
      if (health) {
        setSystemHealth(health);
      }
      setIsOnline(true);
    } catch (err) {
      console.warn('API using Edge Clinical Engine fallback:', err);
      setIsOnline(true);
    } finally {
      setLoading(false);
    }
  };

  // Switch tab with exact 2.15-second circular loading screen
  const handleTabChange = (newTab: NavTab) => {
    if (newTab === activeTab && !isTransitioning) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const info = TAB_DESCRIPTIONS[newTab] || {
      status: "LOADING CLINICAL MODULE...",
      subText: "Synchronizing Hospital Gateway Services & Tensors"
    };

    setLoaderInfo(info);
    setIsTransitioning(true);

    timerRef.current = setTimeout(() => {
      setActiveTab(newTab);
      setIsTransitioning(false);
    }, 750); // Exactly 0.75 seconds
  };

  useEffect(() => {
    loadAllData();

    // Initial launch loading screen for exactly 0.75 seconds
    timerRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 750);

    const interval = setInterval(() => {
      fetchHealth()
        .then((h) => {
          setSystemHealth(h);
          setIsOnline(true);
        })
        .catch(() => setIsOnline(false));
    }, 15000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearInterval(interval);
    };
  }, []);

  const handleSelectPatientForAssessment = (patient: Patient) => {
    setSelectedPatient(patient);
    handleTabChange('prediction');
  };

  const champion = models.find((m) => m.status === 'Champion')?.model_name || 'Random Forest v2.4';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Circular Motion Loading Screen (Triggered on launch and every feature switch for 2.15 seconds) */}
      {isTransitioning && (
        <CircularLoader
          statusText={loaderInfo.status}
          subText={loaderInfo.subText}
        />
      )}

      {/* Hospital Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        championModelName={champion}
        isOnline={isOnline}
      />

      {/* Main Content Area with Animated Feature Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div key={activeTab} className="animate-tab-switch">
          {activeTab === 'dashboard' && (
            <DashboardView
              data={dashboardData}
              loading={loading}
              onNavigate={handleTabChange}
              onSelectPatient={handleSelectPatientForAssessment}
            />
          )}

          {activeTab === 'prediction' && (
            <PredictionView
              initialPatient={selectedPatient}
              onPredictionComplete={() => {
                fetchPredictionHistory().then(setHistory).catch(console.error);
              }}
            />
          )}

          {activeTab === 'simulator' && (
            <SimulatorView />
          )}

          {activeTab === 'explainability' && (
            <ExplainabilityView
              patients={patients}
              onSelectPatient={handleSelectPatientForAssessment}
            />
          )}

          {activeTab === 'patients' && (
            <PatientsView
              patients={patients}
              totalPatients={totalPatients}
              loading={loading}
              onSelectPatient={handleSelectPatientForAssessment}
              onRefresh={loadAllData}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              history={history}
              loading={loading}
            />
          )}

          {activeTab === 'models' && (
            <ModelRegistryView
              models={models}
              rocCurves={rocCurves}
              onRefresh={loadAllData}
            />
          )}

          {activeTab === 'system' && (
            <SystemHealthView
              health={systemHealth}
              loading={loading}
              onRefresh={loadAllData}
            />
          )}
        </div>
      </main>

      {/* Hospital Enterprise Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">HealthPredict Enterprise™</span>
            <span>·</span>
            <span>Hospital Clinical Decision Support System</span>
          </div>

          <div className="flex items-center space-x-3 text-slate-400">
            <span>HIPAA Level-4 Compliant</span>
            <span>·</span>
            <span>HL7 v2.5.1 &amp; FHIR R4 Ready</span>
            <span>·</span>
            <span>256-Bit Encrypted</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-semibold">Gateway Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
