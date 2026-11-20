import React, { useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { mockApiService } from '../../services/mockApi';
import { useOnboarding } from '../../context/OnboardingContext';
import {
  INDIAN_STATES_AND_UTS,
  COUNTRIES,
  GST_REGEX,
  PIN_CODE_REGEX,
} from '../../constants/indiaStates';
import {
  Building2,
  FileText,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Info,
  Wand2,
  AlertCircle,
} from 'lucide-react';

const companySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Company name must be at least 2 characters')
    .max(120, 'Company name cannot exceed 120 characters'),
  gstNumber: z
    .string()
    .trim()
    .toUpperCase()
    .length(15, 'GSTIN must be exactly 15 characters')
    .regex(
      GST_REGEX,
      'Invalid GST format. Expected: 2 digits + 5 letters + 4 digits + 1 letter + 1 char + Z + 1 char (e.g., 27AABCU9603R1ZM)'
    ),
  address: z
    .string()
    .trim()
    .min(5, 'Registered address must be at least 5 characters')
    .max(300, 'Address cannot exceed 300 characters'),
  pinCode: z
    .string()
    .trim()
    .regex(PIN_CODE_REGEX, 'PIN code must be exactly 6 digits (e.g., 400051)'),
  state: z.string().trim().min(1, 'Please select a State or Union Territory'),
  country: z.string().trim().min(1, 'Please select a Country'),
});

type CompanyFormData = z.infer<typeof companySchema>;

export const Step3Company: React.FC = () => {
  const navigate = useNavigate();
  const { state, refreshState } = useOnboarding();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const existingCompany = state.company || mockApiService.getStoredState().company;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    mode: 'onChange',
    defaultValues: {
      name: existingCompany?.name || '',
      gstNumber: existingCompany?.gstNumber || '',
      address: existingCompany?.address || '',
      pinCode: existingCompany?.pinCode || '',
      state: existingCompany?.state || '',
      country: existingCompany?.country || 'India',
    },
  });

  const watchedGst = watch('gstNumber', '');
  const isGstValid = GST_REGEX.test(watchedGst.toUpperCase().trim());

  const fillSampleCompany = () => {
    setValue('name', 'Acme Technologies Pvt Ltd', { shouldValidate: true, shouldDirty: true });
    setValue('gstNumber', '27AABCU9603R1ZM', { shouldValidate: true, shouldDirty: true });
    setValue('address', 'Unit 402, High-Tech Tower, BKC, Bandra', { shouldValidate: true, shouldDirty: true });
    setValue('pinCode', '400051', { shouldValidate: true, shouldDirty: true });
    setValue('state', 'Maharashtra', { shouldValidate: true, shouldDirty: true });
    setValue('country', 'India', { shouldValidate: true, shouldDirty: true });
    setServerError(null);
  };

  const onSubmit = async (data: CompanyFormData) => {
    try {
      setIsSubmitting(true);
      setServerError(null);

      await mockApiService.saveCompany({
        name: data.name.trim(),
        gstNumber: data.gstNumber.toUpperCase().trim(),
        address: data.address.trim(),
        pinCode: data.pinCode.trim(),
        state: data.state.trim(),
        country: data.country.trim(),
      });

      await refreshState();
      navigate('/step-4');
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Failed to save company details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (fieldErrors: FieldErrors<CompanyFormData>) => {
    const errorKeys = Object.keys(fieldErrors) as (keyof CompanyFormData)[];
    if (errorKeys.length > 0) {
      const firstField = errorKeys[0];
      const message = fieldErrors[firstField]?.message;
      setServerError(`Please resolve ${firstField}: ${message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-10 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Step Header */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Step 3 of 4
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <Building2 className="w-7 h-7 text-indigo-400" />
            Main Company Details
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Provide the legal registration details of your primary business entity. Branches will be created under this entity.
          </p>

          {/* Quick Helper to Fill Valid Sample Data */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={fillSampleCompany}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Auto-fill Sample Company (1-Click Test)</span>
            </button>
          </div>
        </div>

        {/* Server error / Validation error alert */}
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2 animate-in shake duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-semibold">{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-5" noValidate>
          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Legal Company Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                id="companyName"
                type="text"
                placeholder="Acme Technologies Pvt Ltd"
                {...register('name')}
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/60 border text-sm text-white placeholder-slate-500 transition-all outline-none ${
                  errors.name
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25'
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* GST Number with auto-uppercase */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="gstNumber" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                GST Number (GSTIN) <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Info className="w-3 h-3 text-indigo-400" />
                15 Characters
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
              <input
                id="gstNumber"
                type="text"
                maxLength={15}
                placeholder="27AABCU9603R1ZM"
                {...register('gstNumber')}
                onChange={(e) => {
                  const upper = e.target.value.toUpperCase();
                  setValue('gstNumber', upper, { shouldValidate: true, shouldDirty: true });
                }}
                className={`w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950/60 border text-sm uppercase tracking-wider font-mono text-white placeholder-slate-500 transition-all outline-none ${
                  errors.gstNumber
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                    : isGstValid
                    ? 'border-emerald-500/70 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25'
                }`}
              />
              {isGstValid && (
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            {errors.gstNumber ? (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.gstNumber.message}</p>
            ) : (
              <p className="mt-1.5 text-[11px] text-slate-400">
                Format: 2 digits State Code + 10 chars PAN + 1 entity + 1 char + Z + 1 check digit (e.g. 27AABCU9603R1ZM)
              </p>
            )}
          </div>

          {/* Registered Address */}
          <div>
            <label htmlFor="address" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Registered Office Address <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="address"
              rows={3}
              placeholder="Unit 402, Trade Tower, Bandra Kurla Complex..."
              {...register('address')}
              className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 border text-sm text-white placeholder-slate-500 transition-all outline-none resize-none ${
                errors.address
                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25'
              }`}
            />
            {errors.address && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.address.message}</p>
            )}
          </div>

          {/* Grid: Pin Code, State, Country */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Pin Code */}
            <div>
              <label htmlFor="pinCode" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                PIN Code <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="pinCode"
                  type="text"
                  maxLength={6}
                  placeholder="400051"
                  {...register('pinCode')}
                  onChange={(e) => {
                    const numeric = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setValue('pinCode', numeric, { shouldValidate: true, shouldDirty: true });
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/60 border text-sm font-mono text-white placeholder-slate-500 transition-all outline-none ${
                    errors.pinCode
                      ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25'
                  }`}
                />
              </div>
              {errors.pinCode && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.pinCode.message}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                State / UT <span className="text-rose-400">*</span>
              </label>
              <select
                id="state"
                {...register('state')}
                className={`w-full px-3.5 py-3 rounded-xl bg-slate-950/60 border text-sm text-white placeholder-slate-500 transition-all outline-none appearance-none cursor-pointer ${
                  errors.state
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25'
                }`}
              >
                <option value="" className="bg-slate-900 text-slate-400">
                  Select State or UT
                </option>
                <optgroup label="States" className="bg-slate-900 font-semibold text-indigo-300">
                  {INDIAN_STATES_AND_UTS.filter((s) => s.type === 'State').map((item) => (
                    <option key={item.code} value={item.name} className="bg-slate-900 text-white font-normal">
                      {item.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Union Territories" className="bg-slate-900 font-semibold text-indigo-300">
                  {INDIAN_STATES_AND_UTS.filter((s) => s.type === 'Union Territory').map((item) => (
                    <option key={item.code} value={item.name} className="bg-slate-900 text-white font-normal">
                      {item.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              {errors.state && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.state.message}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Country <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <select
                  id="country"
                  {...register('country')}
                  className={`w-full px-3.5 py-3 rounded-xl bg-slate-950/60 border text-sm text-white placeholder-slate-500 transition-all outline-none appearance-none cursor-pointer ${
                    errors.country
                      ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25'
                  }`}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              {errors.country && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.country.message}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 ring-1 ring-white/10 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Company Details...</span>
                </>
              ) : (
                <>
                  <span>Save & Continue</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
