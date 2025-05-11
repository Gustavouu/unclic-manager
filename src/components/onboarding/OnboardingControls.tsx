import React from "react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LoadingButton } from "@/components/ui/loading-button";

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
    hasStaff,
    setStatus,
    setError,
    setProcessingStep,
    setBusinessCreated,
    onboardingMethod
  } = useOnboarding();
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
      setStatus("verifying");
      setProcessingStep("Verificando disponibilidade do nome...");
      
      try {
        const { data, error } = await supabase.functions.invoke('check-slug-availability', {
          body: { name: businessData.name },
        });
        
        setStatus("idle");
        
        if (error) {
          console.error("Error checking slug availability:", error);
          toast.error("Erro ao verificar disponibilidade do nome");
          return;
        }
        
        if (!data.isAvailable) {
          toast.error("O nome do estabelecimento já está em uso. Por favor, escolha outro nome.");
          return;
        }
      } catch (err) {
        console.error("Failed to check slug availability:", err);
        toast.error("Erro ao verificar disponibilidade do nome");
        setStatus("idle");
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
    
    // Update status to processing
    setStatus("processing");
    setError(null);
    setBusinessCreated(null);
    setProcessingStep("Iniciando criação do estabelecimento...");
    
    try {
      // Step 1: Check slug availability one more time
      setProcessingStep("Verificando disponibilidade do nome...");
      
      const { data: slugData, error: slugError } = await supabase.functions.invoke('check-slug-availability', {
        body: { name: businessData.name },
      });
      
      if (slugError || !slugData) {
        throw new Error(slugError?.message || "Erro ao verificar disponibilidade do nome");
      }
      
      if (!slugData.isAvailable) {
        throw new Error("O nome do estabelecimento já está em uso. Por favor, escolha outro nome.");
      }
      
      // Step 2: Create business
      setProcessingStep("Criando seu estabelecimento...");
      
      const businessResponse = await supabase.functions.invoke('create-business', {
        body: {
          businessData: {
            name: businessData.name,
            email: businessData.email,
            phone: businessData.phone,
            address: businessData.address,
            number: businessData.number,
            neighborhood: businessData.neighborhood,
            city: businessData.city,
            state: businessData.state,
            cep: businessData.cep
          },
          userId: user.id
        }
      });
      
      // Check if response data exists (timeout prevention)
      if (!businessResponse || !businessResponse.data) {
        throw new Error("O servidor está ocupado. Verificando se o estabelecimento foi criado...");
      }
      
      const { success, businessId, businessSlug, needsProfileSetup, error: businessError } = businessResponse.data;
      
      if (!success) {
        throw new Error(businessError || "Erro ao criar negócio");
      }
      
      // Store business info for next step
      setBusinessCreated({
        id: businessId,
        slug: businessSlug
      });
      
      // Step 3: Complete setup with services, staff and hours
      setProcessingStep("Configurando serviços e profissionais...");
      
      const setupResponse = await supabase.functions.invoke('complete-business-setup', {
        body: {
          userId: user.id,
          businessId: businessId,
          services: services,
          staffMembers: staffMembers,
          hasStaff: hasStaff,
          businessHours: businessHours
        }
      });
      
      if (!setupResponse || !setupResponse.data) {
        throw new Error("O servidor está ocupado ao finalizar a configuração, mas seu estabelecimento foi criado.");
      }
      
      const { success: setupSuccess, error: setupError } = setupResponse.data;
      
      if (!setupSuccess) {
        throw new Error(setupError || "Erro ao finalizar configuração, mas seu estabelecimento foi criado.");
      }
      
      // Success!
      setStatus("success");
      setProcessingStep("Configuração concluída com sucesso!");
      toast.success("Estabelecimento configurado com sucesso!");
      
      // Clear onboarding data
      localStorage.removeItem('unclic-manager-onboarding');
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
      
    } catch (error: any) {
      console.error("Erro ao configurar estabelecimento:", error);
      
      // Special handling for timeout errors
      if (error.message && (error.message.includes("ocupado") || error.message.includes("timeout"))) {
        setProcessingStep("Verificando se o estabelecimento foi criado...");
        
        // Try to verify if business was created despite timeout
        setTimeout(async () => {
          try {
            const { data: userData, error: userError } = await supabase
              .from('usuarios')
              .select('id_negocio')
              .eq('id', user.id)
              .maybeSingle();
            
            if (userError) throw userError;
            
            if (userData?.id_negocio) {
              // Business exists
              const { data: businessData, error: businessError } = await supabase
                .from('negocios')
                .select('id, slug')
                .eq('id', userData.id_negocio)
                .maybeSingle();
                
              if (businessError) throw businessError;
              
              if (businessData) {
                // Store the business info
                setBusinessCreated({
                  id: businessData.id,
                  slug: businessData.slug
                });
                
                // Check if profile exists
                const { data: accessProfile, error: profileError } = await supabase
                  .from('perfis_acesso')
                  .select('id')
                  .eq('id_usuario', user.id)
                  .eq('id_negocio', userData.id_negocio)
                  .maybeSingle();
                
                if (profileError) throw profileError;
                
                if (accessProfile) {
                  // Setup is already complete
                  setStatus("success");
                  setProcessingStep("Estabelecimento já configurado!");
                  toast.success("Configuração concluída com sucesso!");
                  
                  // Clear onboarding data
                  localStorage.removeItem('unclic-manager-onboarding');
                  
                  // Redirect to dashboard after a delay
                  setTimeout(() => {
                    navigate("/dashboard", { replace: true });
                  }, 2000);
                } else {
                  // Business exists but setup is incomplete
                  setError("Estabelecimento criado com sucesso, mas é necessário finalizar a configuração.");
                  setStatus("error");
                }
              }
            } else {
              // Business wasn't created
              setError("O estabelecimento não foi criado. Por favor, tente novamente.");
              setStatus("error");
            }
          } catch (verifyError) {
            console.error("Erro ao verificar criação do estabelecimento:", verifyError);
            setError("Não foi possível verificar se o estabelecimento foi criado. Por favor, tente novamente.");
            setStatus("error");
          }
        }, 2000);
      } else {
        // Regular error handling
        setError(error.message || "Erro ao configurar estabelecimento");
        setStatus("error");
      }
    }
  };
  
  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious} 
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        
        {currentStep === 4 ? (
          <LoadingButton 
            onClick={handleFinish}
            isLoading={false}
            loadingText="Finalizando..."
            icon={<Save className="mr-2 h-4 w-4" />}
            className="bg-primary hover:bg-primary/90"
          >
            Finalizar
          </LoadingButton>
        ) : (
          <LoadingButton
            onClick={handleNext}
            isLoading={false}
            loadingText="Verificando..."
            icon={<ArrowRight className="ml-2 h-4 w-4" />}
            className="bg-primary hover:bg-primary/90"
          >
            Avançar
          </LoadingButton>
        )}
      </div>
    </div>
  );
};
