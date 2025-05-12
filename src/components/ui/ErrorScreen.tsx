
import React from "react";
import { Button } from "./button";
import { LoadingError } from "@/contexts/LoadingContext";

interface ErrorScreenProps {
  error: LoadingError;
  onRetry?: () => void;
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  // Map error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    'TIMEOUT_ERROR': 'O carregamento está demorando mais do que o esperado.',
    'CONNECTIVITY_ERROR': 'Não foi possível conectar ao servidor.',
    'AUTH_ERROR': 'Ocorreu um problema com a autenticação.',
    'default': 'Ocorreu um erro inesperado.'
  };

  const message = error.code ? errorMessages[error.code] || errorMessages.default : error.message;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="w-full max-w-md p-6 space-y-4 bg-card rounded-lg shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-12 w-12 text-destructive">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-center">Ops! Algo deu errado</h2>
        </div>
      
        <p className="text-center">{message}</p>
      
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
