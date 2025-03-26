
import React, { useEffect } from "react";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { Toaster } from "sonner";

const OnboardingPage = () => {
  // Define título da página
  useEffect(() => {
    document.title = "Configuração Inicial | Unclic";
  }, []);

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
