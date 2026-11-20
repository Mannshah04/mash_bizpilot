import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useOnboarding } from '../../context/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Building2,
  GitBranch,
  ShieldCheck,
  User,
  ArrowRight,
  Download,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const SummaryScreen: React.FC = () => {
  const { state, resetFlow } = useOnboarding();
  const navigate = useNavigate();
  const [dashboardModalOpen, setDashboardModalOpen] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      // Second burst
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 350);
    } catch {
      // ignore
    }
  }, []);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bizpilot-onboarding-${state.company?.name || 'company'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleRestart = async () => {
    await resetFlow();
    navigate('/step-1');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="space-y-8">
        {/* Celebration Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/25 ring-4 ring-emerald-500/20">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Setup Complete
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome to Bizpilot!
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Your first-time onboarding is complete. Your user credentials, 2FA authenticator, primary company, and branch structure are all saved.
          </p>
        </div>

        {/* Top Cards: User & 2FA + Primary Company */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Account Card */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                <User className="w-4 h-4 text-indigo-400" />
                Administrator Account
              </div>
              <p className="text-base font-bold text-white break-all">
                {state.user?.email || 'admin@bizpilot.in'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {state.user?.totpSkipped ? (
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl w-fit">
                    <ShieldCheck className="w-4 h-4" />
                    <span>2FA: Optional (Skipped)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl w-fit">
                    <ShieldCheck className="w-4 h-4" />
                    <span>2FA TOTP Active & Verified</span>
                  </div>
                )}
                {state.dbResult && (
                  <div className="flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-xl w-fit font-mono">
                    <span>✓ Synced to PostgreSQL</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-4">
              Registered on: {state.user?.createdAt ? new Date(state.user.createdAt).toLocaleDateString() : 'Today'}
            </p>
          </div>

          {/* Company Details Card */}
          <div className="md:col-span-2 rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Building2 className="w-4 h-4 text-indigo-400" />
                Main Company Entity
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                Headquarters
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {state.company?.name || 'Unnamed Company'}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400">GSTIN:</span>
                  <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                    {state.company?.gstNumber || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Registered Address:</span>
                  <p className="text-slate-200">{state.company?.address || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Location:</span>
                  <p className="text-slate-200">
                    {state.company?.state}, {state.company?.country} - {state.company?.pinCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Branches Section */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Branches Directory</h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                {state.branches.length} configured
              </span>
            </div>
          </div>

          {state.branches.length === 0 ? (
            <div className="py-8 px-4 text-center rounded-2xl bg-slate-950/40 border border-slate-800">
              <p className="text-xs text-slate-400">
                No branches were added during onboarding (operating as single entity).
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3 text-center w-14">Sr. No.</th>
                    <th className="py-3 px-4">Branch Name</th>
                    <th className="py-3 px-3">Branch Code</th>
                    <th className="py-3 px-4">Address</th>
                    <th className="py-3 px-3">State</th>
                    <th className="py-3 px-3">PIN Code</th>
                    <th className="py-3 px-4">Contact Person</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {state.branches.map((branch, index) => (
                    <tr key={branch.id} className="hover:bg-slate-850/60">
                      <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {branch.branchName}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[11px] font-semibold">
                          {branch.branchCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-[200px] truncate" title={branch.address}>
                        {branch.address}
                      </td>
                      <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap">{branch.state}</td>
                      <td className="py-3.5 px-3 text-slate-300 font-mono">{branch.pinCode}</td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {branch.contactPerson} ({branch.phone})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Dashboard Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Export Setup JSON</span>
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Test Again (Reset)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setDashboardModalOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 ring-1 ring-white/10 transition-all cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Simulated Dashboard Modal */}
      {dashboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl relative text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Ready for Bizpilot Business Suite
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Welcome aboard, <strong>{state.company?.name}</strong>! All setup parameters have been verified and cached in your browser.
            </p>
            <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-left text-xs text-slate-400 space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span>Entity:</span>
                <span className="text-white font-semibold">{state.company?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>GSTIN:</span>
                <span className="text-indigo-300">{state.company?.gstNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Branches:</span>
                <span className="text-emerald-400 font-bold">{state.branches.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Database Sync:</span>
                <span className="text-emerald-400 font-bold">
                  {state.dbResult ? 'Persisted in PostgreSQL' : 'Local Verification'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>2FA Security:</span>
                <span className={state.user?.totpSkipped ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {state.user?.totpSkipped ? 'Optional (Skipped)' : 'Enabled & Verified'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  window.location.hash = '#/owner';
                  window.location.reload();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Launch BizzPilot ERP Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = '#/login';
                  window.location.reload();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                Go to Login Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
