import React from 'react';
import {
  ShieldCheck,
  Database,
  Users,
  KeyRound,
  FileCheck2,
} from 'lucide-react';

export const SecurityArchitecture: React.FC = () => {
  return (
    <section id="security" className="py-20 bg-slate-950/80 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Enterprise-Grade Protection
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Security & Tenant Isolation
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Engineered with strict multi-tenant boundaries, append-only immutable ledgers, and role-based permissions scoped to specific branches and warehouses.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Strict Multi-Tenancy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every query enforces mandatory <code>company_id</code> scope. Data between competing distributors or retailers can never leak across accounts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Append-Only Ledger</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stock balances cannot be modified through direct database edits. All adjustments require an auditable, compensating double-entry movement.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Granular Branch Roles</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              7 distinct operational roles: Owner, Branch Manager, Warehouse Staff, Purchaser, Sales Staff, Accountant, and Viewer with branch-level scoping.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Mandatory 2FA (TOTP)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              First-time onboarding integrates hardware-standard RFC 6238 TOTP (Google Authenticator, Authy) to safeguard privileged operations and purchase approvals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
