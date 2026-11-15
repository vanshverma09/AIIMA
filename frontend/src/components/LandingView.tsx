import React from 'react';
import { 
  Heart, 
  Activity, 
  Brain, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  BarChart3, 
  Sliders, 
  FileCheck2,
  Award
} from 'lucide-react';
import { NavTab } from './Navbar';

interface LandingViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Project Academic Header / Credit Ribbon */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-sky-800/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-500/20 rounded-xl border border-sky-400/30 text-sky-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-sky-400 font-semibold">
                Major B.Tech Capstone Project — Department of Computer Science & Engineering
              </p>
              <h2 className="text-sm sm:text-base font-bold text-slate-100">
                Gateway Institute of Engineering & Technology (GIET Sonipat) · Affiliated to DCRUST, Murthal
              </h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400">Developers: </span>
              <strong className="text-white">Vansh Verma & Pranjal</strong>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400">Supervisor: </span>
              <strong className="text-white">Mr. Anil Arora</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-gradient-to-br from-sky-100/60 to-teal-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Multi-Disease Clinical AI & Risk Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Predicting disease risks <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-600">
              before they become critical.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
            HealthPredict AI transforms high-dimensional patient vital signs, laboratory markers, and lifestyle indicators into validated, explainable disease predictions and proactive clinical action pathways for Heart Disease, Type-2 Diabetes, and Stroke.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm shadow-md shadow-sky-600/20 transition-all hover:gap-3 gap-2"
            >
              <span>Explore Executive Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('prediction')}
              className="inline-flex items-center px-6 py-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-medium text-sm border border-teal-200 transition-colors"
            >
              <Heart className="w-4 h-4 mr-2 text-teal-600" />
              <span>Run Live Clinical Assessment</span>
            </button>

            <button
              onClick={() => onNavigate('simulator')}
              className="inline-flex items-center px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm border border-slate-200 shadow-xs transition-colors"
            >
              <Sliders className="w-4 h-4 mr-2 text-slate-500" />
              <span>What-If Simulator</span>
            </button>
          </div>

          {/* Quick Evidence Metrics */}
          <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-2xl font-bold text-sky-900">10,240</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Validated Records (ETL Pass)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-600">92.4%</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Random Forest Champion Acc</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600">0.967</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Production AUC-ROC</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">95% CI</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Bounded Risk Uncertainty</p>
            </div>
          </div>
        </div>
      </section>

      {/* Health Intelligence Overview Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Health Intelligence Architecture</h2>
            <p className="text-sm text-slate-500">
              Three synchronized target predictors connected to a deterministic 4-tier composite risk engine.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-sky-50 text-sky-800 rounded-full border border-sky-100">
            FastAPI REST &amp; Scikit-Learn Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Target 1: Heart Disease */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Heart Disease (CAD)</h3>
              <p className="text-xs text-slate-500 mt-1">Weight: 40% in Composite Risk Score</p>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Evaluates coronary artery disease risk through systolic/diastolic blood pressure, total serum cholesterol, active smoking, resting heart rate, and patient age.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
              <span className="text-slate-500">Primary Model</span>
              <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">RF Ensemble v2.4</span>
            </div>
          </div>

          {/* Target 2: Diabetes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Type-2 Diabetes Mellitus</h3>
              <p className="text-xs text-slate-500 mt-1">Weight: 35% in Composite Risk Score</p>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Detects pre-diabetic and chronic metabolic risks incorporating fasting plasma glucose, Body Mass Index (BMI), physical inactivity, and hereditary indicators.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
              <span className="text-slate-500">Primary Model</span>
              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Calibrated Trees</span>
            </div>
          </div>

          {/* Target 3: Stroke */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Cerebrovascular Stroke</h3>
              <p className="text-xs text-slate-500 mt-1">Weight: 25% in Composite Risk Score</p>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Flags ischemic and hemorrhagic risk factors synthesized from arterial hypertension, vascular resistance history, smoking status, and systemic cardiac strain.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
              <span className="text-slate-500">Primary Model</span>
              <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">XGBoost / RF</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Showcase */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
        <div className="max-w-2xl mb-8">
          <span className="text-xs uppercase tracking-widest text-teal-400 font-bold">Comprehensive Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2">Engineered for Clinical Decision Precision</h2>
          <p className="text-sm text-slate-300 mt-3">
            Every layer from raw data ingestion to clinical action is built to be verifiable, transparent, and leakage-safe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80 hover:bg-slate-800 transition-colors">
            <Sliders className="w-6 h-6 text-sky-400 mb-3" />
            <h4 className="text-base font-semibold text-white">What-If Parameter Simulator</h4>
            <p className="text-xs text-slate-400 mt-2">
              Interactively adjust BP, cholesterol, glucose, BMI, and lifestyle factors to see live changes in risk score in real time.
            </p>
          </div>

          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80 hover:bg-slate-800 transition-colors">
            <FileCheck2 className="w-6 h-6 text-teal-400 mb-3" />
            <h4 className="text-base font-semibold text-white">Explainable AI Decision Audit</h4>
            <p className="text-xs text-slate-400 mt-2">
              Explains exact biometric contributions (+32% BP, +28% Lipids) with customized clinical and lifestyle recommendations.
            </p>
          </div>

          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80 hover:bg-slate-800 transition-colors">
            <BarChart3 className="w-6 h-6 text-indigo-400 mb-3" />
            <h4 className="text-base font-semibold text-white">Model Registry &amp; Lifecycle</h4>
            <p className="text-xs text-slate-400 mt-2">
              Side-by-side benchmark of 6 algorithms: Logistic Regression, Decision Tree, Random Forest, XGBoost, GBM, and SVM.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
