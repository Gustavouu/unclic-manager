
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorScreenProps {
  error: {
    code?: string;
    message: string;
    details?: any;
  };
  onRetry?: () => void;
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  // Map error codes to friendly messages
  const errorMessages: Record<string, string> = {
    'TIMEOUT_ERROR': 'O carregamento está demorando mais do que o esperado.',
    'CONNECTIVITY_ERROR': 'Não foi possível conectar ao servidor.',
    'AUTH_ERROR': 'Ocorreu um problema com a autenticação.',
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
              onClick={onRetry}
              className="w-full"
            >
              Tentar novamente
            </Button>
          )}
        
          <a 
            href="mailto:suporte@unclic.com"
            className="w-full py-2 text-center text-primary"
          >
            Contatar suporte
          </a>
        </div>
      
        {error.details && (
          <details className="text-xs text-muted-foreground">
            <summary>Detalhes técnicos</summary>
            <pre className="mt-2 p-2 bg-muted rounded overflow-auto">
              {JSON.stringify(error.details, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
