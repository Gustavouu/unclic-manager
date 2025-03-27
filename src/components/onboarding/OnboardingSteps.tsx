
import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";

export const OnboardingSteps: React.FC = () => {
  const { currentStep, setCurrentStep } = useOnboarding();
  
  const steps = [
    { name: "Informações do Negócio", description: "Dados básicos do estabelecimento" },
    { name: "Serviços", description: "Adicionar os serviços oferecidos" },
    { name: "Profissionais", description: "Equipe de profissionais" },
    { name: "Horários", description: "Horários de funcionamento" },
    { name: "Revisão", description: "Resumo das configurações" }
  ];

  // Function to handle step click
  const handleStepClick = (stepIndex: number) => {
    // Only allow clicking on completed steps or the current step + 1
    if (stepIndex <= currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Configuração Inicial</h2>
          <p className="text-muted-foreground">Complete as etapas abaixo para configurar seu estabelecimento</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;
          const isClickable = index <= currentStep + 1;
          
          return (
            <div 
              key={index} 
              className="flex items-center"
            >
              <div 
                onClick={() => handleStepClick(index)}
                className={`
                  flex-1 min-w-[150px] rounded-md border p-3
                  ${isActive ? 'bg-primary/10 border-primary' : ''}
                  ${isCompleted ? 'bg-primary/5 border-primary/50' : ''}
                  ${isClickable ? 'cursor-pointer hover:bg-primary/5' : ''}
                `}
              >
                <div className="flex items-center gap-2">
                  <div className={`
                    flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                    ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                    ${isCompleted ? 'bg-primary text-primary-foreground' : ''}
                  `}>
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{step.name}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center self-center">
                  <div className="h-[2px] w-4 bg-muted"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
