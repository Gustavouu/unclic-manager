
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";

const Index = () => {
  const { user, loading } = useAuth();
  const { needsOnboarding, loading: onboardingLoading } = useNeedsOnboarding();
  
  useEffect(() => {
    document.title = "Unclic Manager";
  }, []);
  
  if (loading || (user && onboardingLoading)) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated and needs onboarding, redirect to onboarding
  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // If authenticated and doesn't need onboarding, redirect to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;
