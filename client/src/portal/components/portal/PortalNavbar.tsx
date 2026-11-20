import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Sparkles,
  Layers,
  Bot,
  CreditCard,
  ArrowRight,
  Menu,
  X,
  ShieldCheck,
  LogIn,
} from 'lucide-react';

interface PortalNavbarProps {
  onOpenPricing?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToOnboarding?: () => void;
}

export const PortalNavbar: React.FC<PortalNavbarProps> = ({
  onOpenPricing,
  onNavigateToLogin,
  onNavigateToOnboarding,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLoginClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else {
      window.location.hash = '#/login';
    }
  };

  const handleOnboardingClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onNavigateToOnboarding) {
      onNavigateToOnboarding();
    } else {
      window.location.hash = '#/step-1';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="#/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">Bizpilot</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Enterprise ERP
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Multi-Branch Inventory & Purchasing Platform for MSMEs
            </p>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors flex items-center gap-1">
            <Layers className="w-4 h-4 text-indigo-400" />
            Modules
          </a>
          <a href="#resolver-demo" className="hover:text-white transition-colors flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Shortage Resolver
          </a>

          <a
            href="#pricing"
            onClick={(e) => {
              if (onOpenPricing) {
                e.preventDefault();
                onOpenPricing();
              }
            }}
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            Pricing & Plans
          </a>
          <a href="#security" className="hover:text-white transition-colors flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Security & GST
          </a>
        </nav>

        {/* CTA Buttons - Login is ALWAYS visible */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={handleLoginClick}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer ring-1 ring-white/10"
            title="Log in to BizzPilot ERP System"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
          <button
            type="button"
            onClick={handleOnboardingClick}
            className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer"
          >
            Client Onboarding
          </button>
          <a
            href="#pricing"
            onClick={(e) => {
              if (onOpenPricing) {
                e.preventDefault();
                onOpenPricing();
              }
            }}
            className="hidden md:inline-flex px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/25 ring-1 ring-white/10 transition-all items-center gap-1.5 group cursor-pointer"
          >
            <span>Purchase License</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <button
            type="button"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleLoginClick(e);
            }}
            className="w-full py-2.5 text-center text-xs font-bold text-white bg-indigo-600 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / ERP Login</span>
          </button>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-300 hover:text-white font-medium"
          >
            Product Modules
          </a>
          <a
            href="#resolver-demo"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-300 hover:text-white font-medium"
          >
            Smart Shortage Resolver
          </a>

          <a
            href="#pricing"
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenPricing) onOpenPricing();
            }}
            className="block py-2 text-sm text-slate-300 hover:text-white font-medium"
          >
            Plans & Pricing
          </a>
          <div className="pt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleOnboardingClick(e);
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-slate-200 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer"
            >
              First-Time User Onboarding Flow
            </button>
            <a
              href="#pricing"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenPricing) onOpenPricing();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-white bg-emerald-600 rounded-xl shadow-lg"
            >
              Purchase License
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
