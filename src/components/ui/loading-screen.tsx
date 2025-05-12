
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
      setLoadingTime(prev => prev + 1);
      if (loadingTime >= 15 && !showHelp) {
        setShowHelp(true);
      }
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
  
  const handleEmergencyContinue = () => {
    // Store error flag in localStorage
    localStorage.setItem('app_init_errors', 'true');
    
    // Force navigate to dashboard
    window.location.href = "/dashboard";
  };
  
  const handleResetAndReload = () => {
    // Clear localStorage
    localStorage.clear();
    
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
