
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNeedsOnboarding } from '@/hooks/useNeedsOnboarding';
import { useAuth } from '@/hooks/useAuth';

interface OnboardingRedirectProps {
  children: React.ReactNode;
}

export const OnboardingRedirect = ({ children }: OnboardingRedirectProps) => {
  const { needsOnboarding, loading } = useNeedsOnboarding();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Only redirect after both auth and onboarding check are done
    if (!authLoading && !loading && user) {
      const isOnboardingPath = location.pathname === '/onboarding';
      
      if (needsOnboarding && !isOnboardingPath) {
        // User needs onboarding but isn't on the onboarding page
        navigate('/onboarding', { replace: true });
      } else if (!needsOnboarding && isOnboardingPath) {
        // User doesn't need onboarding but is on the onboarding page
        navigate('/', { replace: true });
      }
    }
  }, [needsOnboarding, loading, authLoading, user, navigate, location.pathname]);
  
  // Show loading during checks
  if ((loading || authLoading) && user) {
    return <div className="flex items-center justify-center h-screen">Verificando configurações...</div>;
  }
  
  return <>{children}</>;
};

export default OnboardingRedirect;
