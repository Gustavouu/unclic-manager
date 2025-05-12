
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/contexts/TenantContext';
import { useLoading } from '@/contexts/LoadingContext';

interface RequireAuthProps {
  children: ReactNode;
  skipOnboardingCheck?: boolean;
}

export const RequireAuth = ({ 
  children, 
  skipOnboardingCheck = false 
}: RequireAuthProps) => {
  const { user } = useAuth();
  const { currentBusiness } = useTenant();
  const { completeLoading } = useLoading();
  
  // Ensure loading is complete
  completeLoading();
  
  if (!user) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  // If skipOnboardingCheck is true, don't check business status
  if (skipOnboardingCheck) {
    return <>{children}</>;
  }
  
  // Check if onboarding is needed
  const needsOnboarding = !currentBusiness || currentBusiness.status === 'pendente';
  
  if (needsOnboarding) {
    // Needs to complete onboarding, redirect
    return <Navigate to="/onboarding" replace />;
  }
  
  // Authenticated and onboarding complete, show children
  return <>{children}</>;
};
