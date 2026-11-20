import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import { Check, Lock, UserPlus, KeyRound, Building2, GitBranch } from 'lucide-react';

interface StepMeta {
  number: number;
  id: string;
  route: string;
  title: string;
  shortDesc: string;
  icon: React.ElementType;
}

const STEPS: StepMeta[] = [
  {
    number: 1,
    id: 'signup',
    route: '/step-1',
    title: 'Sign Up',
    shortDesc: 'Account Credentials',
    icon: UserPlus,
  },
  {
    number: 2,
    id: 'totp',
    route: '/step-2',
    title: 'Verify TOTP',
    shortDesc: '2FA (Optional)',
    icon: KeyRound,
  },
  {
    number: 3,
    id: 'company',
    route: '/step-3',
    title: 'Company Details',
    shortDesc: 'Main Entity & GST',
    icon: Building2,
  },
  {
    number: 4,
    id: 'branches',
    route: '/step-4',
    title: 'Branch Creation',
    shortDesc: 'Branch Offices',
    icon: GitBranch,
  },
];

export const Stepper: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, canAccessStep } = useOnboarding();

  // Determine current active step number from route
  const getCurrentStepNumber = (): number => {
    if (location.pathname === '/step-1') return 1;
    if (location.pathname === '/step-2') return 2;
    if (location.pathname === '/step-3') return 3;
    if (location.pathname === '/step-4') return 4;
    if (location.pathname === '/summary') return 5;
    return 1;
  };

  const currentStepNum = getCurrentStepNumber();

  // Progress percentage calculation
  const getProgressPercentage = () => {
    if (state.onboardingCompleted || currentStepNum === 5) return 100;
    if (currentStepNum === 4) return 75;
    if (currentStepNum === 3) return 50;
    if (currentStepNum === 2) return 25;
    return 10;
  };

  const isStepCompleted = (stepNum: number): boolean => {
    if (stepNum === 1) return !!state.user;
    if (stepNum === 2) return !!state.user?.isTotpVerified;
    if (stepNum === 3) return !!state.company;
    if (stepNum === 4) return state.onboardingCompleted;
    return false;
  };

  const handleStepClick = (step: StepMeta) => {
    // Only allow clicking if user has permission to access that step
    if (canAccessStep(step.number)) {
      navigate(step.route);
    }
  };

  return (
    <div className="w-full bg-slate-900/50 border-b border-slate-800/60 py-4 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar Header */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-slate-400 font-medium">
            {currentStepNum <= 4 ? (
              <>
                Step <span className="text-indigo-400 font-bold">{currentStepNum}</span> of 4:{' '}
                <span className="text-white font-medium">
                  {STEPS.find((s) => s.number === currentStepNum)?.title}
                </span>
              </>
            ) : (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> All Steps Completed
              </span>
            )}
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            {getProgressPercentage()}% Complete
          </span>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>

        {/* 4 Step Badges Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {STEPS.map((step) => {
            const completed = isStepCompleted(step.number);
            const isCurrent = currentStepNum === step.number;
            const accessible = canAccessStep(step.number);
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepClick(step)}
                disabled={!accessible && !completed}
                className={`group text-left p-2.5 sm:p-3 rounded-xl transition-all duration-200 border relative ${
                  isCurrent
                    ? 'bg-indigo-600/10 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                    : completed
                    ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-850 cursor-pointer'
                    : 'bg-slate-950/30 border-slate-900 text-slate-600 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold transition-colors ${
                      completed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isCurrent
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {completed ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : accessible ? (
                      <Icon className="w-3.5 h-3.5" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 hidden sm:block">
                    <p
                      className={`text-xs font-semibold truncate ${
                        isCurrent
                          ? 'text-white'
                          : completed
                          ? 'text-slate-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate hidden md:block">
                      {step.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Mobile text below */}
                <p
                  className={`text-[10px] font-medium truncate mt-1 sm:hidden text-center ${
                    isCurrent
                      ? 'text-indigo-400'
                      : completed
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}
                >
                  {step.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
