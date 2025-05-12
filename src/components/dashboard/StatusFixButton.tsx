
import React, { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/contexts/TenantContext";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { toast } from "sonner";
import { Wrench, RefreshCcw } from "lucide-react";

export const StatusFixButton: React.FC = () => {
  const { currentBusiness, updateBusinessStatus, refreshBusinessData } = useTenant();
  const { refreshOnboardingStatus } = useNeedsOnboarding();
  const [isFixing, setIsFixing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  // Show after a delay or if there's an error in localStorage
  useEffect(() => {
    // Check if there were previous errors
    const hasErrors = localStorage.getItem('app_init_errors');
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, hasErrors ? 1000 : 10000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Define function to handle fixing status
  const handleFixStatus = useCallback(async () => {
    if (isFixing) return;
    
    try {
      setIsFixing(true);
      toast.loading("Corrigindo status do sistema...", { id: "fix-status" });
      
      // Perform a series of fixes
      
      // 1. Clear relevant caches
      const cachesToClear = [
        'currentBusinessId',
        'app_init_errors',
        'tenant_id',
        'user_data',
        'business_data'
      ];
      
      cachesToClear.forEach(key => localStorage.removeItem(key));
      
      // 2. If we have a business, update its status
      if (currentBusiness?.id) {
        console.log(`Atualizando status do negócio ${currentBusiness.id}`);
        await updateBusinessStatus(currentBusiness.id, "ativo");
        
        // Force clear business-specific caches
        localStorage.removeItem(`business-${currentBusiness.id}-timestamp`);
        localStorage.removeItem(`business-${currentBusiness.id}`);
      }
      
      // 3. Refresh business data
      await refreshBusinessData();
      
      // 4. Refresh onboarding status
      await refreshOnboardingStatus(true);
      
      toast.success("Sistema corrigido com sucesso! Recarregando...", { id: "fix-status" });
      
      // 5. Reload page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error: any) {
      console.error("Erro ao corrigir sistema:", error);
      
      // Implement retry mechanism with exponential backoff
      if (attempts < maxAttempts - 1) {
        setAttempts(attempts + 1);
        toast.error(`Erro ao corrigir. Tentando novamente... (${attempts + 1}/${maxAttempts})`, { id: "fix-status" });
        
        // Wait and try again after a delay with exponential backoff
        const backoffTime = 1000 * Math.pow(2, attempts);
        setTimeout(() => {
          handleFixStatus();
        }, backoffTime);
      } else {
        toast.error(`Erro após ${maxAttempts} tentativas. Tentando recuperação de emergência...`, { id: "fix-status" });
        
        // Last resort - clear all localStorage and reload
        localStorage.clear();
        setTimeout(() => {
          window.location.href = "/";  // Direct to root for complete restart
        }, 1500);
      }
    } finally {
      setIsFixing(false);
    }
  }, [currentBusiness, updateBusinessStatus, attempts, refreshOnboardingStatus, refreshBusinessData, isFixing]);
  
  // Add a general reset button for when things go wrong
  const handleFullReset = useCallback(() => {
    if (confirm("Isso irá limpar todos os dados locais do navegador e reiniciar o aplicativo. Continuar?")) {
      toast.loading("Reiniciando aplicativo...");
      localStorage.clear();
      sessionStorage.clear();
      
      // Force reload from server, not cache
      setTimeout(() => {
        window.location.href = "/?reset=" + Date.now();
      }, 1000);
    }
  }, []);
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <Button 
        size="sm" 
        variant="outline"
        disabled={isFixing}
        onClick={handleFixStatus}
        className="bg-amber-500 hover:bg-amber-600 text-white"
        title="Corrigir status e resolver problemas comuns"
      >
        <Wrench className="h-4 w-4 mr-2" />
        {isFixing ? "Processando..." : "Corrigir Sistema"}
      </Button>
      
      <Button
        size="sm"
        variant="outline" 
        onClick={handleFullReset}
        className="bg-red-500 hover:bg-red-600 text-white"
        title="Limpar todos os dados locais e reiniciar o aplicativo"
      >
        <RefreshCcw className="h-4 w-4 mr-2" />
        Reiniciar Aplicativo
      </Button>
    </div>
  );
};
