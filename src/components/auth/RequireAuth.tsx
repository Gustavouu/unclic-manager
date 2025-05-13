
import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/contexts/TenantContext';
import { useLoading } from '@/contexts/LoadingContext';
import { toast } from 'sonner';
import { logErrorToService } from '@/utils/errorHandler';

interface RequireAuthProps {
  children: ReactNode;
  skipOnboardingCheck?: boolean;
}

export const RequireAuth = ({ 
  children, 
  skipOnboardingCheck = false 
}: RequireAuthProps) => {
  const { user, loading: authLoading } = useAuth();
  const { 
    currentBusiness, 
    businessId, 
    loading: businessLoading, 
    refreshBusinessData,
    businessNeedsSetup 
  } = useTenant();
  const { completeLoading } = useLoading();
  const location = useLocation();
  
  // Effect to log authentication state for debugging
  useEffect(() => {
    console.log('RequireAuth: auth state', { 
      isAuthenticated: !!user, 
      authLoading, 
      businessId,
      businessStatus: currentBusiness?.status,
      businessLoading,
      path: location.pathname,
      businessNeedsSetup
    });
    
    if (!user && !authLoading) {
      console.log('RequireAuth: User not authenticated, redirecting to login');
      
      // Log unexpected auth failures (if user was previously authenticated)
      const wasAuthenticated = localStorage.getItem('wasAuthenticated');
      if (wasAuthenticated === 'true') {
        logErrorToService({
          type: 'AUTH_ERROR',
          message: 'Session lost unexpectedly'
        }, {
          component: 'RequireAuth',
          path: location.pathname
        });
      }
    }
    
    // Track authentication state for unexpected logouts
    if (user) {
      localStorage.setItem('wasAuthenticated', 'true');
    }
  }, [user, authLoading, businessId, currentBusiness, businessLoading, location.pathname, businessNeedsSetup]);
  
  // Refresh business data if we have a user but no business data
  useEffect(() => {
    if (user && !businessLoading && !currentBusiness && !skipOnboardingCheck) {
      console.log('RequireAuth: User authenticated but no business data, refreshing');
      refreshBusinessData().catch(err => {
        console.error('Failed to refresh business data:', err);
      });
    }
  }, [user, businessLoading, currentBusiness, skipOnboardingCheck, refreshBusinessData]);
  
  // Ensure loading is complete
  completeLoading();
  
  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3">Verificando autenticação...</span>
      </div>
    );
  }
  
  // If not authenticated, redirect to login with return path
  if (!user) {
    toast.error("Acesso restrito", {
      description: "Você precisa fazer login para acessar esta página",
      duration: 3000,
    });
    
    // Store the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If skipOnboardingCheck is true, don't check business status
  if (skipOnboardingCheck) {
    return <>{children}</>;
  }
  
  // Show loading while checking business data
  if (businessLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="mt-3">Carregando dados do seu negócio...</span>
      </div>
    );
  }
  
  // Check if onboarding is needed
  // Skip onboarding check for the onboarding page itself to avoid loops
  if (location.pathname === '/onboarding') {
    return <>{children}</>;
  }
  
  if (businessNeedsSetup && !location.pathname.includes('/onboarding')) {
    // Needs to complete onboarding, redirect
    toast.info("Onboarding necessário", {
      description: "Complete o cadastro do seu negócio para continuar",
      duration: 5000,
    });
    return <Navigate to="/onboarding" replace />;
  }
  
  // Authenticated and onboarding complete, show children
  return <>{children}</>;
};
