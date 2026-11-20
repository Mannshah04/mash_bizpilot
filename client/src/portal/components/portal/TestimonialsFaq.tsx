import React, { useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';

const FAQS = [
  {
    q: 'How does Bizpilot handle multi-branch inventory across different states?',
    a: 'Each branch or warehouse has its own stock ledger with independent reorder points and safety thresholds. When viewing a product, the Multi-Branch Stock Matrix consolidates physical on-hand, committed reservations, and net available stock across all locations with atomic, concurrency-safe updates.',
  },
  {
    q: 'What is the Smart Shortage Resolver and how does it rank transfer options?',
    a: 'When an order creates a deficit at a branch (e.g. 50 units needed but only 8 on hand), the resolver analyzes sister warehouses, evaluates actual road distance, transit hours, and freight cost, and provides ranked resolution proposals (Fastest Delivery vs Lowest Cost vs Balanced). It always requires authorized human approval before creating transfer orders.',
  },
  {
    q: 'Is Bizpilot fully compliant with Indian GST requirements?',
    a: 'Yes. Bizpilot natively captures 15-character GSTINs, supports HSN/SAC codes, and automatically determines CGST + SGST (intra-state) or IGST (inter-state) based on place-of-supply rules, branch locations, and sequential tax invoice numbering.',
  },
  {
    q: 'How does Inter-Branch Stock Transfer handle delivery discrepancies?',
    a: 'Bizpilot tracks shipments across Requested, In-Transit, and Received stages. If the receiving branch counts fewer units at the dock than dispatched, the system automatically flags a shortage audit ticket and alerts the store manager.',
  },
  {
    q: 'Can we import our existing inventory data from Excel or Tally?',
    a: 'Yes. Bizpilot includes a built-in Excel/CSV migration wizard that auto-maps columns, validates duplicate SKUs, checks data types, and imports starting balances directly into the opening stock ledger with zero data loss.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'The Smart Shortage Resolver alone saved us from losing ₹6.5 Lakhs in orders during festive peak. Transferring from Surat to Ahmedabad took 1 day instead of placing an emergency 10-day supplier order.',
    author: 'Rajesh Mehta',
    title: 'Managing Director',
    company: 'Gujarat Industrial Fasteners & Spares',
    branches: '4 Branches & Central Hub',
  },
  {
    quote:
      'We had ₹22 Lakhs tied up in inventory older than 90 days. Bizpilot’s aging bands and multi-vendor comparison cut our working capital deadlock and lowered our landed purchase costs by 14%.',
    author: 'Sunil Agarwal',
    title: 'Operations Head',
    company: 'Agarwal Heavy Electricals',
    branches: '6 Locations in Maharashtra & MP',
  },
];

export const TestimonialsFaq: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="py-20 bg-slate-950/60 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 block mb-2">
              Customer Success Stories
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
              Trusted by Leading Indian MSMEs & Distributors
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between relative"
              >
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.author}</h4>
                    <p className="text-xs text-slate-400">{t.title}, {t.company}</p>
                  </div>
                  <span className="text-[11px] font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                    {t.branches}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-2">
              Frequently Asked Questions
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Questions & Answers
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-semibold text-sm text-white flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-indigo-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
