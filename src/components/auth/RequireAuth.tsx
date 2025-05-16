import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNeedsOnboarding } from '@/hooks/useNeedsOnboarding';
import { Loader } from '@/components/ui/loader';

interface RequireAuthProps {
  children: React.ReactNode;
  skipOnboardingCheck?: boolean;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  skipOnboardingCheck = false 
}) => {
  const { user, loading } = useAuth();
  const { needsOnboarding, loading: onboardingLoading } = useNeedsOnboarding();
  const location = useLocation();
  
  // Show loader while checking authentication status
  if (loading || (!skipOnboardingCheck && user && onboardingLoading)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" text="Verificando autenticação..." />
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If needs onboarding and we're not skipping the check, redirect to onboarding
  if (!skipOnboardingCheck && needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // Otherwise, render the protected content
  return <>{children}</>;
};

export default RequireAuth;
