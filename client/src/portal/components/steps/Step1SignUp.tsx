import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { mockApiService } from '../../services/mockApi';
import { useOnboarding } from '../../context/OnboardingContext';
import { PasswordStrength } from '../common/PasswordStrength';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const signUpSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter (A-Z)')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter (a-z)')
      .regex(/[0-9]/, 'Must contain at least one number (0-9)')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character (!@#$%^&*)'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match. Please re-enter identical passwords.',
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export const Step1SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { state, refreshState } = useOnboarding();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      email: state.user?.email || '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchedPassword = watch('password', '');

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsSubmitting(true);
      setServerError(null);

      await mockApiService.signUp(data.email, data.password);
      await refreshState();

      // Proceed to Step 2 (TOTP verification)
      navigate('/step-2');
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      {/* Card Container */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-10 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Step 1 of 4
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto">
            Get started with Bizpilot. Set up your administrator credentials and secure login.
          </p>
        </div>

        {/* Existing user alert if reviewing step */}
        {state.user && (
          <div className="mb-6 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              Account exists for <strong className="text-white">{state.user.email}</strong>. Submitting will update credentials.
            </span>
          </div>
        )}

        {/* Server error */}
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <span className="font-semibold">Error:</span> {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Work Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="founder@company.com"
                autoComplete="email"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/60 border text-sm text-white placeholder-slate-500 transition-all outline-none ${
                  errors.email
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter a secure password"
                autoComplete="new-password"
                {...register('password')}
                className={`w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950/60 border text-sm text-white placeholder-slate-500 transition-all outline-none ${
                  errors.password
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">
                {errors.password.message}
              </p>
            )}

            {/* Password strength indicator */}
            <PasswordStrength password={watchedPassword} />
          </div>

          {/* Confirm Password field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Confirm Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                className={`w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950/60 border text-sm text-white placeholder-slate-500 transition-all outline-none ${
                  errors.confirmPassword
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-slate-500">
            By proceeding, you agree to 2-Factor Authentication setup in the next step.
          </p>
        </form>
      </div>
    </div>
  );
};
