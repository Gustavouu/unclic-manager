
import React, { useEffect, useState } from "react";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { OnboardingProvider } from "@/contexts/onboarding/OnboardingContext";
import { Toaster } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader } from "@/components/ui/loader";
import { useTenant } from "@/contexts/TenantContext";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { toast } from "sonner";

const OnboardingPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { currentBusiness, businessId, loading: businessLoading } = useTenant();
  const { needsOnboarding, loading: onboardingLoading } = useNeedsOnboarding();
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Define page title
  useEffect(() => {
    document.title = "Configuração | Unclic";
  }, []);

  // Check if user is already onboarded and has active business
  useEffect(() => {
    if (!authLoading && !businessLoading && !onboardingLoading) {
      // If user has an active business and it's not pending, redirect to dashboard
      if (currentBusiness && 
          currentBusiness.status !== 'pendente' && 
          !needsOnboarding && 
          localStorage.getItem('force-edit-mode') !== 'true') {
        toast.info("Seu negócio já está configurado. Redirecionando para o dashboard.");
        navigate("/dashboard", { replace: true });
      } else {
        // We've finished checking, allow rendering of onboarding
        setIsInitializing(false);
      }
    }
  }, [authLoading, businessLoading, onboardingLoading, currentBusiness, needsOnboarding, navigate]);

  // When leaving the page, make sure to remove force-edit-mode flag
  useEffect(() => {
    return () => {
      localStorage.removeItem('force-edit-mode');
    };
  }, []);

  // Show loading state while checking authentication
  if (authLoading || businessLoading || onboardingLoading || isInitializing) {
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
        <Onboarding hasExistingBusiness={!!currentBusiness} businessId={businessId} />
        <Toaster position="top-right" />
      </div>
    </OnboardingProvider>
  );
};

export default OnboardingPage;
