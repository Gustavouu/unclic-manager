
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useLoading } from "@/contexts/LoadingContext";
import { useInitialization } from "@/hooks/useInitialization";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { isLoading, setStage, setProgress } = useLoading();
  
  // Initialize the application
  useInitialization();
  
  useEffect(() => {
    document.title = "Unclic Manager";
    
    // Update loading stage based on auth status
    if (authLoading) {
      setStage("auth");
      setProgress(20);
    } else if (user) {
      setStage("dashboard");
      setProgress(90);
    }
  }, [authLoading, user, setStage, setProgress]);
  
  // Show loading screen while initializing or checking auth
  if (isLoading || authLoading) {
    return <LoadingScreen />;
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Always redirect to dashboard when authenticated
  return <Navigate to="/dashboard" replace />;
};

export default Index;
