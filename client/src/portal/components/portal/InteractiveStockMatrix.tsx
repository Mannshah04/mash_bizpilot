import React, { useState } from 'react';
import {
  Warehouse,
  Building,
} from 'lucide-react';

interface ProductMatrixData {
  sku: string;
  name: string;
  category: string;
  unitCost: number;
  locations: {
    name: string;
    type: 'Branch' | 'Central Warehouse';
    state: string;
    onHand: number;
    reserved: number;
    available: number;
    safetyStock: number;
    status: 'Optimal' | 'Low Stock' | 'Surplus';
  }[];
}

const PRODUCTS_DATA: ProductMatrixData[] = [
  {
    sku: 'BRG-6204',
    name: 'Industrial Deep Groove Bearing 6204-2RS',
    category: 'Mechanical Bearings & Spares',
    unitCost: 450,
    locations: [
      {
        name: 'Ahmedabad Branch Hub',
        type: 'Branch',
        state: 'Gujarat',
        onHand: 12,
        reserved: 4,
        available: 8,
        safetyStock: 25,
        status: 'Low Stock',
      },
      {
        name: 'Surat Distribution Center',
        type: 'Branch',
        state: 'Gujarat',
        onHand: 45,
        reserved: 5,
        available: 40,
        safetyStock: 30,
        status: 'Optimal',
      },
      {
        name: 'Vadodara Logistics Hub',
        type: 'Branch',
        state: 'Gujarat',
        onHand: 18,
        reserved: 2,
        available: 16,
        safetyStock: 20,
        status: 'Optimal',
      },
      {
        name: 'Western Central Warehouse',
        type: 'Central Warehouse',
        state: 'Maharashtra',
        onHand: 300,
        reserved: 20,
        available: 280,
        safetyStock: 100,
        status: 'Surplus',
      },
    ],
  },
  {
    sku: 'GPU-RTX4090',
    name: 'NVIDIA RTX 4090 24GB AI Accelerator',
    category: 'Enterprise Hardware',
    unitCost: 158000,
    locations: [
      {
        name: 'Mumbai Central Tech Hub',
        type: 'Branch',
        state: 'Maharashtra',
        onHand: 18,
        reserved: 6,
        available: 12,
        safetyStock: 15,
        status: 'Optimal',
      },
      {
        name: 'Bengaluru Tech Park Hub',
        type: 'Branch',
        state: 'Karnataka',
        onHand: 8,
        reserved: 7,
        available: 1,
        safetyStock: 10,
        status: 'Low Stock',
      },
      {
        name: 'Delhi NCR Warehouse',
        type: 'Central Warehouse',
        state: 'Delhi',
        onHand: 55,
        reserved: 10,
        available: 45,
        safetyStock: 20,
        status: 'Optimal',
      },
    ],
  },
  {
    sku: 'VLV-IND-3IN',
    name: 'Cast Steel Flanged Gate Valve 3" Class 150',
    category: 'Industrial Piping & Valves',
    unitCost: 3200,
    locations: [
      {
        name: 'Ahmedabad Branch Hub',
        type: 'Branch',
        state: 'Gujarat',
        onHand: 35,
        reserved: 5,
        available: 30,
        safetyStock: 20,
        status: 'Optimal',
      },
      {
        name: 'Pune Industrial Warehouse',
        type: 'Branch',
        state: 'Maharashtra',
        onHand: 24,
        reserved: 4,
        available: 20,
        safetyStock: 25,
        status: 'Optimal',
      },
      {
        name: 'Western Central Warehouse',
        type: 'Central Warehouse',
        state: 'Maharashtra',
        onHand: 140,
        reserved: 15,
        available: 125,
        safetyStock: 50,
        status: 'Surplus',
      },
    ],
  },
];

export const InteractiveStockMatrix: React.FC = () => {
  const [selectedSku, setSelectedSku] = useState<string>('BRG-6204');
  const activeProduct = PRODUCTS_DATA.find((p) => p.sku === selectedSku) || PRODUCTS_DATA[0];

  const totalOnHand = activeProduct.locations.reduce((acc, l) => acc + l.onHand, 0);
  const totalReserved = activeProduct.locations.reduce((acc, l) => acc + l.reserved, 0);
  const totalAvailable = activeProduct.locations.reduce((acc, l) => acc + l.available, 0);
  const totalValuation = totalOnHand * activeProduct.unitCost;

  return (
    <section className="py-20 bg-slate-950/40 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Warehouse className="w-3.5 h-3.5" />
            Live Consolidated View
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Multi-Branch Stock Matrix
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Never guess which warehouse has inventory. View physical on-hand, confirmed customer reservations, and net available stock across all state entities in real time.
          </p>
        </div>

        {/* Matrix Container */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Top Product Selector Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Select Active Catalog Item:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {PRODUCTS_DATA.map((p) => (
                  <button
                    key={p.sku}
                    type="button"
                    onClick={() => setSelectedSku(p.sku)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      p.sku === selectedSku
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-white/20'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {p.name.split(' ')[0]} ({p.sku})
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800">
              <span className="font-mono text-indigo-300 font-bold">{activeProduct.sku}</span>
              <span>·</span>
              <span className="text-white font-medium">{activeProduct.category}</span>
            </div>
          </div>

          {/* 4 Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total On-Hand</span>
              <p className="text-2xl font-bold text-white mt-1">{totalOnHand} <span className="text-xs text-slate-400 font-normal">units</span></p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Reserved</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">{totalReserved} <span className="text-xs text-slate-400 font-normal">committed</span></p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Net Available</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{totalAvailable} <span className="text-xs text-slate-400 font-normal">units</span></p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Stock Valuation</span>
              <p className="text-2xl font-bold text-indigo-300 mt-1">₹{totalValuation.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Location / Facility</th>
                  <th className="py-3.5 px-3">State</th>
                  <th className="py-3.5 px-3 text-right">Physical On-Hand</th>
                  <th className="py-3.5 px-3 text-right">Committed Reserved</th>
                  <th className="py-3.5 px-3 text-right font-bold text-emerald-400">Net Available</th>
                  <th className="py-3.5 px-3 text-right">Safety Threshold</th>
                  <th className="py-3.5 px-4 text-center">Stock Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {activeProduct.locations.map((loc, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-400" />
                        <div>
                          <span>{loc.name}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">{loc.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">{loc.state}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-medium text-slate-200">{loc.onHand}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-medium text-amber-400">{loc.reserved}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400 text-sm">{loc.available}</td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-400">{loc.safetyStock}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          loc.status === 'Optimal'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : loc.status === 'Low Stock'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}
                      >
                        {loc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-right text-[11px] text-slate-500">
            * Available = Physical On-Hand minus Confirmed Order Reservations. Atomic concurrency-safe ledger entries.
          </p>
        </div>
      </div>
    </section>
  );
};
