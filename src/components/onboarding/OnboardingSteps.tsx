
import React from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Building, Scissors, Users, Clock, CheckSquare } from "lucide-react";

export const OnboardingSteps: React.FC = () => {
  const { currentStep } = useOnboarding();
  
  const steps = [
    {
      id: 0,
      name: "Estabelecimento",
      icon: <Building className="h-5 w-5" />
    },
    {
      id: 1,
      name: "Serviços",
      icon: <Scissors className="h-5 w-5" />
    },
    {
      id: 2,
      name: "Profissionais",
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 3,
      name: "Horários",
      icon: <Clock className="h-5 w-5" />
    },
    {
      id: 4,
      name: "Finalizar",
      icon: <CheckSquare className="h-5 w-5" />
    }
  ];
  
  return (
    <div className="flex justify-center">
      <div className="hidden sm:flex w-full max-w-3xl items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= index ? "bg-primary text-white" : "bg-muted"
                }`}
              >
                {step.icon}
              </div>
              <span 
                className={`mt-2 text-xs ${
                  currentStep >= index ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {step.name}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`h-0.5 flex-1 mx-2 ${
                  currentStep > index ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div className="sm:hidden">
        <div className="flex items-center justify-center">
          <span className="text-sm font-medium">
            Passo {currentStep + 1} de {steps.length}
          </span>
        </div>
        <div className="w-full h-2 bg-muted mt-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
