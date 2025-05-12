
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/contexts/TenantContext";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { toast } from "sonner";
import { Wrench } from "lucide-react";

export const StatusFixButton: React.FC = () => {
  const { currentBusiness, updateBusinessStatus } = useTenant();
  const { refreshOnboardingStatus } = useNeedsOnboarding();
  const [isFixing, setIsFixing] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;
  
  // Define function to handle fixing status
  const handleFixStatus = useCallback(async () => {
    if (isFixing) return;
    if (!currentBusiness?.id) {
      toast.error("Negócio não identificado");
      return;
    }
    
    try {
      setIsFixing(true);
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
      
      // Refresh onboarding status after successful status update with forced skip cache
      await refreshOnboardingStatus(true);
      
      toast.success("Status do negócio corrigido com sucesso!", { id: "fix-status" });
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
      setIsFixing(false);
    }
  }, [currentBusiness, updateBusinessStatus, attempts, refreshOnboardingStatus, isFixing]);
  
  // Only show if business exists 
  if (!currentBusiness) {
    return null;
  }
  
  return (
    <Button 
      size="sm" 
      variant="outline"
      disabled={isFixing}
      onClick={handleFixStatus}
      className="fixed bottom-4 right-4 z-50 bg-amber-500 hover:bg-amber-600 text-white"
    >
      <Wrench className="h-4 w-4 mr-2" />
      {isFixing ? "Processando..." : "Corrigir Status"}
    </Button>
  );
};
