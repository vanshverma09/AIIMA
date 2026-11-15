import React from 'react';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

interface CircularLoaderProps {
  statusText?: string;
  subText?: string;
}

export const CircularLoader: React.FC<CircularLoaderProps> = ({
  statusText = "INITIALIZING CLINICAL SURVEILLANCE SUITE...",
  subText = "Authenticating Hospital Gateway · Loading Calibrated Diagnostic Ensembles"
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md text-white select-none">
      {/* Background ambient medical glow */}
      <div className="absolute w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-80 h-80 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Circular Motion Loading Logo Container */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Outer orbital ring 1 */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 border-r-sky-500/40 animate-spin-slow" />

        {/* Outer orbital ring 2 (reverse) */}
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-teal-400 border-l-teal-500/40 animate-spin-reverse" />

        {/* Radar ping ring */}
        <div className="absolute inset-4 rounded-full border border-sky-400/30 animate-radar-ping" />

        {/* Inner rotating dash ring */}
        <svg className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] animate-spin-slow" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="url(#blueTealGrad)"
            strokeWidth="2.5"
            strokeDasharray="16 10"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="blueTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Glass Sphere with Heart Pulse */}
        <div className="relative w-20 h-20 rounded-full bg-slate-900/90 border border-sky-500/40 flex items-center justify-center shadow-xl shadow-sky-500/20 backdrop-blur-sm">
          <div className="relative">
            <HeartPulse className="w-10 h-10 text-teal-400 animate-pulse" />
            <Activity className="w-5 h-5 text-sky-400 absolute -bottom-1 -right-1 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Hospital Branding & Status */}
      <div className="mt-8 text-center space-y-2 z-10 max-w-sm px-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-white">
            HEALTHPREDICT
          </span>
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-md">
            ENTERPRISE
          </span>
        </div>

        <p className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
          {statusText}
        </p>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          {subText}
        </p>

        {/* Animated loading line */}
        <div className="w-48 mx-auto h-1 bg-slate-800 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-sky-400 to-teal-400 rounded-full animate-pulse w-3/4" />
        </div>

        <div className="pt-2 flex items-center justify-center space-x-3 text-[10px] text-slate-400">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-teal-400" />
            <span>HIPAA Level-4 Compliant</span>
          </span>
          <span>·</span>
          <span>HL7 / FHIR Ready</span>
        </div>
      </div>
    </div>
  );
};
