import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  Sparkles,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { INDIAN_STATES_AND_UTS } from '../../constants/indiaStates';

export interface PlanDetails {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  annualPriceTotal?: number;
  annualMonthlyEquiv?: number;
  branches: string;
  users?: string;
  products?: string;
  warehouses?: string;
  skus: string;
  tagline?: string;
  badge?: string;
  isPopular?: boolean;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PlanDetails;
  isAnnual: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  isAnnual,
}) => {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const basePrice = isAnnual ? (selectedPlan.annualPriceTotal || selectedPlan.annualPrice) : selectedPlan.monthlyPrice;
  const gstAmount = Math.round(basePrice * 0.18);
  const totalAmount = basePrice + gstAmount;

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const generatedOrderId = 'ORD-BIZ-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedOrderId);

    setTimeout(() => {
      setIsProcessing(false);
      setPurchaseComplete(true);
    }, 1200);
  };

  const handleGoToOnboarding = () => {
    onClose();
    navigate('/step-1');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {purchaseComplete ? (
          /* Purchase Confirmation Screen */
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold">
                Payment Authorized & Verified
              </span>
              <h3 className="text-2xl font-extrabold text-white">License Successfully Purchased!</h3>
              <p className="text-xs text-slate-400">
                Order Reference: <strong className="text-slate-200 font-mono">{orderId}</strong>
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Plan Subscribed:</span>
                <span className="text-white font-bold">{selectedPlan.name} ({isAnnual ? 'Annual' : 'Monthly'})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Company Entity:</span>
                <span className="text-white font-semibold">{companyName || 'Your Business'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Amount Paid (incl. 18% GST):</span>
                <span className="text-emerald-400 font-bold">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Ready to setup your administrator account, 2FA authenticator, and branch matrix in our 4-step onboarding flow.
            </p>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleGoToOnboarding}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl transition-all cursor-pointer flex items-center gap-2 group"
              >
                <span>Launch First-Time Onboarding Flow</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Secure Checkout & Licensing
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Purchase Bizpilot {selectedPlan.name}
              </h3>
              <p className="text-xs text-slate-400">
                Instant license activation with Indian GST tax invoice and access to the full platform.
              </p>
            </div>

            {/* Order Summary Strip */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 flex items-center justify-between mb-6">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Selected Plan:</span>
                <p className="text-base font-bold text-white">
                  {selectedPlan.name}{' '}
                  <span className="text-xs font-normal text-indigo-400">
                    ({isAnnual ? `Billed Annually · ₹${basePrice.toLocaleString('en-IN')}/yr` : `Billed Monthly · ₹${basePrice.toLocaleString('en-IN')}/mo`})
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span>{selectedPlan.branches}</span>
                  <span>•</span>
                  <span>{selectedPlan.users || 'Multi-User'}</span>
                  <span>•</span>
                  <span>{selectedPlan.skus}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase">Total Payable (incl. 18% GST)</span>
                <p className="text-xl font-extrabold text-emerald-400">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Base: ₹{basePrice.toLocaleString('en-IN')} + GST: ₹{gstAmount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <form onSubmit={handlePurchase} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Company Legal Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Technologies Pvt Ltd"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    GST Number (GSTIN) <span className="text-slate-500 font-normal">(Optional for B2B Invoice)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="27AABCU9603R1ZM"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono uppercase text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Billing Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="founder@acmecorp.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Contact Phone (10 Digits) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9820012345"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Billing State / UT <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500"
                  >
                    {INDIAN_STATES_AND_UTS.map(st => (
                      <option key={st.code} value={st.name} className="bg-slate-900 text-white">{st.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Select Payment Gateway:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'upi'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'card'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span>Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'netbanking'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building className="w-4 h-4 text-violet-400" />
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Simulated Payment Notice */}
              <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-400 border border-slate-800/80 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>256-Bit SSL Encrypted Payment Simulation</span>
                </span>
                <span className="text-slate-500 font-mono text-[11px]">GST B2B Compliant</span>
              </div>

              {/* Complete Purchase Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authorizing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{totalAmount.toLocaleString('en-IN')} & Activate License</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
