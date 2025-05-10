
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const OnboardingControls: React.FC = () => {
  const { 
    currentStep, 
    setCurrentStep, 
    isComplete, 
    saveProgress,
    businessData,
    services,
    staffMembers,
    businessHours,
    hasStaff
  } = useOnboarding();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  
  // Function to check if a slug is available before proceeding
  const checkSlugAvailability = async (name: string): Promise<boolean> => {
    setIsCheckingSlug(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('check-slug-availability', {
        body: { name },
      });
      
      setIsCheckingSlug(false);
      
      if (error) {
        console.error("Error checking slug availability:", error);
        return true; // Proceed anyway if there's an error checking
      }
      
      return data.isAvailable;
    } catch (err) {
      console.error("Failed to check slug availability:", err);
      setIsCheckingSlug(false);
      return true; // Proceed anyway if there's an error
    }
  };
  
  const handleNext = async () => {
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
      
      // Check slug availability before proceeding
      const isAvailable = await checkSlugAvailability(businessData.name);
      if (!isAvailable) {
        toast.error("O nome do estabelecimento já está em uso. Por favor, escolha outro nome.");
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
  
  const createBusinessSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };
  
  const handleFinish = async () => {
    if (!isComplete()) {
      toast.error("Preencha todas as informações obrigatórias antes de finalizar");
      return;
    }
    
    if (!user) {
      toast.error("Você precisa estar autenticado para criar um negócio");
      navigate("/login");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Verificar disponibilidade do slug antes de criar o negócio
      const isAvailable = await checkSlugAvailability(businessData.name);
      if (!isAvailable) {
        toast.error("O nome do estabelecimento já está em uso. Por favor, escolha outro nome.");
        setIsSaving(false);
        return;
      }
      
      // Mostrar toast de progresso
      const loadingToast = toast.loading("Criando seu negócio...");
      
      // Gerar slug do negócio
      const slug = createBusinessSlug(businessData.name);
      
      // Preparar os dados para enviar ao edge function
      const businessPayload = {
        businessData: {
          name: businessData.name,
          email: businessData.email,
          phone: businessData.phone,
          address: businessData.address,
          number: businessData.number,
          neighborhood: businessData.neighborhood,
          city: businessData.city,
          state: businessData.state,
          cep: businessData.cep,
          slug: slug,
          services: services,
          staffMembers: staffMembers,
          hasStaff: hasStaff
        },
        userId: user.id
      };
      
      // Chamar o edge function que usará a service role para criar o negócio
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-business`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify(businessPayload)
        }
      );
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        toast.dismiss(loadingToast);
        
        // Handle specific errors
        if (result.error && result.error.includes("já está em uso")) {
          throw new Error("O nome do estabelecimento já está em uso. Por favor, escolha outro nome.");
        } else {
          throw new Error(result.error || "Erro ao criar negócio");
        }
      }
      
      const businessId = result.businessId;
      const finalSlug = result.businessSlug || slug;
      console.log("Negócio criado com sucesso via edge function. ID:", businessId, "Slug:", finalSlug);
      
      toast.dismiss(loadingToast);
      toast.success("Estabelecimento configurado com sucesso!", {
        duration: 5000
      });
      
      // Limpar dados salvos no localStorage após configuração bem-sucedida
      localStorage.removeItem('unclic-manager-onboarding');
      
      // Redirecionar para o dashboard após um breve delay para que o toast seja visível
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
      
    } catch (error: any) {
      console.error("Erro ao finalizar configuração:", error);
      toast.error(error.message || "Erro ao finalizar configuração");
      setIsSaving(false);
    }
  };
  
  return (
    <div className="flex justify-between mt-8">
      <Button 
        variant="outline" 
        onClick={handlePrevious} 
        disabled={currentStep === 0 || isSaving || isCheckingSlug}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>
      
      <Button
        onClick={currentStep === 4 ? handleFinish : handleNext}
        variant={currentStep === 4 ? "default" : "default"}
        disabled={isSaving || isCheckingSlug}
      >
        {currentStep === 4 ? (
          <>
            {isSaving ? (
              "Salvando..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Finalizar
              </>
            )}
          </>
        ) : (
          <>
            {isCheckingSlug ? "Verificando..." : "Avançar"} 
            {!isCheckingSlug && <ArrowRight className="ml-2 h-4 w-4" />}
          </>
        )}
      </Button>
    </div>
  );
};
