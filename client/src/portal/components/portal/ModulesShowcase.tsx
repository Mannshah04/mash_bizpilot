import React, { useState } from 'react';
import {
  LayoutDashboard,
  Boxes,
  Warehouse,
  GitBranch,
  Truck,
  ShoppingCart,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ModuleItem {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  icon: React.ElementType;
  description: string;
  capabilities: string[];
  highlightMetric: string;
  highlightLabel: string;
}

const MODULES: ModuleItem[] = [
  {
    id: 'dashboard',
    name: '1. Business Dashboard',
    badge: 'Core V1',
    tagline: 'Real-time financial & operational health across all entities',
    icon: LayoutDashboard,
    description:
      'Consolidates multi-branch stock valuation, cash tied up in idle inventory, urgent stockout alerts, pending goods receipts, and prioritized actions into a single executive command center.',
    capabilities: [
      'Total stock valuation in INR across all warehouses & branches',
      'Instant visibility into capital trapped in non-moving items (>90 days)',
      'Live pending operations: unfulfilled sales orders, unposted goods receipts',
      'Automated daily insights on working capital optimization',
    ],
    highlightMetric: '₹4.85 Cr',
    highlightLabel: 'Live Multi-Branch Stock Value Monitored',
  },
  {
    id: 'catalog',
    name: '2. Product & Catalog Master',
    badge: 'Core V1',
    tagline: 'Multi-variant SKU repository decoupled from warehouse balances',
    icon: Boxes,
    description:
      'Maintains clean product identity distinct from location balances. Supports multi-variant tracking (size, color, grade), barcode/QR labeling, supplier links, and batch-level manufacturing and expiry tracking.',
    capabilities: [
      'Strict separation of product master from warehouse balance records',
      'Batch-level traceability with manufacturing & expiry dates',
      'Per-warehouse reorder thresholds, safety stock, and maximum limits',
      'Barcode & QR code generation with bulk CSV/Excel import validation',
    ],
    highlightMetric: '14,230+',
    highlightLabel: 'Unique SKUs Managed Concurrently',
  },
  {
    id: 'inventory',
    name: '3. Inventory & Multi-Branch',
    badge: 'Core V1',
    tagline: 'Atomic stock movements, immutable ledger & multi-branch matrix',
    icon: Warehouse,
    description:
      'Tracks physical on-hand, committed reservations, and true available stock across Ahmedabad, Surat, Vadodara, and Central Warehouses. Every movement is append-only and cryptographically auditable.',
    capabilities: [
      'Multi-branch stock matrix with real-time location breakdown',
      'Explicit semantics: On-hand, Reserved, Safety Stock, and Available',
      'Immutable append-only stock movement ledger (compensating entries only)',
      'Inter-branch transfer workflows: dispatch, in-transit, and reconciled receipt',
    ],
    highlightMetric: '100%',
    highlightLabel: 'Traceable Audit Trail on Every Movement',
  },
  {
    id: 'shortage',
    name: '4. Smart Shortage Resolver',
    badge: 'Headline Differentiator',
    tagline: 'Smart transfer optimization balancing logistics speed and transit cost',
    icon: GitBranch,
    description:
      'When a branch faces a shortage (e.g. 50 units needed with only 8 on hand), the resolver analyzes eligible sister warehouses, computes transit times & road freight, and outputs ranked transfer proposals.',
    capabilities: [
      'Automatic shortage computation: required quantity minus usable unreserved stock',
      'Multi-criteria ranking strategies: Fastest Delivery, Lowest Cost, or Balanced',
      'Split-transfer intelligence: combines stock from multiple regional hubs',
      'Strict human-in-the-loop approval before executing transfer dispatch',
    ],
    highlightMetric: '2h 45m',
    highlightLabel: 'Average Inter-Branch Resolution Time',
  },
  {
    id: 'procurement',
    name: '5. Multi-Vendor Intelligence',
    badge: 'Procurement V1',
    tagline: 'Supplier scorecards, landed cost & intelligent reorder recommendations',
    icon: Truck,
    description:
      'Compares multiple suppliers per product without duplicate masters. Evaluates effective landed costs (price + freight), historical lead times, on-time delivery rates, and quality rejection metrics.',
    capabilities: [
      'Separate tracking of cheapest vendor, fastest vendor, and most reliable vendor',
      'Landed cost calculation factoring freight, taxes, and supplier order multiples',
      'Supplier scorecards with historical price trends & quality acceptance rates',
      'Smart reorder engine explaining price delta vs delivery urgency',
    ],
    highlightMetric: '18% Avg',
    highlightLabel: 'Procurement Landed Cost Savings',
  },
  {
    id: 'sales-gst',
    name: '6. Sales & Indian GST Suite',
    badge: 'Statutory V1',
    tagline: 'Seamless order fulfillment with automated CGST, SGST & IGST determination',
    icon: ShoppingCart,
    description:
      'End-to-end sales lifecycle from confirmation to partial dispatch and returns. Automatically enforces statutory Indian GST rules based on place-of-supply, HSN/SAC codes, and branch GSTINs.',
    capabilities: [
      'Sales confirmation stock reservations (does not reduce physical count until dispatch)',
      'Automated place-of-supply determination: CGST + SGST (intra) vs IGST (inter)',
      'HSN/SAC classification, sequential tax invoice generation & credit/debit notes',
      'Partial fulfillment, backorders, and customer return condition disposition',
    ],
    highlightMetric: '100% GST',
    highlightLabel: 'Compliant Invoicing & E-Way Bill Ready',
  },
  {
    id: 'analytics',
    name: '7. BI, Aging & Time Machine',
    badge: 'Analytics V1',
    tagline: 'Historical balance reconstruction and aging bands (0 to 180+ days)',
    icon: BarChart3,
    description:
      'Inspect past inventory balances at any historical date using the movement ledger. Categorize stock into aging bands (0-30, 31-60, 61-90, 91-180, >180 days) to prevent dead capital buildup.',
    capabilities: [
      'Historical Stock Time Machine: inspect exact stock at any past date in time',
      'Period-vs-period comparison (Diwali sales YoY, Month-on-Month, custom ranges)',
      'Inventory aging breakdown: pinpoint slow-moving vs dead capital',
      'Demand forecasting with measured forecast accuracy (WAPE / MAE)',
    ],
    highlightMetric: '5 Aging Bands',
    highlightLabel: 'Instant Capital Trapped Diagnostics',
  },
  {
    id: 'loss-prevention',
    name: '8. Loss Prevention & Audit',
    badge: 'Security & Audit',
    tagline: 'Blind cycle counts, shrinkage benchmarking, and dual-approval workflows',
    icon: ShieldCheck,
    description:
      'Prevents inventory shrinkage, warehouse theft, and accounting discrepancies through blind counting, maker-checker authorization, and cross-branch loss benchmarking.',
    capabilities: [
      'Blind physical stock count mode concealing system expected numbers',
      'Maker-checker dual approval for high-value write-offs',
      'Damage and spoilage incident logging with cause categorization',
      'Cross-branch shrinkage benchmarks and loss audit trail',
    ],
    highlightMetric: '100% Traceable',
    highlightLabel: 'Audit-Compliant Loss Prevention',
  },
];

export const ModulesShowcase: React.FC = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('shortage');
  const activeModule = MODULES.find((m) => m.id === selectedModuleId) || MODULES[0];
  const Icon = activeModule.icon;

  return (
    <section id="features" className="py-20 bg-slate-950/60 border-t border-b border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Complete Functional Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            8 Integrated Modules.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              One Unified Platform.
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Engineered as a business application first. Every stock movement is atomic, every branch is connected, and AI powers your decision-making.
          </p>
        </div>

        {/* Modules Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-10">
          {MODULES.map((mod) => {
            const isSelected = mod.id === selectedModuleId;
            const TabIcon = mod.icon;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setSelectedModuleId(mod.id)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/20 ring-1 ring-indigo-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold leading-tight line-clamp-2">
                  {mod.name.replace(/^\d+\.\s*/, '')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Module Detail Card */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-white">{activeModule.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                      {activeModule.badge}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-300 font-medium">{activeModule.tagline}</p>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activeModule.description}
              </p>

              {/* Capabilities checklist */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Capabilities & Business Rules:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModule.capabilities.map((cap, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-300 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Metric Card / Showcase */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />

                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-2">
                  Module Impact Metric
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {activeModule.highlightMetric}
                </div>
                <p className="text-sm text-slate-400 mt-2 font-medium">
                  {activeModule.highlightLabel}
                </p>

                <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Ready for Deployment
                  </span>
                  <a
                    href="#resolver-demo"
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <span>View Interactive Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
