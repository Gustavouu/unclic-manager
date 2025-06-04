
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { Loader } from "@/components/ui/loader";

const Index = () => {
  const { user, loading } = useAuth();
  const { loading: onboardingLoading } = useNeedsOnboarding();
  
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
  
  // Always redirect to dashboard (which will show the optimized dashboard)
  return <Navigate to="/dashboard" replace />;
};

export default Index;
