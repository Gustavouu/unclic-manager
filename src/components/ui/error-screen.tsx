
import { AlertTriangle, RefreshCw, Settings, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { clearAllCaches } from "@/utils/cacheUtils";

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
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<Record<string, any>>({});

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
    // Set flags to bypass error handling
    localStorage.setItem('app_emergency_continue', 'true');
    localStorage.setItem('app_init_errors', 'true');
    
    // Clear problematic caches
    clearAllCaches();
    
    // Force page reload with clean slate
    window.location.href = "/dashboard?emergency=true";
  };
  
  // Clear all local storage and force restart
  const handleCompleteReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/?reset=" + Date.now();
  };
  
  // Run diagnostics tests
  const runDiagnostics = async () => {
    setShowDiagnostics(true);
    const results: Record<string, any> = {};
    
    // Test localStorage
    try {
      const testKey = 'test_' + Date.now();
      localStorage.setItem(testKey, 'test');
      const testValue = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      results.localStorage = {
        status: testValue === 'test' ? 'ok' : 'failed',
        message: testValue === 'test' ? 'LocalStorage funcionando' : 'LocalStorage com problemas'
      };
    } catch (e) {
      results.localStorage = { status: 'failed', message: 'LocalStorage indisponível', error: e };
    }
    
    // Test network connectivity
    try {
      const start = Date.now();
      const response = await fetch('https://jcdymkgmtxpryceziazt.supabase.co', { 
        method: 'HEAD',
        cache: 'no-store'
      });
      const timeMs = Date.now() - start;
      results.network = {
        status: response.ok ? 'ok' : 'failed',
        message: response.ok ? `Conectividade ok (${timeMs}ms)` : 'Falha na conexão',
        time: timeMs
      };
    } catch (e) {
      results.network = { status: 'failed', message: 'Sem conexão com internet', error: e };
    }
    
    // Cache stats
    try {
      let cacheCount = 0;
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          totalSize += value.length;
          if (key.includes('cache') || key.includes('timestamp') || 
              key.includes('tenant') || key.includes('business')) {
            cacheCount++;
          }
        }
      }
      results.cache = {
        status: 'info',
        message: `${cacheCount} itens em cache`,
        totalItems: localStorage.length,
        cacheItems: cacheCount,
        sizeKb: Math.round(totalSize / 1024)
      };
    } catch (e) {
      results.cache = { status: 'error', message: 'Erro ao analisar cache', error: e };
    }
    
    setDiagnosticResults(results);
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
        
        <div className="border-t pt-4 mt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-between"
            onClick={() => setShowDetails(!showDetails)}
          >
            <span>{showDetails ? 'Ocultar detalhes técnicos' : 'Mostrar detalhes técnicos'}</span>
          </Button>
          
          {showDetails && error.details && (
            <pre className="mt-2 p-2 bg-muted rounded overflow-auto text-xs">
              {JSON.stringify(error.details, null, 2)}
            </pre>
          )}
          
          {showDetails && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2"
              onClick={runDiagnostics}
            >
              <Settings className="h-4 w-4 mr-2" />
              Executar Diagnóstico
            </Button>
          )}
          
          {showDiagnostics && (
            <div className="mt-2 p-2 bg-muted rounded text-xs">
              <h4 className="font-semibold mb-2">Resultado do diagnóstico:</h4>
              {Object.entries(diagnosticResults).map(([key, result]) => (
                <div key={key} className="mb-1 flex items-center">
                  <span className={`mr-2 inline-block w-3 h-3 rounded-full ${
                    result.status === 'ok' ? 'bg-green-500' : 
                    result.status === 'failed' ? 'bg-red-500' : 
                    'bg-amber-500'
                  }`}></span>
                  <span className="font-medium">{key}:</span> {result.message}
                </div>
              ))}
              
              {Object.keys(diagnosticResults).length > 0 && (
                <Button
                  variant="ghost" 
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => clearAllCaches()}
                >
                  <Database className="h-3 w-3 mr-1" />
                  Limpar todos os caches
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
