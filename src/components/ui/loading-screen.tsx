
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

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
  // Map stage to friendly message if no custom message is provided
  const stageMessages: Record<string, string> = {
    'initializing': 'Inicializando aplicação...',
    'auth': 'Verificando autenticação...',
    'config': 'Carregando configurações...',
    'user_data': 'Carregando seus dados...',
    'business_data': 'Carregando dados do negócio...',
    'default': 'Carregando...'
  };

  const displayMessage = message || stageMessages[stage] || stageMessages.default;

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
      </div>
    </div>
  );
}
