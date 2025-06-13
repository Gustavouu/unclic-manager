
import { ReactNode, useEffect, useState } from "react";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader } from "@/components/ui/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings } from "lucide-react";

interface OnboardingRedirectProps {
  children: ReactNode;
}

export const OnboardingRedirect = ({ children }: OnboardingRedirectProps) => {
  const { 
    needsOnboarding, 
    isLoading, 
    error, 
    businessId, 
    missingSteps,
    refreshStatus 
  } = useOnboardingStatus();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasShownNotification, setHasShownNotification] = useState(false);
  
  useEffect(() => {
    // Don't show notifications or redirect if we're already on an onboarding page
    if (location.pathname.includes('/onboarding')) {
      return;
    }

    // Show notification for incomplete onboarding (non-blocking)
    if (!isLoading && needsOnboarding && !error && !hasShownNotification) {
      const message = businessId 
        ? "Algumas configurações do seu negócio estão pendentes"
        : "Complete a configuração inicial do seu negócio";

      toast.info(message, {
        action: {
          label: "Configurar agora",
          onClick: () => navigate("/onboarding-fixed")
        },
        duration: 10000,
        id: "onboarding-redirect-notification"
      });
      
      setHasShownNotification(true);
    }
  }, [needsOnboarding, isLoading, error, businessId, hasShownNotification, navigate, location.pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader size="lg" text="Verificando configuração..." />
      </div>
    );
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Erro ao verificar configuração</AlertTitle>
            <AlertDescription className="mt-2">
              {error}
            </AlertDescription>
            <div className="mt-4 flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshStatus}
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar novamente
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/onboarding-fixed")}
                className="flex items-center"
              >
                <Settings className="mr-2 h-4 w-4" />
                Ir para configuração
              </Button>
            </div>
          </Alert>
        </div>
      </div>
    );
  }
  
  // Always continue to the requested route - no forced redirects
  return <>{children}</>;
};
