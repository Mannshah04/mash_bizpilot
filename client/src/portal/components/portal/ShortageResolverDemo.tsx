import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const ShortageResolverDemo: React.FC = () => {
  const [strategy, setStrategy] = useState<'balanced' | 'fastest' | 'cheapest'>('balanced');
  const [approvedTransfer, setApprovedTransfer] = useState<string | null>(null);

  const handleApprove = (optionId: string) => {
    setApprovedTransfer(optionId);
    setTimeout(() => {
      setApprovedTransfer(null);
    }, 4000);
  };

  return (
    <section id="resolver-demo" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Headline Differentiator
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Smart Shortage Resolver{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              In Action
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            When customer orders exceed local stock, Bizpilot calculates real-time deficits, estimates road transit & logistics costs, and recommends ranked transfer resolutions before you lose the sale.
          </p>
        </div>

        {/* Live Scenario Card */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl mb-12">
          {/* Deficit Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm sm:text-base">
                    Active Shortage Detected: SKU BRG-6204 (Industrial Bearing 6204)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold">
                    Urgent
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Requesting Location: <strong className="text-slate-200">Ahmedabad Branch</strong> · Customer Order: 50 units · On-hand: 8 available
                </p>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
              <span className="text-xs text-slate-400 uppercase font-semibold">Net Deficit</span>
              <p className="text-2xl font-extrabold text-rose-400">42 Units Needed</p>
            </div>
          </div>

          {/* Ranking Strategy Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-white">AI Candidate Transfer Routes</h3>
              <p className="text-xs text-slate-400">
                Verified against live warehouse ledger balances and road transit matrices.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium">
              <span className="text-slate-400 px-2">Ranking:</span>
              <button
                type="button"
                onClick={() => setStrategy('balanced')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  strategy === 'balanced'
                    ? 'bg-indigo-600 text-white font-semibold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Balanced
              </button>
              <button
                type="button"
                onClick={() => setStrategy('fastest')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  strategy === 'fastest'
                    ? 'bg-emerald-600 text-white font-semibold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Fastest Speed
              </button>
              <button
                type="button"
                onClick={() => setStrategy('cheapest')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  strategy === 'cheapest'
                    ? 'bg-amber-600 text-white font-semibold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Lowest Cost
              </button>
            </div>
          </div>

          {/* Transfer Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option A: Surat Hub */}
            <div
              className={`p-6 rounded-2xl border transition-all relative flex flex-col justify-between ${
                strategy === 'fastest'
                  ? 'bg-emerald-950/20 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-xl'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center">
                      A
                    </span>
                    <h4 className="font-bold text-white text-sm">Surat Branch Hub</h4>
                  </div>
                  {strategy === 'fastest' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                      ⭐ Fastest Resolution
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">40 units free</span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Transfer <strong>40 units</strong> from Surat (arrives next day via NH-48 Express), then source remaining 2 units locally or from Central.
                </p>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Transit Time</span>
                    <span className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 1 Day
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Freight Cost</span>
                    <span className="text-sm font-bold text-white flex items-center justify-center gap-1">
                      ₹2,400
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Reliability</span>
                    <span className="text-sm font-bold text-emerald-400">98%</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleApprove('option-a')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Option A (Surat Route)</span>
              </button>
            </div>

            {/* Option B: Central Warehouse */}
            <div
              className={`p-6 rounded-2xl border transition-all relative flex flex-col justify-between ${
                strategy === 'cheapest' || strategy === 'balanced'
                  ? 'bg-indigo-950/20 border-indigo-500/60 ring-2 ring-indigo-500/20 shadow-xl'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center">
                      B
                    </span>
                    <h4 className="font-bold text-white text-sm">Central Warehouse Hub</h4>
                  </div>
                  {strategy === 'balanced' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold">
                      ⭐ AI Recommended (Single Shipment)
                    </span>
                  ) : strategy === 'cheapest' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                      ⭐ Lowest Bulk Cost
                    </span>
                  ) : null}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Transfer <strong>all 42 units in 1 single dispatch</strong> from Central Warehouse. Eliminates multi-shipment coordination and handling overhead.
                </p>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Transit Time</span>
                    <span className="text-sm font-bold text-slate-200 flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 2 Days
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Freight Cost</span>
                    <span className="text-sm font-bold text-white flex items-center justify-center gap-1">
                      ₹4,100
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Coordination</span>
                    <span className="text-sm font-bold text-indigo-400">Single PO</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleApprove('option-b')}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Option B (Central Hub)</span>
              </button>
            </div>
          </div>

          {/* Success Toast when approved */}
          {approvedTransfer && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 animate-in fade-in slide-in-from-top-2 duration-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Transfer Order #TR-AHD-042 Approved!</strong> Reserved stock allocated, dispatch notification sent to warehouse supervisor, and stock ledger logged.
                </span>
              </span>
              <span className="text-slate-400 font-mono text-[11px]">Ledger Tx: #TX9481</span>
            </div>
          )}
        </div>

        {/* Generated Image Showcase */}
        <div className="rounded-3xl p-1 bg-gradient-to-b from-emerald-500/20 via-slate-800/40 to-slate-900 border border-emerald-500/20 shadow-2xl overflow-hidden">
          <div className="rounded-2xl overflow-hidden bg-slate-950">
            <img
              src="/shortage_resolver_preview.jpg"
              alt="Bizpilot Smart Shortage Resolver UI"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
