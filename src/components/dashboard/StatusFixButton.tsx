
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/contexts/TenantContext";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { toast } from "sonner";
import { Wrench } from "lucide-react";
import { useDebouncedCallback } from "@/hooks/useDebounce";

export const StatusFixButton: React.FC = () => {
  const { currentBusiness, updateBusinessStatus } = useTenant();
  const { refreshOnboardingStatus } = useNeedsOnboarding();
  const [isFixing, setIsFixing] = useState(false);
  
  // Always define the hook at the top level, never conditionally
  const handleFixStatus = useDebouncedCallback(async () => {
    if (isFixing) return;
    if (!currentBusiness?.id) return;
    
    try {
      setIsFixing(true);
      toast.loading("Corrigindo status do negócio...", { id: "fix-status" });
      
      // Use the TenantContext function to update status
      const success = await updateBusinessStatus(currentBusiness.id, "ativo");
      
      if (!success) {
        throw new Error("Não foi possível atualizar o status do negócio");
      }
      
      // Refresh onboarding status after successful status update
      await refreshOnboardingStatus();
      
      toast.success("Status do negócio corrigido com sucesso!", { id: "fix-status" });
    } catch (error: any) {
      console.error("Erro ao corrigir status:", error);
      toast.error(`Erro ao corrigir status: ${error.message}`, { id: "fix-status" });
    } finally {
      setIsFixing(false);
    }
  }, 1000);
  
  // Only show if business exists and has pending status
  if (!currentBusiness || currentBusiness.status !== "pendente") {
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
