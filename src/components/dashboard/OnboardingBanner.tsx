
import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useTenant } from "@/contexts/TenantContext";
import { useDebouncedCallback } from "@/hooks/useDebounce";

export const OnboardingBanner: React.FC = () => {
  const { needsOnboarding, loading, error, onboardingViewed, markOnboardingAsViewed } = useNeedsOnboarding();
  const { currentBusiness, updateBusinessStatus } = useTenant();
  const navigate = useNavigate();
  
  // Always define hooks at the top level, never conditionally
  const handleFixStatus = useDebouncedCallback(async () => {
    if (!currentBusiness?.id) {
      toast.error("Não foi possível identificar o negócio.");
      return;
    }
    
    try {
      toast.loading("Corrigindo status do negócio...", { id: "fix-status" });
      
      // Use the TenantContext function to update status
      const success = await updateBusinessStatus(currentBusiness.id, "ativo");
      
      if (!success) {
        throw new Error("Não foi possível atualizar o status do negócio");
      }
      
      toast.success("Status do negócio corrigido com sucesso!", { id: "fix-status" });
      
      // Mark as viewed to hide the banner
      markOnboardingAsViewed();
    } catch (error: any) {
      console.error("Erro ao corrigir status:", error);
      toast.error(`Erro ao corrigir status: ${error.message}`, { id: "fix-status" });
    }
  }, 1000); // Prevent clicks more often than once per second
  
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
  
  // Special message for businesses with "pendente" status that completed onboarding
  const isPendingStatus = currentBusiness?.status === "pendente";
  
  return (
    <Alert className="mb-6 border-amber-500">
      <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
        <div>
          <AlertTitle className="text-base font-bold">
            {isPendingStatus ? "Status pendente" : "Configuração incompleta"}
          </AlertTitle>
          <AlertDescription>
            {isPendingStatus 
              ? "Seu negócio tem status pendente. Corrija o status para ter acesso completo a todas as funcionalidades."
              : "Complete a configuração do seu negócio para aproveitar todos os recursos disponíveis."
            }
          </AlertDescription>
        </div>
        <div className="flex gap-2 mt-3 sm:mt-0">
          <Button variant="outline" size="sm" onClick={handleDismiss}>
            Mais tarde
          </Button>
          
          {isPendingStatus ? (
            <Button size="sm" variant="destructive" onClick={handleFixStatus} className="bg-amber-500 hover:bg-amber-600">
              Corrigir status
            </Button>
          ) : (
            <Button size="sm" onClick={handleContinueSetup}>
              Continuar configuração
            </Button>
          )}
        </div>
      </div>
    </Alert>
  );
};
