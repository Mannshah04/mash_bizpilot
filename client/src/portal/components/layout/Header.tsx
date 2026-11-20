import React, { useState } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { ShieldCheck, RotateCcw, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { state, resetFlow } = useOnboarding();
  const navigate = useNavigate();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleReset = async () => {
    await resetFlow();
    setShowConfirmReset(false);
    navigate('/step-1');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">Bizpilot</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Onboarding
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">First-Time Setup Flow</p>
          </div>
        </div>

        {/* Right side status & reset */}
        <div className="flex items-center gap-3">
          {state.user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="max-w-[150px] truncate text-slate-200">{state.user.email}</span>
              {state.user.isTotpVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium pl-1 border-l border-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  2FA Active
                </span>
              )}
            </div>
          )}

          {/* Reset button for testing */}
          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 transition-colors cursor-pointer"
            title="Reset Mock Data and Restart Onboarding"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Flow</span>
          </button>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-white">Reset Onboarding Flow?</h3>
            <p className="mt-2 text-sm text-slate-400">
              This will clear your local mock storage and take you back to Step 1.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-3.5 py-2 text-xs font-medium rounded-lg text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-colors cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
