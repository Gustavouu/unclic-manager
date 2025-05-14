
import React from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const OnboardingProcessStatus = () => {
  const { 
    status, 
    error, 
    processingStep, 
    resetOnboarding,
    businessCreated
  } = useOnboarding();
  const navigate = useNavigate();
  
  // Renderização baseada no status
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-medium text-center mb-2">Configuração concluída com sucesso!</h2>
        <p className="text-gray-500 text-center mb-6">
          Seu estabelecimento foi configurado com sucesso. Você será redirecionado para o dashboard em instantes.
        </p>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard", { replace: true })}
          >
            Ir para o Dashboard
          </Button>
        </div>
        {businessCreated && businessCreated.id && (
          <div className="mt-6 text-sm text-gray-500">
            ID do seu negócio: {businessCreated.id}
          </div>
        )}
      </div>
    );
  }
  
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-medium text-center mb-2">Erro ao configurar estabelecimento</h2>
        <p className="text-gray-500 text-center mb-2">
          Ocorreu um erro durante o processo de configuração:
        </p>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 max-w-md w-full">
          <p className="text-red-800">{error || "Erro desconhecido"}</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <Button 
            variant="destructive" 
            onClick={resetOnboarding}
          >
            Recomeçar
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Ir para o Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  // Verificação ou processamento
  const isVerifying = status === "verifying";
  const isProcessing = status === "processing";
  
  let title = isVerifying 
    ? "Verificando disponibilidade..." 
    : "Configurando seu estabelecimento...";
    
  let description = isVerifying
    ? "Estamos verificando se as informações do seu estabelecimento estão disponíveis."
    : "Por favor, aguarde enquanto configuramos seu estabelecimento. Isso pode levar alguns instantes.";
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      {isVerifying || isProcessing ? (
        <div className="mb-4">
          <ProgressCircle size="large" />
        </div>
      ) : (
        <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
      )}
      
      <h2 className="text-2xl font-medium text-center mb-2">{title}</h2>
      <p className="text-gray-500 text-center mb-6">
        {description}
      </p>
      
      {processingStep && (
        <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6 max-w-md w-full">
          <p className="text-blue-800">{processingStep}</p>
        </div>
      )}
      
      {!isVerifying && (
        <Button 
          variant="outline" 
          onClick={resetOnboarding}
        >
          Cancelar
        </Button>
      )}
    </div>
  );
};
