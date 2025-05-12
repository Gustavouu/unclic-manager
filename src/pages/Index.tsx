
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useLoading } from "@/contexts/LoadingContext";
import { useInitialization } from "@/hooks/useInitialization";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading: onboardingLoading } = useNeedsOnboarding();
  const { isLoading, setStage, setProgress } = useLoading();
  
  // Initialize the application
  useInitialization();
  
  useEffect(() => {
    document.title = "Unclic Manager";
    
    // Update loading stage based on auth status
    if (authLoading) {
      setStage("auth");
      setProgress(20);
    } else if (user && onboardingLoading) {
      setStage("user_data");
      setProgress(50);
    }
  }, [authLoading, user, onboardingLoading, setStage, setProgress]);
  
  // Show loading screen while initializing or checking auth/onboarding
  if (isLoading || authLoading || (user && onboardingLoading)) {
    return <LoadingScreen />;
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Even if onboarding is needed, send to dashboard instead of forcing onboarding
  return <Navigate to="/dashboard" replace />;
};

export default Index;
