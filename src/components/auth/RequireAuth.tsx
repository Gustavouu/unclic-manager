
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";
import { OnboardingRedirect } from "./OnboardingRedirect";

interface RequireAuthProps {
  children: ReactNode;
  skipOnboardingCheck?: boolean;
}

export const RequireAuth = ({ children, skipOnboardingCheck = false }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If we should skip the onboarding check (for the onboarding page itself)
  if (skipOnboardingCheck) {
    return <>{children}</>;
  }

  // Check if user needs onboarding and redirect accordingly
  return <OnboardingRedirect>{children}</OnboardingRedirect>;
};

export default RequireAuth;
