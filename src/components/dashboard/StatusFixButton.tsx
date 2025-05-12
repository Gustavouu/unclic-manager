import React, { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/contexts/TenantContext";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { toast } from "sonner";
import { Wrench, RefreshCcw, ShieldAlert, HardDrive } from "lucide-react";
import { clearAllCaches } from "@/utils/cacheUtils";
import { useAppInit } from "@/contexts/AppInitContext";

export const StatusFixButton: React.FC = () => {
  const { currentBusiness, updateBusinessStatus, refreshBusinessData, clearTenantCache } = useTenant();
  const { refreshOnboardingStatus } = useNeedsOnboarding();
  const { healthStatus } = useAppInit();
  const [isFixing, setIsFixing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showSystemStatus, setShowSystemStatus] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  // Show after a delay or if there's an error in localStorage
  useEffect(() => {
    // Check if there were previous errors or emergency flag
    const hasErrors = localStorage.getItem('app_init_errors') === 'true';
    const emergencyMode = localStorage.getItem('app_emergency_continue') === 'true';
    
    // Show immediately if in emergency mode
    if (emergencyMode) {
      setIsVisible(true);
      setShowSystemStatus(true);
      return;
    }
    
    // Show after short delay if there were errors
    if (hasErrors) {
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return;
    }
    
    // Otherwise show after longer delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 30000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Detect health issues and show system status
  useEffect(() => {
    // If any health check fails, show system status
    if (Object.values(healthStatus).some(status => status === false)) {
      setShowSystemStatus(true);
    }
  }, [healthStatus]);
  
  // Define function to handle fixing status
  const handleFixStatus = useCallback(async () => {
    if (isFixing) return;
    
    try {
      setIsFixing(true);
      toast.loading("Corrigindo status do sistema...", { id: "fix-status" });
      
      // Perform a series of fixes
      
      // 1. Clear relevant caches
      const clearedItems = clearAllCaches();
      
      // 2. If we have a business, update its status
      if (currentBusiness?.id) {
        console.log(`Atualizando status do negócio ${currentBusiness.id}`);
        await updateBusinessStatus(currentBusiness.id, "ativo");
      }
      
      // 3. Refresh business data
      await refreshBusinessData();
      
      // 4. Refresh onboarding status
      await refreshOnboardingStatus(true);
      
      toast.success(`Sistema corrigido com sucesso! ${clearedItems} itens de cache limpos.`, { id: "fix-status" });
      
      // Reset attempts counter after successful fix
      setAttempts(0);
      
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
  
  // Clear specifically tenant-related caches
  const handleClearTenantCache = useCallback(() => {
    clearTenantCache();
  }, [clearTenantCache]);
  
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
      {showSystemStatus && (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 mb-2 w-64">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-sm">Status do Sistema</h4>
            <button 
              onClick={() => setShowSystemStatus(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span>Banco de dados:</span>
              <span className={healthStatus.database ? "text-green-600" : "text-red-600"}>
                {healthStatus.database ? "Conectado" : "Erro"} 
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Autenticação:</span> 
              <span className={healthStatus.auth ? "text-green-600" : "text-red-600"}>
                {healthStatus.auth ? "OK" : "Erro"}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Contexto Tenant:</span>
              <span className={healthStatus.tenant ? "text-green-600" : "text-yellow-600"}>
                {healthStatus.tenant ? "OK" : "Aviso"}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Dados negócio:</span> 
              <span className={healthStatus.business ? "text-green-600" : "text-yellow-600"}>
                {healthStatus.business ? "OK" : "Aviso"}
              </span>
            </div>
          </div>
          
          {Object.values(healthStatus).some(status => status === false) && (
            <Button
              size="sm"
              variant="default"
              onClick={handleFixStatus}
              className="w-full mt-2 text-xs h-8"
              disabled={isFixing}
            >
              {isFixing ? "Reparando..." : "Reparar Sistema"}
            </Button>
          )}
        </div>
      )}
      
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
        onClick={() => setShowSystemStatus(!showSystemStatus)}
        className="bg-blue-500 hover:bg-blue-600 text-white"
        title="Ver diagnóstico do sistema"
      >
        <ShieldAlert className="h-4 w-4 mr-2" />
        Status do Sistema
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={handleClearTenantCache}
        className="bg-purple-500 hover:bg-purple-600 text-white"
        title="Limpar apenas cache do tenant atual"
      >
        <HardDrive className="h-4 w-4 mr-2" />
        Limpar Cache Tenant
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
