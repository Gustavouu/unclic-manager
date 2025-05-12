
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";

interface OnboardingHeaderProps {
  isEditMode?: boolean;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ isEditMode = false }) => {
  const { currentStep } = useOnboarding();
  
  // Title and description based on current step
  const getHeaderContent = () => {
    if (currentStep === 0) {
      return {
        title: isEditMode ? "Informações do Negócio" : "Cadastre seu Negócio",
        description: isEditMode 
          ? "Edite as informações básicas do seu estabelecimento" 
          : "Preencha as informações básicas do seu estabelecimento"
      };
    } else if (currentStep === 1) {
      return {
        title: isEditMode ? "Gerenciar Serviços" : "Cadastre seus Serviços",
        description: isEditMode
          ? "Edite ou adicione os serviços oferecidos pelo seu estabelecimento"
          : "Adicione os serviços oferecidos pelo seu estabelecimento"
      };
    } else if (currentStep === 2) {
      return {
        title: isEditMode ? "Gerenciar Profissionais" : "Cadastre seus Profissionais",
        description: isEditMode
          ? "Edite ou adicione os profissionais que trabalham no seu estabelecimento"
          : "Adicione os profissionais que trabalham no seu estabelecimento"
      };
    } else if (currentStep === 3) {
      return {
        title: isEditMode ? "Horários de Funcionamento" : "Configure os Horários",
        description: isEditMode
          ? "Edite os horários de funcionamento do seu estabelecimento"
          : "Configure os horários de funcionamento do seu estabelecimento"
      };
    } else if (currentStep === 4) {
      return {
        title: isEditMode ? "Revisar Alterações" : "Revisar e Finalizar",
        description: isEditMode
          ? "Verifique as alterações antes de salvar"
          : "Verifique todas as informações antes de finalizar o cadastro"
      };
    }
    
    return {
      title: isEditMode ? "Configuração do Negócio" : "Configuração Inicial",
      description: isEditMode 
        ? "Edite as informações do seu negócio"
        : "Configure seu negócio para começar a usar o Unclic"
    };
  };
  
  const { title, description } = getHeaderContent();
  
  return (
    <CardHeader className="pb-0">
      <CardTitle className="text-2xl font-bold text-center">
        {title}
      </CardTitle>
      <CardDescription className="text-center text-base">
        {description}
      </CardDescription>
    </CardHeader>
  );
};
