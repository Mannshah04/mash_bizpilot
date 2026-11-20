import React, { useRef, useEffect } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  onComplete?: (val: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  onComplete,
  disabled = false,
  hasError = false,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  // Auto-focus first input on mount
  useEffect(() => {
    if (!disabled && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [disabled]);

  const setDigitAt = (index: number, char: string) => {
    const chars = value.split('');
    // Fill gaps if any
    while (chars.length < index) {
      chars.push('');
    }
    chars[index] = char;
    const newVal = chars.slice(0, 6).join('');
    onChange(newVal);

    if (newVal.length === 6 && onComplete) {
      onComplete(newVal);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      if (digits[index]) {
        // Clear current
        setDigitAt(index, '');
      } else if (index > 0) {
        // Move to previous and clear it
        inputsRef.current[index - 1]?.focus();
        setDigitAt(index - 1, '');
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = e.target.value.replace(/\D/g, ''); // numbers only

    if (!val) {
      setDigitAt(index, '');
      return;
    }

    // Single digit input
    const single = val.slice(-1);
    setDigitAt(index, single);

    // Auto-advance to next input
    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    onChange(pastedData);

    // Focus last filled input or next empty
    const nextFocusIndex = Math.min(pastedData.length, 5);
    inputsRef.current[nextFocusIndex]?.focus();

    if (pastedData.length === 6 && onComplete) {
      onComplete(pastedData);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          aria-label={`Digit ${idx + 1}`}
          className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl border transition-all outline-none ${
            hasError
              ? 'border-rose-500/80 bg-rose-500/10 text-rose-300 ring-2 ring-rose-500/20'
              : digit
              ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-sm ring-1 ring-indigo-500/30'
              : 'border-slate-700 bg-slate-900/80 text-slate-200 hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:bg-slate-900'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      ))}
    </div>
  );
};
