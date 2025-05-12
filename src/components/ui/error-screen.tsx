import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ErrorScreenProps {
  error: {
    code?: string;
    message: string;
    details?: any;
  };
  onRetry?: () => void;
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Handle retry with loading state
  const handleRetry = () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    
    // Add a small delay to show the retrying state
    setTimeout(() => {
      onRetry();
      
      // If onRetry didn't navigate away, reset state after 2 seconds
      setTimeout(() => {
        setIsRetrying(false);
      }, 2000);
    }, 500);
  };
  
  // Handle emergency continue with cache reset
  const handleEmergencyContinue = () => {
    // Clear problematic localStorage items but keep login session
    const keysToKeep = ['supabase.auth.token'];
    const keysToRemove: string[] = [];
    
    // Identify keys to remove
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !keysToKeep.includes(key)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove the problematic keys
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Force page reload with clean slate
    window.location.href = "/dashboard?emergency=true";
  };
  
  // Clear all local storage and force restart
  const handleCompleteReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/?reset=" + Date.now();
  };

  // Map error codes to friendly messages
  const errorMessages: Record<string, string> = {
    'TIMEOUT_ERROR': 'O carregamento está demorando mais do que o esperado.',
    'CONNECTIVITY_ERROR': 'Não foi possível conectar ao servidor.',
    'AUTH_ERROR': 'Ocorreu um problema com a autenticação.',
    'DATABASE_ERROR': 'Não foi possível acessar o banco de dados.',
    'TENANT_CONTEXT_ERROR': 'Não foi possível definir o contexto do tenant.',
    'default': 'Ocorreu um erro inesperado.'
  };

  const displayMessage = errorMessages[error.code || ''] || error.message || errorMessages.default;

  // Allow emergency continue for non-critical errors
  const isNonCriticalError = error.code === 'TIMEOUT_ERROR' || error.code === 'TENANT_CONTEXT_ERROR';

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="w-full max-w-md p-6 space-y-4 bg-card rounded-lg shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold text-center">Ops! Algo deu errado</h2>
        </div>
      
        <p className="text-center">{displayMessage}</p>
      
        <div className="flex flex-col space-y-2">
          {onRetry && (
            <Button 
              onClick={handleRetry}
              className="w-full"
              disabled={isRetrying}
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Tentando novamente...
                </>
              ) : (
                "Tentar novamente"
              )}
            </Button>
          )}

          <Button 
            variant="outline"
            onClick={handleEmergencyContinue}
            className="w-full"
          >
            Continuar em modo emergência
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleCompleteReset}
            className="w-full text-destructive border-destructive hover:bg-destructive/10"
          >
            Reiniciar aplicação
          </Button>
        
          <a 
            href="mailto:suporte@unclic.com"
            className="w-full py-2 text-center text-primary"
          >
            Contatar suporte
          </a>
        </div>
      
        <div className="mt-4">
          <Button 
            variant="link" 
            size="sm" 
            className="w-full"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Ocultar detalhes técnicos' : 'Mostrar detalhes técnicos'}
          </Button>
          
          {showDetails && error.details && (
            <pre className="mt-2 p-2 bg-muted rounded overflow-auto text-xs">
              {JSON.stringify(error.details, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
