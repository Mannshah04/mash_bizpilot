import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  confirmVariant?: 'danger' | 'primary';
  loading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  confirmVariant = 'danger',
  loading = false,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3">
          {confirmVariant === 'danger' && (
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-white">{title}</h3>
            {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
          </div>
        </div>

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-white shadow-lg transition-all cursor-pointer flex items-center gap-2 ${
                confirmVariant === 'danger'
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30 ring-1 ring-rose-500/50'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
