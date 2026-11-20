import React, { useState } from 'react';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  FileCheck,
  Download,
} from 'lucide-react';

export const ExcelMigrationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'mapping' | 'validation'>('mapping');

  return (
    <section className="py-20 bg-slate-950/60 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Zero-Friction Adoption
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Migrate from Excel in Minutes
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Keep your business running. Upload your existing product spreadsheets, vendor lists, or opening stock balances with auto-column mapping and row-level validation.
          </p>
        </div>

        {/* Wizard Preview Container */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Wizard Steps Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pb-6 border-b border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              Step 1: Upload File (.xlsx/.csv)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mapping')}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                activeTab === 'mapping'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              Step 2: Auto Column Mapping
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('validation')}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                activeTab === 'validation'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              Step 3: Row-by-Row Validation
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-6">
            {activeTab === 'upload' && (
              <div className="border-2 border-dashed border-slate-800 rounded-2xl p-10 text-center bg-slate-950/40">
                <UploadCloud className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white">Drag & drop your inventory workbook here</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Supports Microsoft Excel (.xlsx), .xls, and standard CSV formats with up to 50,000 rows.
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <span className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold cursor-pointer">
                    Browse File
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer">
                    Download Sample Template
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'mapping' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                  <span className="font-semibold text-white">AI Auto-Suggested Column Mappings:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 6/6 Columns Auto-Matched (100%)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-mono">Your Header: [Item Code]</span>
                    <span className="text-indigo-400 font-bold">→ SKU (Unique)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-mono">Your Header: [Product Name]</span>
                    <span className="text-indigo-400 font-bold">→ Product Master Name</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-mono">Your Header: [Physical Stock]</span>
                    <span className="text-indigo-400 font-bold">→ Opening Stock Ledger</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-mono">Your Header: [Warehouse Loc]</span>
                    <span className="text-indigo-400 font-bold">→ Facility ID (Branch)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-mono">Your Header: [Purchase Price]</span>
                    <span className="text-indigo-400 font-bold">→ Cost Basis (INR)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-mono">Your Header: [HSN/SAC Code]</span>
                    <span className="text-indigo-400 font-bold">→ GST Classification</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'validation' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="font-bold text-white">Validation Results: 1,420 of 1,423 Valid</span>
                      <p className="text-[11px] text-slate-400">3 rows need review before atomic commit.</p>
                    </div>
                  </div>
                  <button type="button" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    Download Error CSV
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">Row</th>
                        <th className="p-2.5">SKU</th>
                        <th className="p-2.5">Issue Detected</th>
                        <th className="p-2.5">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr className="bg-slate-900/60">
                        <td className="p-2.5 font-mono text-slate-400">#42</td>
                        <td className="p-2.5 font-mono text-rose-400">BRG-DUP-01</td>
                        <td className="p-2.5 text-rose-300">Duplicate SKU found in sheet</td>
                        <td className="p-2.5 text-indigo-400 cursor-pointer">Auto-Resolve</td>
                      </tr>
                      <tr className="bg-slate-900/60">
                        <td className="p-2.5 font-mono text-slate-400">#108</td>
                        <td className="p-2.5 font-mono text-amber-400">VAL-99</td>
                        <td className="p-2.5 text-amber-300">Missing HSN code (Defaults to 8481)</td>
                        <td className="p-2.5 text-indigo-400 cursor-pointer">Accept Default</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Opening stock imports write directly to the immutable audit ledger.</span>
            <span className="text-emerald-400 font-semibold">Zero data loss guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};
