
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

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Carregando..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('RequireAuth: No user, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render children
  console.log('RequireAuth: User authenticated, rendering children');
  return <>{children}</>;
};
