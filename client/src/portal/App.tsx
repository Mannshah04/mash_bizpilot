import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import { Header } from './components/layout/Header';
import { Stepper } from './components/layout/Stepper';
import { Step1SignUp } from './components/steps/Step1SignUp';
import { Step2Totp } from './components/steps/Step2Totp';
import { Step3Company } from './components/steps/Step3Company';
import { Step4Branches } from './components/steps/Step4Branches';
import { SummaryScreen } from './components/steps/SummaryScreen';
import { BusinessPortalPage } from './pages/BusinessPortalPage';
import { HashRedirect } from './components/HashRedirect';

const LoginRedirect: React.FC<{ onNavigateToLogin?: () => void }> = ({ onNavigateToLogin }) => {
  React.useEffect(() => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else {
      window.location.hash = '#/login';
    }
  }, [onNavigateToLogin]);
  return null;
};

const StepGuard: React.FC<{
  stepNumber: number;
  children: React.ReactNode;
}> = ({ stepNumber, children }) => {
  const { canAccessStep, getActiveStepRoute, loading } = useOnboarding();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!canAccessStep(stepNumber)) {
    return <Navigate to={getActiveStepRoute()} replace />;
  }

  return <>{children}</>;
};

const SummaryGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, getActiveStepRoute, loading } = useOnboarding();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!state.onboardingCompleted) {
    return <Navigate to={getActiveStepRoute()} replace />;
  }

  return <>{children}</>;
};

const OnboardingRedirect: React.FC = () => {
  const { getActiveStepRoute, loading } = useOnboarding();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return <Navigate to={getActiveStepRoute()} replace />;
};

// Layout wrapper for the 4-step onboarding flow
const OnboardingLayout: React.FC<{ onNavigateToLogin?: () => void }> = () => {
  return (
    <div className="bizpilot-portal min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header with brand and reset */}
      <Header />

      {/* 4-Step Progress Indicator */}
      <Stepper />

      {/* Onboarding step content */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Bizpilot Technologies Inc. All rights reserved.</span>
          <span className="text-slate-600">Client-Side Onboarding & Verification System</span>
        </div>
      </footer>
    </div>
  );
};

export const AppContent: React.FC<{ onNavigateToLogin?: () => void }> = ({ onNavigateToLogin }) => {
  return (
    <Routes>
      {/* Main Business Portal Landing & Product Preview */}
      <Route path="/" element={<BusinessPortalPage onNavigateToLogin={onNavigateToLogin} />} />

      {/* Route to switch to ERP login */}
      <Route path="/login" element={<LoginRedirect onNavigateToLogin={onNavigateToLogin} />} />

      {/* Onboarding routes wrapped in Stepper Layout */}
      <Route element={<OnboardingLayout onNavigateToLogin={onNavigateToLogin} />}>
        <Route path="/onboarding" element={<OnboardingRedirect />} />

        <Route
          path="/step-1"
          element={
            <StepGuard stepNumber={1}>
              <Step1SignUp />
            </StepGuard>
          }
        />

        <Route
          path="/step-2"
          element={
            <StepGuard stepNumber={2}>
              <Step2Totp />
            </StepGuard>
          }
        />

        <Route
          path="/step-3"
          element={
            <StepGuard stepNumber={3}>
              <Step3Company />
            </StepGuard>
          }
        />

        <Route
          path="/step-4"
          element={
            <StepGuard stepNumber={4}>
              <Step4Branches />
            </StepGuard>
          }
        />

        <Route
          path="/summary"
          element={
            <SummaryGuard>
              <SummaryScreen />
            </SummaryGuard>
          }
        />
      </Route>

      {/* Fallback to portal */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function PortalApp({ onNavigateToLogin }: { onNavigateToLogin?: () => void }) {
  return (
    <HashRouter>
      <OnboardingProvider>
        <HashRedirect />
        <AppContent onNavigateToLogin={onNavigateToLogin} />
      </OnboardingProvider>
    </HashRouter>
  );
}
