
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

  console.log('RequireAuth - user:', user?.id, 'loading:', loading, 'pathname:', location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Carregando..." />
      </div>
    );
  }

  if (!user) {
    // Evita loop infinito verificando se já estamos na página de auth
    if (location.pathname === '/auth') {
      return <>{children}</>;
    }
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Skip onboarding check if explicitly requested
  if (skipOnboardingCheck) {
    return <>{children}</>;
  }

  // TODO: Add onboarding check logic here if needed
  
  return <>{children}</>;
};
