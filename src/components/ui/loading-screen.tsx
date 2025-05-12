
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface LoadingScreenProps {
  stage?: string;
  progress?: number;
  message?: string;
}

export function LoadingScreen({ 
  stage = "initializing", 
  progress = 0,
  message
}: LoadingScreenProps) {
  const [dots, setDots] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const [hasAttemptedQuickFix, setHasAttemptedQuickFix] = useState(false);

  // Animation for the loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  // Track loading time to show help button after delay
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTime(prev => {
        const newTime = prev + 1;
        // Show help after 10 seconds
        if (newTime >= 10 && !showHelp) {
          setShowHelp(true);
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [loadingTime, showHelp]);
  
  // Map stage to friendly message if no custom message is provided
  const stageMessages: Record<string, string> = {
    'initializing': 'Inicializando aplicação',
    'auth': 'Verificando autenticação',
    'config': 'Carregando configurações',
    'user_data': 'Carregando seus dados',
    'business_data': 'Carregando dados do negócio',
    'default': 'Carregando'
  };

  const baseMessage = message || stageMessages[stage] || stageMessages.default;
  const displayMessage = `${baseMessage}${dots}`;
  
  const handleQuickFix = () => {
    // Set flag that we tried a quick fix
    setHasAttemptedQuickFix(true);
    
    // Clear problematic caches
    try {
      localStorage.removeItem('currentBusinessId');
      localStorage.removeItem('current_tenant_id');
      
      // Remove any timestamp keys that might be causing cache issues
      Object.keys(localStorage).forEach(key => {
        if (key.includes('timestamp') || key.includes('cache_')) {
          localStorage.removeItem(key);
        }
      });
      
      // Set flag to reload without errors
      localStorage.setItem('bypass_health_check', 'true');
      
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error("Error during quick fix:", error);
    }
  };
  
  const handleEmergencyContinue = () => {
    // Store error flag in localStorage
    localStorage.setItem('app_init_errors', 'true');
    localStorage.setItem('app_emergency_continue', 'true');
    
    // Force navigate to dashboard
    window.location.href = "/dashboard";
  };
  
  const handleBypassConnectivityCheck = () => {
    // Store bypass flag in localStorage
    localStorage.setItem('bypass_connectivity_check', 'true');
    
    // Reload the page
    window.location.reload();
  };
  
  const handleResetAndReload = () => {
    // Clear localStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Reload with cache cleared
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="w-full max-w-md p-6 space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-xl font-semibold text-center">{displayMessage}</h2>
        </div>
      
        {progress > 0 && (
          <>
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-center text-muted-foreground">
              {progress}% completo
            </p>
          </>
        )}
      
        <p className="text-sm text-muted-foreground text-center">
          Isso pode levar alguns instantes. Obrigado pela paciência.
        </p>
        
        {/* Show help options if loading takes too long */}
        {showHelp && (
          <div className="space-y-2 border-t pt-4 mt-4">
            <p className="text-sm font-medium text-center">
              Está demorando mais do que o esperado?
            </p>
            
            <div className="flex flex-col gap-2">
              {!hasAttemptedQuickFix && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleQuickFix}
                  className="w-full"
                >
                  Correção Rápida
                </Button>
              )}
              
              <Button
                variant="outline" 
                size="sm"
                onClick={handleBypassConnectivityCheck}
                className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Pular Verificação de Conectividade
              </Button>
              
              <div className="flex justify-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleResetAndReload}
                >
                  Limpar Cache e Recarregar
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleEmergencyContinue}
                  className="text-amber-600 border-amber-600 hover:bg-amber-50"
                >
                  Continuar Assim Mesmo
                </Button>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground text-center mt-2">
              Se o problema persistir, entre em contato com o suporte.
            </p>
          </div>
        )}
        
        <div className="text-center text-xs text-muted-foreground mt-4">
          {!showHelp && (
            <p>Se o carregamento persistir por muito tempo, tente atualizar a página.</p>
          )}
          <p className="text-gray-400 text-xs mt-1">Tempo de carregamento: {loadingTime}s</p>
        </div>
      </div>
    </div>
  );
}
