import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { mockApiService } from '../services/mockApi';
import type { OnboardingState } from '../types/onboarding';

interface OnboardingContextType {
  state: OnboardingState;
  loading: boolean;
  error: string | null;
  refreshState: () => Promise<OnboardingState>;
  resetFlow: () => Promise<void>;
  canAccessStep: (targetStep: number) => boolean;
  getActiveStepRoute: () => string;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OnboardingState>(() => mockApiService.getStoredState());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshState = useCallback(async (): Promise<OnboardingState> => {
    try {
      const fresh = await mockApiService.getState();
      setState(fresh);
      return fresh;
    } catch (e) {
      console.error(e);
      setError('Failed to load onboarding state.');
      return state;
    }
  }, [state]);

  useEffect(() => {
    refreshState().finally(() => setLoading(false));
  }, [refreshState]);

  const resetFlow = useCallback(async () => {
    setLoading(true);
    await mockApiService.resetOnboarding();
    const fresh = await mockApiService.getState();
    setState(fresh);
    setLoading(false);
  }, []);

  /**
   * Flow rule: user cannot skip ahead without minimum required data.
   * Step 1: always accessible
   * Step 2 (TOTP): optional
   * Step 3: accessible once user exists
   * Step 4: accessible once user & company exist
   */
  const canAccessStep = useCallback(
    (targetStep: number): boolean => {
      const stored = mockApiService.getStoredState();
      const user = state.user || stored.user;
      const company = state.company || stored.company;

      if (targetStep === 1) return true;
      if (targetStep === 2) return !!user;
      if (targetStep === 3) return !!user; // TOTP is optional
      if (targetStep === 4) return !!user && !!company;
      return false;
    },
    [state.user, state.company]
  );

  const getActiveStepRoute = useCallback((): string => {
    const stored = mockApiService.getStoredState();
    const isCompleted = state.onboardingCompleted || stored.onboardingCompleted;
    const user = state.user || stored.user;
    const company = state.company || stored.company;

    if (isCompleted) return '/summary';
    if (!user) return '/step-1';
    if (!company) {
      if (!user.isTotpVerified && !user.totpSkipped) return '/step-2';
      return '/step-3';
    }
    return '/step-4';
  }, [state.onboardingCompleted, state.user, state.company]);

  return (
    <OnboardingContext.Provider
      value={{
        state,
        loading,
        error,
        refreshState,
        resetFlow,
        canAccessStep,
        getActiveStepRoute,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
