import React from "react";
import { Progress } from "./progress";
import { Loader } from "./loader";
import { useLoading } from "@/contexts/LoadingContext";
import { Button } from "./button";

// Map loading stages to user-friendly messages
const stageMessages: Record<string, string> = {
  initializing: "Inicializando aplicação...",
  auth: "Verificando autenticação...",
  config: "Carregando configurações...",
  user_data: "Carregando seus dados...",
  business_data: "Carregando dados do negócio...",
  complete: "Concluído!",
};

export function LoadingScreen() {
  const { stage, progress, error, resetLoading } = useLoading();
  
  const message = stageMessages[stage] || "Carregando...";

  // If there's an error, show an error screen
  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
        <div className="w-full max-w-md p-6 space-y-4 bg-card rounded-lg shadow-lg">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-12 w-12 text-destructive">
              {/* Error icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-center">Ops! Algo deu errado</h2>
          </div>
        
          <p className="text-center">{error.message}</p>
        
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={resetLoading}
              className="w-full"
            >
              Tentar novamente
            </Button>
          
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

  // Otherwise, show the loading screen
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="w-full max-w-md p-6 space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Loader size="lg" className="text-primary" />
          <h2 className="text-xl font-semibold text-center">{message}</h2>
        </div>
      
        <div className="w-full space-y-2">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-xs text-center text-muted-foreground">
            {progress.toFixed(0)}%
          </p>
        </div>
      
        <p className="text-sm text-muted-foreground text-center">
          Isso pode levar alguns instantes. Obrigado pela paciência.
        </p>
      </div>
    </div>
  );
}
