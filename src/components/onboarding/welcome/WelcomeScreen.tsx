
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OnboardingOption } from "./OnboardingOption";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Import, FileUp, Edit } from "lucide-react";

export const WelcomeScreen: React.FC = () => {
  const { setCurrentStep, setOnboardingMethod } = useOnboarding();
  
  const handleOptionSelect = (method: "import" | "upload" | "manual") => {
    setOnboardingMethod(method);
    setCurrentStep(0);
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Bem-vindo ao Unclic Manager!</CardTitle>
        <CardDescription className="text-lg mt-2">
          Vamos configurar seu estabelecimento em poucos minutos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <OnboardingOption
            icon={<Import size={40} />}
            title="Já uso outro sistema"
            description="Importe dados automaticamente do Trinks, Booksy, Meethub e outros"
            onClick={() => handleOptionSelect("import")}
            comingSoon={true}
          />
          
          <OnboardingOption
            icon={<FileUp size={40} />}
            title="Tenho minhas informações em arquivo"
            description="Faça upload de planilhas, PDFs ou imagens com seus dados"
            onClick={() => handleOptionSelect("upload")}
            comingSoon={true}
          />
          
          <OnboardingOption
            icon={<Edit size={40} />}
            title="Quero começar do zero"
            description="Configure manualmente com a ajuda de nossos modelos"
            onClick={() => handleOptionSelect("manual")}
            recommended={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};
