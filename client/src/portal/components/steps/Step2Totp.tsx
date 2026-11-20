import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { mockApiService } from '../../services/mockApi';
import { useOnboarding } from '../../context/OnboardingContext';
import { OtpInput } from '../common/OtpInput';
import type { TotpSetupData } from '../../types/onboarding';
import {
  KeyRound,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Smartphone,
  Clock,
  Wand2,
} from 'lucide-react';

export const Step2Totp: React.FC = () => {
  const navigate = useNavigate();
  const { state, refreshState } = useOnboarding();

  const [setupData, setSetupData] = useState<TotpSetupData | null>(null);
  const [loadingSetup, setLoadingSetup] = useState<boolean>(true);
  const [otpCode, setOtpCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);

  // Load TOTP setup
  useEffect(() => {
    let isMounted = true;
    async function loadTotp() {
      try {
        setLoadingSetup(true);
        const data = await mockApiService.getTotpSetup(state.user?.id);
        if (isMounted) {
          setSetupData(data);
        }
      } catch (e) {
        console.error('Failed to load TOTP setup', e);
      } finally {
        if (isMounted) setLoadingSetup(false);
      }
    }
    loadTotp();
    return () => {
      isMounted = false;
    };
  }, [state.user?.id]);

  // Authenticator 30s cycle countdown
  useEffect(() => {
    const updateCountdown = () => {
      const epochSeconds = Math.floor(Date.now() / 1000);
      const remaining = 30 - (epochSeconds % 30);
      setSecondsRemaining(remaining);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopySecret = async () => {
    if (!setupData?.secret) return;
    try {
      await navigator.clipboard.writeText(setupData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleVerify = useCallback(
    async (codeToVerify?: string) => {
      const code = (codeToVerify || otpCode).trim();
      if (code.length !== 6) {
        setErrorMessage('Please enter all 6 digits of the authentication code.');
        return;
      }

      try {
        setIsVerifying(true);
        setErrorMessage(null);

        const result = await mockApiService.verifyTotp(state.user?.id || 'usr_default', code);

        if (!result.success) {
          setErrorMessage(result.error || 'Invalid code. Please check your authenticator app and try again.');
          return;
        }

        // Success!
        setIsVerifiedSuccess(true);
        await refreshState();

        // Short transition to let user experience success confirmation
        setTimeout(() => {
          navigate('/step-3');
        }, 1200);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Verification failed.');
      } finally {
        setIsVerifying(false);
      }
    },
    [otpCode, state.user?.id, refreshState, navigate]
  );

  // Quick helper to fill current valid OTP (for effortless testing/evaluation)
  const handleTestAutoFill = () => {
    if (!setupData?.secret) return;
    const currentValidToken = mockApiService.generateCurrentTotpToken(setupData.secret);
    if (currentValidToken) {
      setOtpCode(currentValidToken);
      setErrorMessage(null);
      // Auto verify with the generated valid token
      handleVerify(currentValidToken);
    }
  };

  const handleSkipTotp = async () => {
    try {
      setIsVerifying(true);
      setErrorMessage(null);
      await mockApiService.skipTotp(state.user?.id);
      await refreshState();
      navigate('/step-3');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Could not proceed to next step.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (loadingSetup) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Generating your secure 2FA credentials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 sm:p-10 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Step Header */}
        <div className="text-center mb-6 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Step 2 of 4 &bull; Optional
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <KeyRound className="w-7 h-7 text-indigo-400" />
            <span>Set Up Authenticator (TOTP)</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Optional</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Scan the QR code with your authenticator app, or click <strong>Skip for now</strong> below to proceed directly with your company and branch setup.
          </p>
        </div>

        {/* Instruction Banner */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3 text-xs text-slate-300">
          <Smartphone className="w-5 h-5 text-indigo-400 shrink-0" />
          <span>
            Scan with <strong>Google Authenticator</strong>, <strong>Authy</strong>, or <strong>Microsoft Authenticator</strong>.
          </span>
        </div>

        {/* Success Banner if verified */}
        {isVerifiedSuccess ? (
          <div className="my-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-emerald-400">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h2 className="text-lg font-bold text-white">Two-Factor Authentication Verified!</h2>
            <p className="text-xs text-emerald-300 mt-1">
              Your device has been verified. Redirecting to Company Details...
            </p>
          </div>
        ) : (
          <>
            {/* QR Code and Secret Key section */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col items-center gap-4 mb-6">
              {/* QR Code */}
              <div className="p-3 bg-white rounded-2xl shadow-xl shadow-black/40 ring-4 ring-indigo-500/20">
                {setupData?.otpauthUri ? (
                  <QRCodeSVG
                    value={setupData.otpauthUri}
                    size={170}
                    level="M"
                    includeMargin={false}
                  />
                ) : (
                  <div className="w-[170px] h-[170px] bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                    Generating...
                  </div>
                )}
              </div>

              {/* Secret key text + Copy button */}
              <div className="w-full">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 px-1">
                  <span>Secret Key (Manual Entry):</span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Cycle: {secondsRemaining}s</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <code className="text-xs sm:text-sm font-mono font-semibold text-indigo-300 tracking-wider flex-1 truncate px-2 select-all">
                    {setupData?.secret || '--------------------'}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      copied
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2 animate-in shake duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 6-Digit OTP Section */}
            <div className="space-y-4">
              <div className="text-center">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Enter 6-Digit Code From Authenticator <span className="text-rose-400">*</span>
                </label>
                <p className="text-[11px] text-slate-400">
                  Time-based window: 30s period (±1 window tolerance enabled)
                </p>
              </div>

              {/* Custom 6-Box OTP Input */}
              <OtpInput
                value={otpCode}
                onChange={(val) => {
                  setOtpCode(val);
                  if (errorMessage) setErrorMessage(null);
                }}
                onComplete={(code) => {
                  handleVerify(code);
                }}
                disabled={isVerifying}
                hasError={!!errorMessage}
              />

              {/* Verify Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleVerify()}
                  disabled={isVerifying || otpCode.length !== 6}
                  className={`w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 ring-1 ring-white/10 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group ${
                    isVerifying || otpCode.length !== 6 ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {isVerifying ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Token...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Continue</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {/* Dev/Testing Helper: Auto-fill current token */}
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleTestAutoFill}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400/90 hover:text-indigo-300 hover:underline transition-colors cursor-pointer py-1 px-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
                  title="Simulates an authenticator app generating the active 30s code"
                >
                  <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Auto-fill current valid OTP (1-Click Test)</span>
                </button>
              </div>

              {/* Optional Step: Skip for now button */}
              <div className="pt-4 border-t border-slate-800/80 mt-4 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={handleSkipTotp}
                  disabled={isVerifying}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-xs border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Skip 2FA for now (Optional) & Continue to Step 3</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                </button>
                <p className="text-[11px] text-slate-400 text-center">
                  You can always configure or mandate Two-Factor Authentication later in your Security settings.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
