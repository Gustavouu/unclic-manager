
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  
  useEffect(() => {
    document.title = "Unclic Manager";
  }, []);
  
  // Show loading screen while checking auth
  if (authLoading) {
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
