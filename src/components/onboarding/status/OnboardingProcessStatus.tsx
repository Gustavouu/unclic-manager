
import React from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const OnboardingProcessStatus: React.FC = () => {
  const { 
    status, 
    processingStep, 
    error, 
    resetOnboarding,
    businessCreated,
    setStatus,
    setCurrentStep,
    setError,
    setProcessingStep
  } = useOnboarding();
  const navigate = useNavigate();
  
  // Function to handle finishing setup after business creation
  const handleCompleteSetup = async () => {
    if (!businessCreated?.id) return;
    
    setStatus("processing");
    setError(null);
    setProcessingStep("Finalizando configuração do estabelecimento...");
    
    // Further implementation will be added in the Edge Functions part
  };
  
  // Function to retry the onboarding process
  const handleRetry = () => {
    setError(null);
    setStatus("idle");
    setCurrentStep(4); // Back to summary
  };
  
  // Function to go to dashboard
  const handleGoToDashboard = () => {
    localStorage.removeItem('unclic-manager-onboarding');
    navigate("/dashboard", { replace: true });
  };

  const getStatusMessage = () => {
    switch (status) {
      case "saving":
        return "Salvando dados...";
      case "processing":
        return processingStep || "Processando...";
      case "verifying":
        return "Verificando status...";
      case "error":
        return "Ocorreu um erro";
      case "success":
        return "Configuração concluída com sucesso!";
      default:
        return "Processando...";
    }
  };

  return (
    <div className="space-y-8 py-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Configurando seu Estabelecimento</h2>
        <p className="text-muted-foreground mb-8">
          Estamos configurando seu estabelecimento. Isso pode levar alguns instantes.
        </p>
        
        {/* Status indicator */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{getStatusMessage()}</span>
            <span className="text-sm font-medium">
              {status === "error" ? "Erro" : status === "success" ? "100%" : "..."}
            </span>
          </div>
          
          <Progress 
            value={status === "error" ? 100 : status === "success" ? 100 : undefined} 
            className={`h-2 ${status === "error" ? "bg-red-200" : ""}`}
          />
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 max-w-lg mx-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-red-500">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Success message */}
      {status === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 max-w-lg mx-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-green-500">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Seu estabelecimento foi configurado com sucesso!</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {status === "error" && (
          <>
            <Button 
              variant="outline" 
              onClick={handleRetry}
              className="min-w-[150px]"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
            
            {businessCreated?.id && (
              <Button
                onClick={handleCompleteSetup}
                className="min-w-[150px]"
              >
                Finalizar configuração
              </Button>
            )}
          </>
        )}
        
        {status === "success" && (
          <Button 
            onClick={handleGoToDashboard}
            className="min-w-[150px]"
          >
            Ir para o Dashboard
          </Button>
        )}
        
        {(status === "processing" || status === "verifying" || status === "saving") && (
          <div className="h-10 flex items-center justify-center">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
};
