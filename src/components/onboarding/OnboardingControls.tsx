
import React from "react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const OnboardingControls: React.FC = () => {
  const { 
    currentStep, 
    setCurrentStep, 
    isComplete, 
    saveProgress,
    businessData
  } = useOnboarding();
  const navigate = useNavigate();
  
  const handleNext = () => {
    // Validar dados do estabelecimento antes de avançar
    if (currentStep === 0) {
      if (!businessData.name || !businessData.email || !businessData.phone) {
        toast.error("Preencha os campos obrigatórios para continuar");
        return;
      }
      if (!businessData.cep || !businessData.address || !businessData.number) {
        toast.error("Preencha o endereço completo para continuar");
        return;
      }
    }
    
    // Avançar para próximo passo
    if (currentStep < 4) {
      // Salva progresso antes de avançar
      saveProgress();
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      // Salva progresso antes de voltar
      saveProgress();
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleFinish = () => {
    if (isComplete()) {
      // Salva progresso final
      saveProgress();
      
      // Simulação de envio dos dados
      toast.promise(
        new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 1500);
        }),
        {
          loading: "Finalizando configuração do estabelecimento...",
          success: () => {
            navigate("/dashboard");
            return "Estabelecimento configurado com sucesso!";
          },
          error: "Erro ao finalizar configuração"
        }
      );
    } else {
      toast.error("Preencha todas as informações obrigatórias antes de finalizar");
    }
  };
  
  return (
    <div className="flex justify-between mt-8">
      <Button 
        variant="outline" 
        onClick={handlePrevious} 
        disabled={currentStep === 0}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>
      
      <Button
        onClick={currentStep === 4 ? handleFinish : handleNext}
        variant={currentStep === 4 ? "default" : "default"}
      >
        {currentStep === 4 ? (
          <>
            <Save className="mr-2 h-4 w-4" /> Finalizar
          </>
        ) : (
          <>
            Avançar <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};
