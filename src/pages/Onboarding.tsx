
import React, { useEffect } from "react";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { OnboardingProvider } from "@/contexts/onboarding/OnboardingContext";
import { Toaster } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loader } from "@/components/ui/loader";

const OnboardingPage = () => {
  const { user, loading } = useAuth();
  
  // Define page title
  useEffect(() => {
    document.title = "Configuração Inicial | Unclic";
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader size="lg" text="Carregando..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-slate-50 py-8">
        <Onboarding />
        <Toaster position="top-right" />
      </div>
    </OnboardingProvider>
  );
};

export default OnboardingPage;
