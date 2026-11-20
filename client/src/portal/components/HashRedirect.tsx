import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * HashRedirect watches the URL hash and redirects to appropriate routes.
 * - "#features" is handled by the browser's default anchor scrolling.
 * - "#register" redirects to the company creation step of the onboarding flow.
 */
export const HashRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === '#register') {
      // Navigate to the company creation step (step-3) of onboarding.
      navigate('/step-3', { replace: true });
    }
    // No need to handle "#features" – the browser will scroll to the element with id="features".
  }, [hash, navigate]);

  return null;
};
