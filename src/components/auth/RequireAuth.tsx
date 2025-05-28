import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";
import { OnboardingRedirect } from "./OnboardingRedirect";

interface RequireAuthProps {
  children: ReactNode;
  skipOnboardingCheck?: boolean;
  requireAdmin?: boolean;
}

export function RequireAuth({ 
  children, 
  skipOnboardingCheck = false,
  requireAdmin = false 
}: RequireAuthProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && !user.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!skipOnboardingCheck && !user.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  // If we should skip the onboarding check (for the onboarding page itself)
  if (skipOnboardingCheck) {
    return <>{children}</>;
  }

  // Use the non-blocking onboarding notification approach
  return <OnboardingRedirect>{children}</OnboardingRedirect>;
}

export default RequireAuth;
