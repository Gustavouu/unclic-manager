
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";
import { OnboardingRedirect } from "./OnboardingRedirect";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

interface RequireAuthProps {
  children: ReactNode;
  skipOnboardingCheck?: boolean;
}

export const RequireAuth = ({ children, skipOnboardingCheck = false }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If we should skip the onboarding check (for the onboarding page itself)
  if (skipOnboardingCheck) {
    return <>{children}</>;
  }

  // Use the non-blocking onboarding notification approach
  return <OnboardingRedirect>{children}</OnboardingRedirect>;
};

export default RequireAuth;
