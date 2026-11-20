import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Zap,
  Clock,
  Table,
  LayoutGrid,
  Info,
  Building2,
  Boxes,
  HelpCircle,
  TrendingUp,
  Infinity as InfinityIcon,
  CheckCircle2,
} from 'lucide-react';
import { CheckoutModal, type PlanDetails } from './CheckoutModal';

export const PLANS: PlanDetails[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 799,
    annualPrice: 8629,
    annualPriceTotal: 8629,
    annualMonthlyEquiv: 719,
    branches: '2 Branches',
    users: '5 / Branch',
    products: '5,000 Products',
    warehouses: '3 Warehouses',
    skus: '5,000 Products',
    tagline: 'Ideal for single or dual-branch trading firms, retail shops & growing MSMEs.',
    badge: 'Starter Tier',
    isPopular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 1599,
    annualPrice: 17269,
    annualPriceTotal: 17269,
    annualMonthlyEquiv: 1439,
    branches: '10 Branches',
    users: '10 / Branch',
    products: '25,000 Products',
    warehouses: '10 Warehouses',
    skus: '25,000 Products',
    tagline: 'Best for multi-branch businesses, franchise networks & expanding distributors.',
    badge: 'Most Popular',
    isPopular: true,
  },
  {
    id: 'business',
    name: 'Business',
    monthlyPrice: 3999,
    annualPrice: 43189,
    annualPriceTotal: 43189,
    annualMonthlyEquiv: 3599,
    branches: 'Infinity (Unlimited)',
    users: 'Infinity (Unlimited)',
    products: 'Infinity (Unlimited)',
    warehouses: 'Infinity (Unlimited)',
    skus: 'Unlimited Products',
    tagline: 'Uncapped power for large distributors, manufacturing plants & statewide chains.',
    badge: 'All-Inclusive & Unlimited',
    isPopular: false,
  },
];

interface SpecRow {
  category: string;
  name: string;
  key: string;
  tooltip?: string;
  starter: string;
  growth: string;
  business: string;
}

const COMPARISON_ROWS: SpecRow[] = [
  // ── 1. Pricing & Capacities
  {
    category: 'Scale & Capacities',
    name: 'Monthly price (₹)',
    key: 'monthly_price',
    tooltip: 'Standard per-month recurring subscription fee (excl. 18% GST)',
    starter: '799',
    growth: '1599',
    business: '3999',
  },
  {
    category: 'Scale & Capacities',
    name: 'Annual price (₹)',
    key: 'annual_price',
    tooltip: 'Lump-sum annual upfront billing (~10% discounted equivalent)',
    starter: '8629',
    growth: '17269',
    business: '43189',
  },
  {
    category: 'Scale & Capacities',
    name: 'Branches',
    key: 'branches',
    tooltip: 'Maximum physical branches, retail outlets, or franchise counters supported',
    starter: '2',
    growth: '10',
    business: 'Infinity',
  },
  {
    category: 'Scale & Capacities',
    name: 'Users',
    key: 'users',
    tooltip: 'Staff & manager logins allowed per branch location',
    starter: '5/Branch',
    growth: '10/Branch',
    business: 'Infinity',
  },
  {
    category: 'Scale & Capacities',
    name: 'Products',
    key: 'products',
    tooltip: 'Catalog catalog capacity for active items, SKUs, and variations',
    starter: '5000',
    growth: '25000',
    business: 'Infinity',
  },
  {
    category: 'Scale & Capacities',
    name: 'Warehouses',
    key: 'warehouses',
    tooltip: 'Independent godowns, staging areas, and dispatch distribution hubs',
    starter: '3',
    growth: '10',
    business: 'Infinity',
  },

  // ── 2. Core Operations & Inventory
  {
    category: 'Inventory & Operations',
    name: 'Inventory management',
    key: 'inv_mgmt',
    tooltip: 'Live ledger, real-time stock balances, batch/lot tracking, and GRN receipts',
    starter: 'Yes',
    growth: 'Yes',
    business: 'Yes',
  },
  {
    category: 'Inventory & Operations',
    name: 'Multi-branch management',
    key: 'multi_branch',
    tooltip: 'Cross-branch stock transfers, inter-branch road transit matrix, and sister visibility',
    starter: 'Basic',
    growth: 'Yes',
    business: 'Yes',
  },
  {
    category: 'Inventory & Operations',
    name: 'Product 360°',
    key: 'product_360',
    tooltip: 'Comprehensive 360° analytics, supplier comparison, nearest-branch availability & landed margins',
    starter: 'Basic',
    growth: 'Yes',
    business: 'Yes',
  },
  {
    category: 'Inventory & Operations',
    name: 'Reorder Point (ROP) & Safety Stock',
    key: 'rop',
    tooltip: 'Automated purchase threshold alerts balancing buffer levels and demand',
    starter: 'Basic',
    growth: 'Yes',
    business: 'Yes',
  },
  {
    category: 'Inventory & Operations',
    name: 'Barcode',
    key: 'barcode',
    tooltip: 'EAN-13 / Code128 generation, thermal sticker printing, and USB/camera POS scanning',
    starter: 'Yes',
    growth: 'Yes',
    business: 'Yes',
  },

  // ── 3. Finance & Advanced Optimization
  {
    category: 'Finance & Optimization',
    name: 'Financial management',
    key: 'finance_mgmt',
    tooltip: 'Double-entry accounting, Daily Cash Book, branch expense tracking & GST returns',
    starter: 'Basic',
    growth: 'Yes',
    business: 'Yes',
  },
  {
    category: 'Finance & Optimization',
    name: 'Inventory Carry Cost Management',
    key: 'carry_cost',
    tooltip: 'Calculates opportunity cost of capital (18%), godown space burden (SAC 996729), and insurance',
    starter: 'Limited',
    growth: 'Basic',
    business: 'Yes',
  },
  {
    category: 'Finance & Optimization',
    name: 'Advanced analytics',
    key: 'analytics',
    tooltip: 'Interactive gross margin trends, POS sales velocity graphs, and inventory turnover ratios',
    starter: 'Basic',
    growth: 'Yes',
    business: 'Yes',
  },
  {
    category: 'Finance & Optimization',
    name: 'Demand-based stock allocation',
    key: 'demand_stock',
    tooltip: 'Intelligently reallocates inventory to high-demand branches while protecting depleted branches',
    starter: 'Basic',
    growth: 'Yes',
    business: 'Yes',
  },

  // ── 4. Extensibility & Support
  {
    category: 'Extensibility & Enterprise',
    name: 'Custom reports',
    key: 'custom_reports',
    tooltip: 'Custom filtered CSV exports, automated management summaries & aging bands',
    starter: 'Limited',
    growth: 'Limited',
    business: 'Yes',
  },
  {
    category: 'Extensibility & Enterprise',
    name: 'API integration',
    key: 'api_integration',
    tooltip: 'REST API webhooks, Tally/Zoho sync, e-Way bill & e-Invoice portal integration',
    starter: 'Limited',
    growth: 'Limited',
    business: 'Yes',
  },
  {
    category: 'Extensibility & Enterprise',
    name: 'Custom workflows',
    key: 'custom_workflows',
    tooltip: 'Custom purchase approval hierarchies, automated reorder triggers & SMS/WhatsApp alerts',
    starter: 'Limited',
    growth: 'Limited',
    business: 'Yes',
  },
  {
    category: 'Extensibility & Enterprise',
    name: 'Priority support',
    key: 'priority_support',
    tooltip: 'Dedicated account manager, rapid phone/WhatsApp support & remote setup assistance',
    starter: 'Yes',
    growth: 'Yes',
    business: 'Yes',
  },
];

export const PricingPurchaseSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanDetails | null>(null);
  const [activeViewTab, setActiveViewTab] = useState<'cards' | 'matrix'>('cards');
  const [recommendedFilter, setRecommendedFilter] = useState<'all' | 'starter' | 'growth' | 'business'>('all');

  const handleOpenCheckout = (plan: PlanDetails) => {
    setSelectedPlanForCheckout(plan);
  };

  const renderBadge = (val: string) => {
    if (val === 'Yes') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Yes</span>
        </span>
      );
    }
    if (val === 'Basic') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-semibold">
          <Zap className="w-3 h-3 text-sky-400" />
          <span>Basic</span>
        </span>
      );
    }
    if (val === 'Limited') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>Limited</span>
        </span>
      );
    }
    if (val === 'Infinity') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold shadow-sm">
          <InfinityIcon className="w-3.5 h-3.5" />
          <span>Infinity</span>
        </span>
      );
    }
    return <span className="font-bold text-white text-xs sm:text-sm">{val}</span>;
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-slate-950">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-indigo-500/10 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <CreditCard className="w-3.5 h-3.5" />
            BizPilot Transparent Subscription Plans
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Choose the Perfect Scale for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
              Your Business.
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400">
            From single retail shops to statewide franchise chains — eliminate dead stock, automate stock replenishment, and track multi-branch profitability seamlessly.
          </p>

          {/* Interactive Business Scale Selector Filter */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-1">Find your fit:</span>
            <button
              type="button"
              onClick={() => setRecommendedFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                recommendedFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Plans
            </button>
            <button
              type="button"
              onClick={() => setRecommendedFilter('starter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                recommendedFilter === 'starter'
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>1-2 Branches</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">Starter</span>
            </button>
            <button
              type="button"
              onClick={() => setRecommendedFilter('growth')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                recommendedFilter === 'growth'
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>3-10 Branches</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">Growth</span>
            </button>
            <button
              type="button"
              onClick={() => setRecommendedFilter('business')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                recommendedFilter === 'business'
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>10+ / Statewide</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">Business</span>
            </button>
          </div>

          {/* Monthly / Annual Toggle + View Switcher */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {/* Monthly / Annual Pill */}
            <div className="flex items-center gap-3 bg-slate-900/90 p-1.5 rounded-full border border-slate-800 shadow-inner">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  !isAnnual ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isAnnual ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Save ~10%
                </span>
              </button>
            </div>

            {/* View Mode Toggle: Cards vs Full Matrix */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveViewTab('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeViewTab === 'cards'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="View Tier Overview Cards"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Plans View</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveViewTab('matrix')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeViewTab === 'matrix'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="View Detailed 19-Feature Comparison Spreadsheet"
              >
                <Table className="w-3.5 h-3.5" />
                <span>Feature Matrix</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── VIEW 1: PRICING CARDS ── */}
        {activeViewTab === 'cards' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── CARD 1: STARTER ── */}
            <div
              className={`rounded-3xl bg-slate-900/90 border p-8 shadow-xl flex flex-col justify-between transition-all relative ${
                recommendedFilter === 'starter'
                  ? 'border-indigo-500 ring-4 ring-indigo-500/20 scale-[1.02]'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {recommendedFilter === 'starter' && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider shadow">
                    ✓ Recommended For Your Scale
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white">Starter</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                    1-2 Branches
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Ideal for retail stores, single/dual branch traders & MSMEs upgrading from spreadsheets.
                </p>

                {/* Price Block */}
                <div className="mb-6 pb-6 border-b border-slate-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-white">
                      ₹{isAnnual ? '8,629' : '799'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {isAnnual ? '/ year' : '/ month'} <span className="text-[11px] text-slate-500">(+18% GST)</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                    {isAnnual ? (
                      <>
                        <span className="text-emerald-400 font-bold">~₹719/mo equivalent</span>
                        <span>•</span>
                        <span className="text-slate-400">Save ₹959/yr vs monthly</span>
                      </>
                    ) : (
                      <span>Standard monthly recurring license</span>
                    )}
                  </p>
                </div>

                {/* Capacity Chips */}
                <div className="grid grid-cols-2 gap-2 mb-6 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Branches</span>
                    <strong className="text-white">2 Branches</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Staff Users</span>
                    <strong className="text-white">5 / Branch</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Product SKUs</span>
                    <strong className="text-white">5,000 Products</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Warehouses</span>
                    <strong className="text-white">3 Godowns</strong>
                  </div>
                </div>

                {/* Feature Highlights */}
                <div className="space-y-3 text-xs text-slate-300 mb-8">
                  <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                    Core Capabilities:
                  </span>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Complete Inventory Management & GRN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Barcode Generation & Scanner Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Basic Multi-Branch Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Basic Product 360° & Stock Reorder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Basic Financial Management & Cash Book</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Priority Support Included</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenCheckout(PLANS[0])}
                className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2 hover:border-slate-600"
              >
                <span>Subscribe to Starter Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ── CARD 2: GROWTH (MOST POPULAR) ── */}
            <div
              className={`rounded-3xl bg-gradient-to-b from-indigo-950/70 via-slate-900 to-slate-900 border-2 border-indigo-500 p-8 shadow-2xl relative flex flex-col justify-between ring-4 ring-indigo-500/20 transition-all ${
                recommendedFilter === 'growth' || recommendedFilter === 'all'
                  ? 'scale-[1.03] z-10'
                  : 'hover:border-indigo-400'
              }`}
            >
              {/* Featured Pill */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular for MSMEs
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 mt-1">
                  <h3 className="text-2xl font-bold text-white">Growth</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                    Multi-Branch
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                  Best for expanding multi-branch franchises, wholesale distributors & active hubs.
                </p>

                {/* Price Block */}
                <div className="mb-6 pb-6 border-b border-slate-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white">
                      ₹{isAnnual ? '17,269' : '1,599'}
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      {isAnnual ? '/ year' : '/ month'} <span className="text-[11px] text-slate-400">(+18% GST)</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-2 flex items-center gap-1.5">
                    {isAnnual ? (
                      <>
                        <span>~₹1,439/mo equivalent</span>
                        <span>•</span>
                        <span>Save ₹1,919/yr with Annual</span>
                      </>
                    ) : (
                      <span>Full multi-branch suite billed monthly</span>
                    )}
                  </p>
                </div>

                {/* Capacity Chips */}
                <div className="grid grid-cols-2 gap-2 mb-6 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-200 font-mono">
                  <div>
                    <span className="text-[10px] text-indigo-300 block uppercase font-sans">Branches</span>
                    <strong className="text-white text-sm">10 Branches</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-300 block uppercase font-sans">Staff Users</span>
                    <strong className="text-white text-sm">10 / Branch</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-300 block uppercase font-sans">Product SKUs</span>
                    <strong className="text-white text-sm">25,000 Products</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-300 block uppercase font-sans">Warehouses</span>
                    <strong className="text-white text-sm">10 Godowns</strong>
                  </div>
                </div>

                {/* Feature Highlights */}
                <div className="space-y-3 text-xs text-slate-200 mb-8">
                  <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                    Everything in Starter, plus:
                  </span>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-white">Full Multi-Branch Stock Matrix & Inter-Branch Transfers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-white">Full Product 360° Matrix with GPS Road Logistics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-white">Full Auto-Reorder & Safety Stock Calculations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="font-semibold text-indigo-300">Demand-Based Stock Replenishment (High-Demand Protection)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="font-semibold text-indigo-300">Advanced Visual Analytics & Branch Health Comparison</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Basic Inventory Carry Cost Management</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenCheckout(PLANS[1])}
                className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Purchase Growth License</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* ── CARD 3: BUSINESS (UNLIMITED) ── */}
            <div
              className={`rounded-3xl bg-slate-900/90 border p-8 shadow-xl flex flex-col justify-between transition-all relative ${
                recommendedFilter === 'business'
                  ? 'border-indigo-500 ring-4 ring-indigo-500/20 scale-[1.02]'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {recommendedFilter === 'business' && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider shadow">
                    ✓ Recommended For Enterprise Scale
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white">Business</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center gap-1">
                    <InfinityIcon className="w-3.5 h-3.5" /> Unlimited Scale
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Uncapped power for manufacturing plants, statewide distributor networks & enterprise ERP users.
                </p>

                {/* Price Block */}
                <div className="mb-6 pb-6 border-b border-slate-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-white">
                      ₹{isAnnual ? '43,189' : '3,999'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {isAnnual ? '/ year' : '/ month'} <span className="text-[11px] text-slate-500">(+18% GST)</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                    {isAnnual ? (
                      <>
                        <span className="text-emerald-400 font-bold">~₹3,599/mo equivalent</span>
                        <span>•</span>
                        <span className="text-slate-400">Save ₹4,799/yr vs monthly</span>
                      </>
                    ) : (
                      <span>Unlimited enterprise scale billed monthly</span>
                    )}
                  </p>
                </div>

                {/* Capacity Chips */}
                <div className="grid grid-cols-2 gap-2 mb-6 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Branches</span>
                    <strong className="text-indigo-300 flex items-center gap-1">
                      <InfinityIcon className="w-3 h-3" /> Unlimited
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Staff Users</span>
                    <strong className="text-indigo-300 flex items-center gap-1">
                      <InfinityIcon className="w-3 h-3" /> Unlimited
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Product SKUs</span>
                    <strong className="text-indigo-300 flex items-center gap-1">
                      <InfinityIcon className="w-3 h-3" /> Unlimited
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Warehouses</span>
                    <strong className="text-indigo-300 flex items-center gap-1">
                      <InfinityIcon className="w-3 h-3" /> Unlimited
                    </strong>
                  </div>
                </div>

                {/* Feature Highlights */}
                <div className="space-y-3 text-xs text-slate-300 mb-8">
                  <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                    Enterprise Exclusives:
                  </span>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-white">Full Inventory Carry Cost Optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-white">Custom Bi-Weekly & Monthly Business Reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="font-semibold text-indigo-300">Open REST API Integration (Tally / Zoho / Webhooks)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="font-semibold text-indigo-300">Custom Multi-Level Approval Workflows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dedicated Implementation Manager & 24/7 SLA</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenCheckout(PLANS[2])}
                className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2 hover:border-slate-600"
              >
                <span>Purchase Business License</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ── VIEW 2: FULL DETAILED 19-ROW COMPARISON MATRIX (EXACT MATCH TO UPLOADED SPREADSHEET) ── */}
        {activeViewTab === 'matrix' && (
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden">
            {/* Table Header Bar */}
            <div className="p-4 sm:p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Table className="w-5 h-5 text-indigo-400" />
                  <span>BizPilot Subscription Plans: Detailed Specifications</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  19-point feature matrix comparing Starter (₹799/mo), Growth (₹1,599/mo), and Business (₹3,999/mo).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAnnual(!isAnnual)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Toggle Pricing:</span>
                  <span className="text-emerald-400 font-bold">{isAnnual ? 'Annual (Save ~10%)' : 'Monthly'}</span>
                </button>
              </div>
            </div>

            {/* Responsive Table Wrap */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-300">
                    <th className="py-4 px-6 font-bold uppercase text-[11px] tracking-wider w-[34%]">
                      Details / Feature
                    </th>
                    <th className="py-4 px-4 font-bold text-center w-[22%]">
                      <div className="text-sm font-extrabold text-white">Starter</div>
                      <div className="text-[11px] font-normal text-slate-400 mt-0.5">
                        ₹{isAnnual ? '8,629/yr' : '799/mo'}
                      </div>
                    </th>
                    <th className="py-4 px-4 font-bold text-center w-[22%] bg-indigo-950/20 border-x border-indigo-500/20">
                      <div className="text-sm font-extrabold text-white flex items-center justify-center gap-1">
                        <span>Growth</span>
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-400 mt-0.5">
                        ₹{isAnnual ? '17,269/yr' : '1,599/mo'}
                      </div>
                    </th>
                    <th className="py-4 px-4 font-bold text-center w-[22%]">
                      <div className="text-sm font-extrabold text-white flex items-center justify-center gap-1">
                        <span>Business</span>
                        <InfinityIcon className="w-3.5 h-3.5 text-indigo-300" />
                      </div>
                      <div className="text-[11px] font-normal text-slate-400 mt-0.5">
                        ₹{isAnnual ? '43,189/yr' : '3,999/mo'}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {COMPARISON_ROWS.map((row, idx) => {
                    const isGroupHeader = idx === 0 || row.category !== COMPARISON_ROWS[idx - 1].category;

                    return (
                      <React.Fragment key={row.key}>
                        {isGroupHeader && (
                          <tr className="bg-slate-950/70">
                            <td
                              colSpan={4}
                              className="py-2.5 px-6 font-bold uppercase text-[10px] tracking-wider text-indigo-400/90 border-t border-slate-800"
                            >
                              {row.category}
                            </td>
                          </tr>
                        )}
                        <tr className="hover:bg-slate-850/50 transition-colors">
                          <td className="py-3.5 px-6 text-slate-200">
                            <div className="font-medium flex items-center gap-1.5">
                              <span>{row.name}</span>
                              {row.tooltip && (
                                <span title={row.tooltip} className="cursor-help text-slate-500 hover:text-slate-300">
                                  <Info className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {renderBadge(row.starter)}
                          </td>
                          <td className="py-3.5 px-4 text-center bg-indigo-950/10 border-x border-indigo-500/20 font-semibold">
                            {renderBadge(row.growth)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {renderBadge(row.business)}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-950/90 border-t border-slate-800">
                    <td className="py-4 px-6 text-slate-400 font-semibold">
                      Action
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenCheckout(PLANS[0])}
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all cursor-pointer w-full max-w-[140px]"
                      >
                        Choose Starter
                      </button>
                    </td>
                    <td className="py-4 px-4 text-center bg-indigo-950/20 border-x border-indigo-500/20">
                      <button
                        type="button"
                        onClick={() => handleOpenCheckout(PLANS[1])}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition-all cursor-pointer w-full max-w-[140px] shadow"
                      >
                        Choose Growth
                      </button>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenCheckout(PLANS[2])}
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all cursor-pointer w-full max-w-[140px]"
                      >
                        Choose Business
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* ── RED NOTE BAR AT BOTTOM (EXACT MATCH TO ATTACHED SPREADSHEET IMAGE) ── */}
        <div className="mt-8 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 text-white px-5 py-3.5 text-xs sm:text-sm font-bold shadow-xl flex items-center justify-center gap-2 text-center border border-rose-500/30">
          <span className="px-2 py-0.5 rounded bg-black/25 text-white uppercase text-[11px] font-black tracking-wider">
            Note
          </span>
          <span>
            Prices exclude 18% GST. Proposed launch pricing; validate with customers before subscription activation.
          </span>
        </div>

        {/* Trust & GST Input Credit Card */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3 text-left">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white block text-sm">Instant Indian GST Input Credit Invoicing</strong>
              <span>Enter your GSTIN during checkout to claim 100% input tax credit (ITC) on all subscription fees.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveViewTab(activeViewTab === 'cards' ? 'matrix' : 'cards')}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shrink-0 cursor-pointer border border-slate-700 transition-colors"
          >
            {activeViewTab === 'cards' ? 'Compare Full 19 Features' : 'Back to Cards View'}
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedPlanForCheckout && (
        <CheckoutModal
          isOpen={!!selectedPlanForCheckout}
          onClose={() => setSelectedPlanForCheckout(null)}
          selectedPlan={selectedPlanForCheckout}
          isAnnual={isAnnual}
        />
      )}
    </section>
  );
};
export default PricingPurchaseSection;
