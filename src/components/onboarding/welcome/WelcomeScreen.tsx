
import React from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Button } from "@/components/ui/button";
import { FileText, Upload, PenSquare } from "lucide-react";

interface WelcomeScreenProps {
  isEditMode?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ isEditMode = false }) => {
  const { setOnboardingMethod, setCurrentStep } = useOnboarding();
  
  const handleSelectMethod = (method: "manual" | "import" | "upload") => {
    setOnboardingMethod(method);
    setCurrentStep(0);
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">
          {isEditMode ? "Editar Configurações do Negócio" : "Bem-vindo ao Unclic!"}
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {isEditMode 
            ? "Você pode editar as informações do seu negócio já cadastrado. Escolha como deseja prosseguir." 
            : "Vamos começar configurando seu negócio para que você possa gerenciar agendamentos, clientes e muito mais. Escolha como deseja começar:"}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => handleSelectMethod("manual")}
          className="bg-card border rounded-lg p-6 hover:border-primary hover:bg-accent transition-colors text-left flex flex-col h-full"
        >
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <PenSquare className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">
            {isEditMode ? "Editar Manualmente" : "Preencher Manualmente"}
          </h3>
          <p className="text-muted-foreground text-sm flex-grow">
            {isEditMode 
              ? "Revise e atualize cada seção de configuração do seu negócio." 
              : "Preencha todas as informações do seu negócio passo a passo."}
          </p>
        </button>
        
        <button
          onClick={() => handleSelectMethod("import")}
          className="bg-card border rounded-lg p-6 hover:border-primary hover:bg-accent transition-colors text-left flex flex-col h-full opacity-50 cursor-not-allowed"
          disabled
        >
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">Importar Dados</h3>
          <p className="text-muted-foreground text-sm flex-grow">
            {isEditMode 
              ? "Importe dados para atualizar suas configurações de outra plataforma." 
              : "Importe as informações do seu negócio de outro sistema ou planilha."}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Em breve</p>
        </button>
        
        <button
          onClick={() => handleSelectMethod("upload")}
          className="bg-card border rounded-lg p-6 hover:border-primary hover:bg-accent transition-colors text-left flex flex-col h-full opacity-50 cursor-not-allowed"
          disabled
        >
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">Carregar Arquivo</h3>
          <p className="text-muted-foreground text-sm flex-grow">
            {isEditMode 
              ? "Atualize suas configurações usando um arquivo de dados estruturado." 
              : "Carregue um arquivo CSV ou Excel com suas informações."}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Em breve</p>
        </button>
      </div>
    </div>
  );
};
