
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from '@/components/ui/loader';

export interface RequireAuthProps {
  children: React.ReactNode;
  skipOnboardingCheck?: boolean;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  skipOnboardingCheck = false 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Carregando..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Skip onboarding check if explicitly requested
  if (skipOnboardingCheck) {
    return <>{children}</>;
  }

  // TODO: Add onboarding check logic here if needed
  
  return <>{children}</>;
};
