import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { mockApiService } from '../../services/mockApi';
import { useOnboarding } from '../../context/OnboardingContext';
import { Modal } from '../common/Modal';
import {
  INDIAN_STATES_AND_UTS,
  COUNTRIES,
  GST_REGEX,
  PIN_CODE_REGEX,
  PHONE_REGEX,
} from '../../constants/indiaStates';
import type { Branch } from '../../types/onboarding';
import {
  GitBranch,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building,
  User,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  X,
} from 'lucide-react';

const branchSchema = z.object({
  branchName: z
    .string()
    .trim()
    .min(2, 'Branch name must be at least 2 characters')
    .max(80, 'Branch name cannot exceed 80 characters'),
  branchCode: z
    .string()
    .trim()
    .min(2, 'Branch code must be at least 2 characters')
    .max(20, 'Branch code cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9\-_]+$/, 'Code can only contain letters, numbers, hyphens, and underscores'),
  address: z
    .string()
    .trim()
    .min(5, 'Address must be at least 5 characters')
    .max(250, 'Address cannot exceed 250 characters'),
  pinCode: z
    .string()
    .trim()
    .regex(PIN_CODE_REGEX, 'PIN code must be exactly 6 digits'),
  state: z.string().trim().min(1, 'Please select a State / UT'),
  country: z.string().trim().min(1, 'Please select a Country'),
  contactPerson: z
    .string()
    .trim()
    .min(2, 'Contact person name is required')
    .max(60, 'Contact person name too long'),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, 'Please enter a valid 10-digit mobile number (e.g. 9876543210)'),
  branchGst: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || GST_REGEX.test(val.toUpperCase()),
      'Invalid GST format. Must be 15 alphanumeric characters (e.g., 27AABCU9603R1ZM)'
    ),
});

type BranchFormData = z.infer<typeof branchSchema>;

export const Step4Branches: React.FC = () => {
  const navigate = useNavigate();
  const { state, refreshState } = useOnboarding();

  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const [isAddingOrUpdating, setIsAddingOrUpdating] = useState<boolean>(false);

  const branches = state.branches || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    mode: 'onChange',
    defaultValues: {
      branchName: '',
      branchCode: '',
      address: '',
      pinCode: '',
      state: state.company?.state || '',
      country: state.company?.country || 'India',
      contactPerson: '',
      phone: '',
      branchGst: '',
    },
  });

  // Handle Form Submission: Add or Update Branch
  const onBranchSubmit = async (data: BranchFormData) => {
    setFormError(null);
    const codeUpper = data.branchCode.toUpperCase().trim();

    // Prevent duplicate branch codes (case-insensitive)
    const duplicate = branches.some(
      (b) => b.branchCode.toUpperCase() === codeUpper && b.id !== editingBranchId
    );

    if (duplicate) {
      setFormError(`A branch with code "${codeUpper}" already exists. Each branch code must be unique.`);
      return;
    }

    try {
      setIsAddingOrUpdating(true);

      if (editingBranchId) {
        // Update existing branch
        await mockApiService.updateBranch(editingBranchId, {
          branchName: data.branchName,
          branchCode: codeUpper,
          address: data.address,
          pinCode: data.pinCode,
          state: data.state,
          country: data.country,
          contactPerson: data.contactPerson,
          phone: data.phone,
          branchGst: data.branchGst ? data.branchGst.toUpperCase().trim() : undefined,
        });
        setEditingBranchId(null);
      } else {
        // Add new branch under the main company
        await mockApiService.addBranch({
          branchName: data.branchName,
          branchCode: codeUpper,
          address: data.address,
          pinCode: data.pinCode,
          state: data.state,
          country: data.country,
          contactPerson: data.contactPerson,
          phone: data.phone,
          branchGst: data.branchGst ? data.branchGst.toUpperCase().trim() : undefined,
        });
      }

      await refreshState();

      // Reset form fields
      reset({
        branchName: '',
        branchCode: '',
        address: '',
        pinCode: '',
        state: state.company?.state || '',
        country: state.company?.country || 'India',
        contactPerson: '',
        phone: '',
        branchGst: '',
      });
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save branch.');
    } finally {
      setIsAddingOrUpdating(false);
    }
  };

  // Start Edit Mode
  const handleEditClick = (branch: Branch) => {
    setEditingBranchId(branch.id);
    setFormError(null);
    reset({
      branchName: branch.branchName,
      branchCode: branch.branchCode,
      address: branch.address,
      pinCode: branch.pinCode,
      state: branch.state,
      country: branch.country,
      contactPerson: branch.contactPerson,
      phone: branch.phone,
      branchGst: branch.branchGst || '',
    });

    // Smooth scroll to form
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Cancel Edit Mode
  const handleCancelEdit = () => {
    setEditingBranchId(null);
    setFormError(null);
    reset({
      branchName: '',
      branchCode: '',
      address: '',
      pinCode: '',
      state: state.company?.state || '',
      country: state.company?.country || 'India',
      contactPerson: '',
      phone: '',
      branchGst: '',
    });
  };

  // Confirm Delete Branch
  const handleConfirmDelete = async () => {
    if (!deletingBranch) return;
    try {
      await mockApiService.deleteBranch(deletingBranch.id);
      if (editingBranchId === deletingBranch.id) {
        handleCancelEdit();
      }
      await refreshState();
      setDeletingBranch(null);
    } catch (e) {
      console.error('Failed to delete branch', e);
    }
  };

  // Finish Onboarding
  const handleFinish = async () => {
    try {
      setIsFinishing(true);
      await mockApiService.finishOnboarding();
      await refreshState();
      navigate('/summary');
    } catch (e) {
      console.error(e);
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Container */}
      <div className="space-y-8">
        {/* Step Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Step 4 of 4
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <GitBranch className="w-7 h-7 text-indigo-400" />
            Branch Creation
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
            Configure branches, regional offices, and warehouses operating under{' '}
            <strong className="text-white">{state.company?.name || 'Main Company'}</strong>.
          </p>
        </div>

        {/* Branch Form Card */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-semibold">
                {editingBranchId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {editingBranchId ? 'Edit Branch' : 'Add New Branch'}
                </h2>
                <p className="text-xs text-slate-400">
                  {editingBranchId
                    ? 'Update branch details below'
                    : 'Fill in details to add a branch to the company roster'}
                </p>
              </div>
            </div>

            {editingBranchId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Cancel Edit
              </button>
            )}
          </div>

          {/* Form error (e.g. duplicate branch code) */}
          {formError && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onBranchSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Branch Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Branch Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., Mumbai Central Hub"
                    {...register('branchName')}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/60 border text-sm text-white placeholder-slate-500 outline-none transition-all ${
                      errors.branchName
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
                {errors.branchName && (
                  <p className="mt-1 text-xs text-rose-400">{errors.branchName.message}</p>
                )}
              </div>

              {/* Branch Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Branch Code (Unique) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., BR-MUM-01"
                  {...register('branchCode', {
                    onChange: (e) => {
                      setValue('branchCode', e.target.value.toUpperCase());
                    },
                  })}
                  className={`w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border text-sm uppercase font-mono text-white placeholder-slate-500 outline-none transition-all ${
                    errors.branchCode
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                />
                {errors.branchCode && (
                  <p className="mt-1 text-xs text-rose-400">{errors.branchCode.message}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Branch Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Plot 12, MIDC Industrial Area..."
                {...register('address')}
                className={`w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border text-sm text-white placeholder-slate-500 outline-none transition-all ${
                  errors.address
                    ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-rose-400">{errors.address.message}</p>
              )}
            </div>

            {/* Pin Code, State, Country */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Pin Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  PIN Code <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="400093"
                    {...register('pinCode', {
                      onChange: (e) => {
                        const numeric = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setValue('pinCode', numeric, { shouldValidate: true });
                      },
                    })}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/60 border text-sm font-mono text-white placeholder-slate-500 outline-none transition-all ${
                      errors.pinCode
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
                {errors.pinCode && (
                  <p className="mt-1 text-xs text-rose-400">{errors.pinCode.message}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  State / UT <span className="text-rose-400">*</span>
                </label>
                <select
                  {...register('state')}
                  className={`w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border text-sm text-white placeholder-slate-500 outline-none transition-all cursor-pointer ${
                    errors.state
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                >
                  <option value="" className="bg-slate-900 text-slate-400">
                    Select State / UT
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
                  <p className="mt-1 text-xs text-rose-400">{errors.state.message}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Country <span className="text-rose-400">*</span>
                </label>
                <select
                  {...register('country')}
                  className={`w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border text-sm text-white placeholder-slate-500 outline-none transition-all cursor-pointer ${
                    errors.country
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-xs text-rose-400">{errors.country.message}</p>
                )}
              </div>
            </div>

            {/* Contact Person, Phone, Optional Branch GST */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Contact Person */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Contact Person <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., Rajesh Sharma"
                    {...register('contactPerson')}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/60 border text-sm text-white placeholder-slate-500 outline-none transition-all ${
                      errors.contactPerson
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
                {errors.contactPerson && (
                  <p className="mt-1 text-xs text-rose-400">{errors.contactPerson.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone (10 Digits) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    {...register('phone', {
                      onChange: (e) => {
                        const numeric = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setValue('phone', numeric, { shouldValidate: true });
                      },
                    })}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/60 border text-sm font-mono text-white placeholder-slate-500 outline-none transition-all ${
                      errors.phone
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-rose-400">{errors.phone.message}</p>
                )}
              </div>

              {/* Optional Branch GST */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Branch GST <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="27AABCU9603R1ZM"
                    {...register('branchGst', {
                      onChange: (e) => {
                        setValue('branchGst', e.target.value.toUpperCase());
                      },
                    })}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/60 border text-sm uppercase font-mono text-white placeholder-slate-500 outline-none transition-all ${
                      errors.branchGst
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
                {errors.branchGst && (
                  <p className="mt-1 text-xs text-rose-400">{errors.branchGst.message}</p>
                )}
              </div>
            </div>

            {/* Add / Update Branch Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isAddingOrUpdating}
                className={`px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer flex items-center gap-2 ${
                  isAddingOrUpdating ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isAddingOrUpdating ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : editingBranchId ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>{editingBranchId ? 'Update Branch' : 'Add Branch'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Branches Table Section */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Configured Branches</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                  {branches.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                All branch records saved under {state.company?.name || 'Main Company'}.
              </p>
            </div>
          </div>

          {branches.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto mb-3 text-slate-500">
                <GitBranch className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300">No branches added yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Use the form above to add branch locations, or click &ldquo;Skip for now&rdquo; below if your company operates from a single head office.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3 text-center w-14">Sr. No.</th>
                    <th className="py-3 px-4">Branch Name</th>
                    <th className="py-3 px-3">Branch Code</th>
                    <th className="py-3 px-4">Address</th>
                    <th className="py-3 px-3">State</th>
                    <th className="py-3 px-3">PIN Code</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {branches.map((branch, index) => {
                    const isEditingThis = editingBranchId === branch.id;
                    return (
                      <tr
                        key={branch.id}
                        className={`transition-colors ${
                          isEditingThis
                            ? 'bg-indigo-950/30 ring-1 ring-inset ring-indigo-500/50'
                            : 'hover:bg-slate-850/60 bg-slate-900/40'
                        }`}
                      >
                        {/* Auto-increment Sr. No. 1, 2, 3... */}
                        <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-400">
                          {index + 1}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <div className="flex flex-col">
                            <span>{branch.branchName}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              Contact: {branch.contactPerson} ({branch.phone})
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[11px] font-semibold">
                            {branch.branchCode}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 max-w-[200px] truncate" title={branch.address}>
                          {branch.address}
                        </td>
                        <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap">{branch.state}</td>
                        <td className="py-3.5 px-3 text-slate-300 font-mono">{branch.pinCode}</td>
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleEditClick(branch)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/20 transition-colors cursor-pointer"
                              title="Edit Branch"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingBranch(branch)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                              title="Delete Branch"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Bottom Action Buttons: Save & Finish, Skip for now */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleFinish}
              disabled={isFinishing}
              className="text-xs sm:text-sm text-slate-400 hover:text-slate-200 transition-colors cursor-pointer py-2 px-3 order-2 sm:order-1"
            >
              Skip for now
            </button>

            <button
              type="button"
              onClick={handleFinish}
              disabled={isFinishing}
              className={`w-full sm:w-auto py-3 px-8 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 ring-1 ring-white/10 transition-all cursor-pointer flex items-center justify-center gap-2 group order-1 sm:order-2 ${
                isFinishing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isFinishing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Finalizing Setup...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save All Branches & Finish</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingBranch}
        onClose={() => setDeletingBranch(null)}
        title="Delete Branch"
        description={`Are you sure you want to remove "${deletingBranch?.branchName}" (${deletingBranch?.branchCode})? The remaining branches will automatically re-number.`}
        confirmText="Yes, Delete Branch"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        confirmVariant="danger"
      />
    </div>
  );
};
