
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { Loader } from "@/components/ui/loader";
import { useTenant } from "@/contexts/TenantContext";

const Index = () => {
  const { user, loading } = useAuth();
  const { needsOnboarding, loading: onboardingLoading, refreshOnboardingStatus } = useNeedsOnboarding();
  const { refreshBusinessData } = useTenant();
  
  useEffect(() => {
    document.title = "Unclic Manager";
    
    // If user is logged in, refresh business data
    if (user) {
      const refresh = async () => {
        try {
          await Promise.all([
            refreshBusinessData(),
            refreshOnboardingStatus()
          ]);
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        }
      };
      
      refresh();
    }
  }, [user, refreshBusinessData, refreshOnboardingStatus]);
  
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
  
  // Even if onboarding is needed, send to dashboard instead of forcing onboarding
  return <Navigate to="/dashboard" replace />;
};

export default Index;
