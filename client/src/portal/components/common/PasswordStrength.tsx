import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password?: string;
}

interface Requirement {
  id: string;
  label: string;
  test: (val: string) => boolean;
}

const REQUIREMENTS: Requirement[] = [
  { id: 'minLen', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'upper', label: 'One uppercase letter (A-Z)', test: (v) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'One lowercase letter (a-z)', test: (v) => /[a-z]/.test(v) },
  { id: 'number', label: 'One number (0-9)', test: (v) => /[0-9]/.test(v) },
  { id: 'special', label: 'One special character (!@#$%^&*)', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password = '' }) => {
  if (!password) {
    return null;
  }

  const results = REQUIREMENTS.map((req) => ({
    ...req,
    met: req.test(password),
  }));

  const metCount = results.filter((r) => r.met).length;

  // Strength score
  let strengthLabel = 'Very Weak';
  let strengthColor = 'bg-rose-500';
  let textColor = 'text-rose-400';

  if (metCount === 5) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-500';
    textColor = 'text-emerald-400';
  } else if (metCount >= 4) {
    strengthLabel = 'Good';
    strengthColor = 'bg-teal-500';
    textColor = 'text-teal-400';
  } else if (metCount >= 3) {
    strengthLabel = 'Fair';
    strengthColor = 'bg-amber-500';
    textColor = 'text-amber-400';
  } else if (metCount >= 2) {
    strengthLabel = 'Weak';
    strengthColor = 'bg-rose-400';
    textColor = 'text-rose-400';
  }

  return (
    <div className="mt-3 space-y-2.5 animate-in fade-in duration-200">
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400 font-medium">Password Strength:</span>
          <span className={`font-semibold ${textColor}`}>{strengthLabel}</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`h-full rounded-full transition-colors duration-300 ${
                index < metCount ? strengthColor : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Real-time requirements checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {results.map((req) => (
          <div key={req.id} className="flex items-center gap-1.5 text-xs">
            {req.met ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            )}
            <span className={req.met ? 'text-slate-300' : 'text-slate-500'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
