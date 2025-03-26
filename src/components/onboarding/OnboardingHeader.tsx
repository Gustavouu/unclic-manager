
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useOnboarding } from "@/contexts/OnboardingContext";

export const OnboardingHeader = () => {
  const { currentStep } = useOnboarding();
  
  const getTitleAndDescription = () => {
    switch (currentStep) {
      case 0:
        return {
          title: "Dados do Estabelecimento",
          description: "Preencha as informações básicas do seu negócio"
        };
      case 1:
        return {
          title: "Serviços e Preços",
          description: "Cadastre os serviços oferecidos pelo seu estabelecimento"
        };
      case 2:
        return {
          title: "Profissionais",
          description: "Adicione os profissionais que trabalham no seu estabelecimento"
        };
      case 3:
        return {
          title: "Horários de Funcionamento",
          description: "Configure os dias e horários de funcionamento"
        };
      case 4:
        return {
          title: "Revisão Final",
          description: "Verifique as informações antes de finalizar"
        };
      default:
        return {
          title: "Configuração Inicial",
          description: "Configure seu estabelecimento"
        };
    }
  };
  
  const { title, description } = getTitleAndDescription();
  
  return (
    <CardHeader className="pb-4">
      <CardTitle className="text-2xl font-bold text-center mb-1">{title}</CardTitle>
      <CardDescription className="text-center text-base">{description}</CardDescription>
    </CardHeader>
  );
};
