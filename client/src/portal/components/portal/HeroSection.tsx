import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Boxes,
  Zap,
  Play,
  CheckCircle2,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenPricing: () => void;
  onExploreDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenPricing,
  onExploreDemo,
}) => {
  return (
    <section className="relative pt-12 pb-24 overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-indigo-500/15 via-violet-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-semibold text-slate-200 shadow-xl shadow-indigo-500/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-indigo-400 font-bold">BIZPILOT V1.0</span>
            <span className="text-slate-500">|</span>
            <span>Decision-Support AI for Indian MSMEs & Distributors</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Never Run Out of Stock.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400">
              Never Tie Up Idle Cash.
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            The multi-branch inventory, GST procurement, and AI shortage-resolution suite engineered for India&apos;s wholesalers, retail chains, and growing enterprises.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenPricing}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 ring-1 ring-white/20 transition-all cursor-pointer flex items-center justify-center gap-2.5 group"
            >
              <span>Purchase System License</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 text-slate-200 font-semibold text-sm border border-slate-700/80 hover:border-slate-600 shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Explore Interactive Live Demos</span>
            </button>

            <Link
              to="/step-1"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold text-sm border border-indigo-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Start 4-Step Onboarding</span>
            </Link>
          </div>

          {/* Feature Highlights Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-Branch Stock Matrix
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Smart Shortage Resolver
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-Vendor Quotations
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Indian GST & HSN Ready
            </span>
          </div>
        </div>

        {/* Dashboard Mockup Display */}
        <div className="relative mt-4 max-w-5xl w-full mx-auto">
          {/* Glowing frame wrapper */}
          <div className="relative rounded-3xl p-1 sm:p-2 bg-gradient-to-b from-indigo-500/40 via-violet-500/20 to-slate-900/40 shadow-2xl shadow-indigo-950/60 ring-1 ring-white/10">
            <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              {/* Window Header Bar */}
              <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-3 text-xs font-mono text-slate-400">
                    https://app.bizpilot.in/dashboard/overview
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    Live Demo Preview
                  </span>
                </div>
              </div>

              {/* Generated Image Mockup */}
              <div className="relative group">
                <img
                  src="/hero_dashboard_preview.jpg"
                  alt="Bizpilot AI Inventory SaaS Dashboard Mockup"
                  className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-500"
                />

                {/* Floating Overlay Badge 1 */}
                <div className="absolute top-6 left-6 hidden md:flex items-center gap-3 p-3 rounded-2xl bg-slate-950/90 border border-slate-700/80 backdrop-blur-md shadow-2xl">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Stock Value</span>
                    <p className="text-base font-bold text-white">₹4.85 Crore <span className="text-xs text-emerald-400">+2.1%</span></p>
                  </div>
                </div>

                {/* Floating Overlay Badge 2 */}
                <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-3 p-3 rounded-2xl bg-slate-950/90 border border-indigo-500/40 backdrop-blur-md shadow-2xl ring-1 ring-indigo-500/20">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">AI Shortage Detection</span>
                    <p className="text-sm font-bold text-indigo-300">Ahmedabad: 42 Units Shortage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Impact Stats Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-white block">₹18.4L</span>
            <p className="mt-1 text-xs text-slate-400 font-medium">Avg. Working Capital Unlocked</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 block">35%</span>
            <p className="mt-1 text-xs text-slate-400 font-medium">Dead & Expired Stock Reduction</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-indigo-400 block">99.2%</span>
            <p className="mt-1 text-xs text-slate-400 font-medium">On-Time Order Dispatch Rate</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-violet-400 block">100%</span>
            <p className="mt-1 text-xs text-slate-400 font-medium">Indian GST & Audit-Trail Ready</p>
          </div>
        </div>
      </div>
    </section>
  );
};
