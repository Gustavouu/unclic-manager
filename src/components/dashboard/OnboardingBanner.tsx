
import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const OnboardingBanner: React.FC = () => {
  const { needsOnboarding, loading, error, onboardingViewed, markOnboardingAsViewed } = useNeedsOnboarding();
  const navigate = useNavigate();
  
  // Don't show if loading, no onboarding needed, error occurred, or already viewed
  if (loading || !needsOnboarding || error || onboardingViewed) {
    return null;
  }
  
  const handleContinueSetup = () => {
    navigate("/onboarding");
  };
  
  const handleDismiss = () => {
    markOnboardingAsViewed();
  };
  
  return (
    <Alert className="mb-6">
      <AlertCircle className="h-4 w-4 mr-2" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
        <div>
          <AlertTitle className="text-base">Configuração incompleta</AlertTitle>
          <AlertDescription>
            Complete a configuração do seu negócio para aproveitar todos os recursos disponíveis.
          </AlertDescription>
        </div>
        <div className="flex gap-2 mt-3 sm:mt-0">
          <Button variant="outline" size="sm" onClick={handleDismiss}>
            Mais tarde
          </Button>
          <Button size="sm" onClick={handleContinueSetup}>
            Continuar configuração
          </Button>
        </div>
      </div>
    </Alert>
  );
};
