import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { Loader } from "@/components/ui/loader";

const Index = () => {
  const { user, loading } = useAuth();
  const { needsOnboarding, loading: onboardingLoading, businessId } = useNeedsOnboarding();
  
  useEffect(() => {
    document.title = "Unclic Manager";
  }, []);
  
  if (loading || (user && onboardingLoading)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" text="Carregando..." />
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated but no business ID, something is wrong
  if (!businessId) {
    console.error("No business ID found for authenticated user");
    // Try to recover by navigating to onboarding
    return <Navigate to="/onboarding" replace />;
  }
  
  // If onboarding is needed and we have a business ID, go to onboarding
  if (needsOnboarding && businessId) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // Otherwise, redirect to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;
