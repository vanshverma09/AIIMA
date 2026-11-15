import React from 'react';
import { 
  Activity, 
  LayoutDashboard, 
  HeartPulse, 
  Sliders, 
  FileSearch, 
  Users, 
  History, 
  Cpu, 
  Server, 
  ShieldCheck,
  Building2,
  Stethoscope,
  ChevronDown
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'prediction'
  | 'simulator'
  | 'explainability'
  | 'patients'
  | 'history'
  | 'models'
  | 'system';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  championModelName?: string;
  isOnline?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  championModelName = "Random Forest v2.4",
  isOnline = true
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Surveillance Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'prediction', label: 'Clinical Assessment', icon: <HeartPulse className="w-4 h-4" /> },
    { id: 'simulator', label: 'What-If Simulation Lab', icon: <Sliders className="w-4 h-4" /> },
    { id: 'explainability', label: 'Physician AI Audit', icon: <FileSearch className="w-4 h-4" /> },
    { id: 'patients', label: 'Patient Registry (EHR)', icon: <Users className="w-4 h-4" /> },
    { id: 'history', label: 'Triage History', icon: <History className="w-4 h-4" /> },
    { id: 'models', label: 'Diagnostic Model Hub', icon: <Cpu className="w-4 h-4" /> },
    { id: 'system', label: 'System Health & FHIR', icon: <Server className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Top hospital operational bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 border border-sky-400/30">
              <Activity className="w-6 h-6 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-white">HealthPredict</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-md">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Hospital Clinical Decision Support &amp; Disease Risk Surveillance</p>
            </div>
          </div>

          {/* Center Hospital Department Selector (Enterprise Look) */}
          <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <Building2 className="w-4 h-4 text-teal-400" />
            <span>Facility: <strong className="text-white">Metropolitan General Hospital</strong></span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Cardiology &amp; Acute Care</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </div>

          {/* Right Status Indicators */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1 bg-slate-800/90 rounded-full text-xs text-slate-300 font-medium border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Model Champion: <strong className="text-white">{championModelName}</strong></span>
              <span className="text-teal-400 font-bold">(92.4% AUC)</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-sky-950/80 text-sky-300 rounded-full text-xs font-semibold border border-sky-800/50">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>HIPAA Level-4 Compliant</span>
            </div>

            <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isOnline ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60' : 'bg-rose-950/70 text-rose-300 border-rose-800/60'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
              <span>{isOnline ? 'HL7/FHIR: Connected' : 'Offline'}</span>
            </div>

            {/* Physician Avatar */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-700">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sky-300 border border-slate-600">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="text-left text-xs leading-tight">
                <div className="font-bold text-white">Attending MD</div>
                <div className="text-[10px] text-slate-400">Staff Physician</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs with clinical styling */}
      <div className="bg-slate-950/80 border-t border-slate-800 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1.5 py-2 min-w-max">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-md shadow-sky-600/30 border border-sky-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
