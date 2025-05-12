
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLoading } from "@/contexts/LoadingContext";
import { useAppInit } from "@/contexts/AppInitContext";

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isLoading, setStage } = useLoading();
  const { initialized } = useAppInit();
  const location = useLocation();

  useEffect(() => {
    if (authLoading) {
      setStage('auth');
    }
  }, [authLoading, setStage]);

  // Still loading authentication
  if (authLoading || isLoading) {
    return null; // Loading screen is handled by LoadingProvider
  }

  // No user found, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Authentication passed, render children
  return <>{children}</>;
};

export default RequireAuth;
