
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useTenant } from "@/contexts/TenantContext";
import { useDebouncedCallback } from "@/hooks/useDebounce";

export const OnboardingBanner: React.FC = () => {
  const { needsOnboarding, loading, error, onboardingViewed, markOnboardingAsViewed, refreshOnboardingStatus } = useNeedsOnboarding();
  const { currentBusiness, updateBusinessStatus } = useTenant();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;
  
  // Define hooks at the top level
  const handleFixStatus = useDebouncedCallback(async () => {
    if (isProcessing) return;
    if (!currentBusiness?.id) {
      toast.error("Não foi possível identificar o negócio");
      return;
    }
    
    try {
      setIsProcessing(true);
      toast.loading("Corrigindo status do negócio...", { id: "fix-status" });
      
      console.log(`Tentando atualizar status do negócio ${currentBusiness.id} para 'ativo'. Tentativa ${attempts + 1}/${maxAttempts}`);
      
      // Use the TenantContext function to update status
      const success = await updateBusinessStatus(currentBusiness.id, "ativo");
      
      if (!success) {
        throw new Error("Não foi possível atualizar o status do negócio");
      }
      
      // Force clear local storage caches
      localStorage.removeItem(`business-${currentBusiness.id}-timestamp`);
      localStorage.removeItem(`business-${currentBusiness.id}`);
      
      // Refresh onboarding status after success with forced skip cache
      await refreshOnboardingStatus(true);
      
      toast.success("Status do negócio corrigido com sucesso!", { id: "fix-status" });
      
      // Mark as viewed to hide the banner
      markOnboardingAsViewed();
      setAttempts(0); // Reset attempts on success
      
      // Reload page to ensure all components update properly
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error("Erro ao corrigir status:", error);
      
      // Implement retry mechanism with exponential backoff
      if (attempts < maxAttempts - 1) {
        setAttempts(attempts + 1);
        toast.error(`Erro ao corrigir status. Tentando novamente... (${attempts + 1}/${maxAttempts})`, { id: "fix-status" });
        
        // Wait and try again after a delay with exponential backoff
        const backoffTime = 1000 * Math.pow(2, attempts);
        setTimeout(() => {
          handleFixStatus();
        }, backoffTime);
      } else {
        toast.error(`Erro ao corrigir status após ${maxAttempts} tentativas: ${error.message || 'Erro desconhecido'}`, { id: "fix-status" });
        setAttempts(0); // Reset attempts after max attempts
      }
    } finally {
      setIsProcessing(false);
    }
  }, 1000);
  
  const handleContinueSetup = useCallback(() => {
    navigate("/onboarding");
  }, [navigate]);
  
  const handleDismiss = useCallback(() => {
    markOnboardingAsViewed();
  }, [markOnboardingAsViewed]);
  
  // Don't show if loading, no onboarding needed, error occurred, or already viewed
  if (loading || !needsOnboarding || error || onboardingViewed) {
    return null;
  }
  
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
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={handleFixStatus} 
              className="bg-amber-500 hover:bg-amber-600"
              disabled={isProcessing}
            >
              {isProcessing ? "Processando..." : "Corrigir status"}
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
