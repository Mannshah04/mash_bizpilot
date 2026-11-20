import React, { useState } from 'react';
import {
  Truck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface VendorData {
  id: string;
  name: string;
  tier: 'Gold Preferred' | 'Silver' | 'Bronze';
  unitPrice: number;
  freightCost: number;
  effectiveLandedCost: number;
  leadTimeDays: number;
  onTimeRate: number;
  qualityScore: number;
  moq: number;
  recommendationBadge?: string;
  recommendationNote: string;
}

const VENDORS: VendorData[] = [
  {
    id: 'v1',
    name: 'GlobalTech Distro (Pvt Ltd)',
    tier: 'Gold Preferred',
    unitPrice: 158000,
    freightCost: 18000,
    effectiveLandedCost: 176000,
    leadTimeDays: 7,
    onTimeRate: 96,
    qualityScore: 99.4,
    moq: 10,
    recommendationBadge: '⭐ Best Value & Reliability',
    recommendationNote:
      'Recommended for primary replenishment: 96% on-time record, 99.4% acceptance score, and lowest landed freight via direct contract.',
  },
  {
    id: 'v2',
    name: 'Alpha Systems India',
    tier: 'Silver',
    unitPrice: 155500,
    freightCost: 16500,
    effectiveLandedCost: 172000,
    leadTimeDays: 12,
    onTimeRate: 89,
    qualityScore: 97.8,
    moq: 25,
    recommendationBadge: 'Lowest Base Price',
    recommendationNote:
      'Cheapest listed price (saves ₹4,000/unit), but requires 12-day lead time. Ideal for planned baseline restocks with ample buffer.',
  },
  {
    id: 'v3',
    name: 'Nexus Components Express',
    tier: 'Gold Preferred',
    unitPrice: 161200,
    freightCost: 15800,
    effectiveLandedCost: 177000,
    leadTimeDays: 5,
    onTimeRate: 94,
    qualityScore: 98.9,
    moq: 5,
    recommendationBadge: '⚡ Fastest Delivery',
    recommendationNote:
      'Fastest emergency fulfillment (5 days). Best pick when stockout deadline is imminent and margin can absorb slight premium.',
  },
  {
    id: 'v4',
    name: 'Synapse Imports',
    tier: 'Bronze',
    unitPrice: 152900,
    freightCost: 22100,
    effectiveLandedCost: 175000,
    leadTimeDays: 21,
    onTimeRate: 81,
    qualityScore: 92.5,
    moq: 50,
    recommendationNote:
      'High MOQ and 21-day import transit time. History indicates occasional shipment delays; not recommended for urgent replenishment.',
  },
];

export const VendorIntelligenceDemo: React.FC = () => {
  const [selectedVendor, setSelectedVendor] = useState<string>('v1');
  const activeVendor = VENDORS.find((v) => v.id === selectedVendor) || VENDORS[0];

  return (
    <section className="py-20 bg-slate-950/80 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5" />
            Decision-Support Procurement
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Multi-Vendor Procurement Intelligence
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Never overpay or get stranded by delayed suppliers. Compare effective landed cost (price + road freight + GST), lead times, and verified delivery track records side-by-side.
          </p>
        </div>

        {/* Vendors Comparison Table and AI Recommendation */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs text-indigo-400 font-semibold uppercase">Procurement Target:</span>
              <h3 className="text-lg font-bold text-white">SKU: GPU-RTX4090 (Replenishment Batch: 125 Units)</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> 4 Verified Suppliers Linked
              </span>
            </div>
          </div>

          {/* Vendors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {VENDORS.map((v) => {
              const isSelected = v.id === selectedVendor;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVendor(v.id)}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-950/30 border-indigo-500/60 ring-2 ring-indigo-500/20 shadow-xl'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {v.tier}
                      </span>
                      {v.recommendationBadge && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {v.recommendationBadge.split(' ')[0]}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-white text-sm truncate">{v.name}</h4>

                    <div className="mt-4 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Landed Cost:</span>
                        <span className="font-mono font-bold text-white">₹{v.effectiveLandedCost.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Lead Time:</span>
                        <span className="font-medium text-slate-200">{v.leadTimeDays} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">On-Time Rate:</span>
                        <span className="font-semibold text-emerald-400">{v.onTimeRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Min. Order Qty:</span>
                        <span className="font-mono text-slate-300">{v.moq} pcs</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
                    <span className="text-[11px] font-semibold text-indigo-400">
                      {isSelected ? '✓ Viewing Analysis' : 'Click to Analyze'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Vendor AI Analysis */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-indigo-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-bold text-white">
                Procurement Decision-Support: {activeVendor.name}
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {activeVendor.recommendationNote}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                Base Unit Quote: <strong>₹{activeVendor.unitPrice.toLocaleString('en-IN')}</strong>
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                Logistics Freight & Insurance: <strong>₹{activeVendor.freightCost.toLocaleString('en-IN')}</strong>
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">
                Effective Total Cost: ₹{activeVendor.effectiveLandedCost.toLocaleString('en-IN')} / unit
              </span>
            </div>
          </div>
        </div>

        {/* Generated Image Showcase */}
        <div className="rounded-3xl p-1 bg-gradient-to-b from-indigo-500/20 via-slate-800/40 to-slate-900 border border-indigo-500/20 shadow-2xl overflow-hidden">
          <div className="rounded-2xl overflow-hidden bg-slate-950">
            <img
              src="/vendor_procurement_preview.jpg"
              alt="Bizpilot Multi-Vendor Procurement Intelligence UI"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
