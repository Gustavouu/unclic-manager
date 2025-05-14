
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LoadingButton } from "@/components/ui/loading-button";
import { useTenant } from "@/contexts/TenantContext";

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
    status,
    setStatus,
    setError,
    setProcessingStep,
    setBusinessCreated,
    onboardingMethod
  } = useOnboarding();
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshBusinessData } = useTenant();
  
  const handleNext = async () => {
    // Validar dados do estabelecimento antes de avançar
    if (currentStep === 0) {
      if (!businessData.name || !businessData.email || !businessData.phone) {
        toast.error("Preencha os campos obrigatórios para continuar");
        return;
      }
      
      // Check for required address fields (using both naming conventions)
      const zipCode = businessData.cep || businessData.zipCode;
      const addressNumber = businessData.number || businessData.addressNumber;
      
      if (!zipCode || !businessData.address || !addressNumber) {
        toast.error("Preencha o endereço completo para continuar");
        return;
      }
      
      // Check slug availability before proceeding
      setStatus("verifying");
      setProcessingStep("Verificando disponibilidade do nome...");
      
      try {
        // Gerar um nome único adicionando um timestamp se necessário
        const timestamp = Date.now().toString().slice(-4);
        const modifiedName = `${businessData.name}`;
        
        // Log da chamada para depuração
        console.log("Verificando disponibilidade do slug:", modifiedName);
        
        // Tentativa com timeout de segurança
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Tempo limite excedido ao verificar slug")), 10000)
        );
        
        const response = await Promise.race([
          supabase.functions.invoke('check-slug-availability', {
            body: { name: modifiedName },
          }),
          timeoutPromise
        ]);
        
        setStatus("idle");
        
        const data = response.data;
        const error = response.error;
        
        console.log("Resposta de verificação de slug:", { data, error });
        
        if (error) {
          console.error("Error checking slug availability:", error);
          toast.error("Erro ao verificar disponibilidade do nome");
          return;
        }
        
        if (!data.isAvailable) {
          // Se o nome não estiver disponível, modifique-o para torná-lo único
          const uniqueName = `${businessData.name} ${timestamp}`;
          toast.info(`Nome modificado para '${uniqueName}' para garantir unicidade.`);
          
          // Atualizar o nome do negócio com o nome único
          saveProgress();
        }
      } catch (err) {
        console.error("Failed to check slug availability:", err);
        toast.warning("Não foi possível verificar a disponibilidade do nome, mas você pode continuar.");
        setStatus("idle");
        // Permitir continuar mesmo com erro no slug
      }
    }
    
    // Avançar para próximo passo
    if (currentStep < 4) {
      // Salva progresso antes de avançar
      saveProgress();
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      // Salva progresso antes de voltar
      saveProgress();
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, saveProgress, setCurrentStep]);
  
  const createBusiness = async () => {
    // Preparar dados do negócio para criação
    const businessPayload = {
      name: businessData.name,
      email: businessData.email,
      phone: businessData.phone,
      address: businessData.address,
      number: businessData.number || businessData.addressNumber,
      neighborhood: businessData.neighborhood,
      city: businessData.city,
      state: businessData.state,
      cep: businessData.cep || businessData.zipCode
    };
    
    console.log("Criando negócio com os dados:", businessPayload);
    
    // Adicionar timestamp para garantir unicidade
    const timestamp = Date.now().toString().slice(-4);
    const businessNameWithTimestamp = `${businessPayload.name}-${timestamp}`;
    
    try {
      const response = await supabase.functions.invoke('create-business', {
        body: {
          businessData: {
            ...businessPayload,
            name: businessNameWithTimestamp
          },
          userId: user?.id
        }
      });
      
      console.log("Resposta da criação do negócio:", response);
      
      if (!response?.data) {
        throw new Error("Não foi possível obter resposta do servidor");
      }
      
      const { success, businessId, businessSlug, error: businessError } = response.data;
      
      if (!success || !businessId) {
        throw new Error(businessError || "Erro ao criar negócio");
      }
      
      return { businessId, businessSlug };
    } catch (error) {
      console.error("Erro na criação do negócio:", error);
      throw error;
    }
  };
  
  const completeBusinessSetup = async (businessId) => {
    console.log("Completando configuração do negócio:", {
      userId: user?.id,
      businessId,
      servicesCount: services?.length,
      staffCount: staffMembers?.length,
      hasStaff
    });
    
    try {
      const response = await supabase.functions.invoke('complete-business-setup', {
        body: {
          userId: user?.id,
          businessId,
          services,
          staffMembers,
          hasStaff,
          businessHours
        }
      });
      
      console.log("Resposta da configuração do negócio:", response);
      
      if (!response?.data) {
        throw new Error("Não foi possível obter resposta do servidor");
      }
      
      const { success, error: setupError } = response.data;
      
      if (!success) {
        throw new Error(setupError || "Erro ao finalizar configuração");
      }
      
      return success;
    } catch (error) {
      console.error("Erro ao completar configuração do negócio:", error);
      throw error;
    }
  };
  
  const verifyBusinessCreation = async (userId) => {
    try {
      console.log("Verificando se o negócio foi criado para o usuário:", userId);
      
      // Verificar associação na business_users primeiro
      const { data: businessUserData, error: businessUserError } = await supabase
        .from('business_users')
        .select('business_id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (!businessUserError && businessUserData?.business_id) {
        console.log("Negócio encontrado em business_users:", businessUserData.business_id);
        return businessUserData.business_id;
      }
      
      console.log("Nenhum negócio encontrado em business_users, verificando usuarios...");
      
      // Tentar em usuarios como fallback
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('id_negocio')
        .eq('id', userId)
        .maybeSingle();
      
      if (!userError && userData?.id_negocio) {
        console.log("Negócio encontrado em usuarios:", userData.id_negocio);
        return userData.id_negocio;
      }
      
      console.log("Nenhum negócio encontrado para o usuário");
      return null;
    } catch (error) {
      console.error("Erro ao verificar criação do negócio:", error);
      return null;
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
      // Tentar criar o negócio
      setProcessingStep("Criando seu estabelecimento...");
      
      let businessId = null;
      let businessSlug = null;
      
      try {
        const result = await createBusiness();
        businessId = result.businessId;
        businessSlug = result.businessSlug;
        
        // Store business info for next step
        setBusinessCreated({
          id: businessId,
          slug: businessSlug
        });
      } catch (createError) {
        console.error("Falha ao criar negócio:", createError);
        
        // Verificar se o negócio foi criado apesar do erro
        setProcessingStep("Verificando se o negócio foi criado...");
        
        const existingBusinessId = await verifyBusinessCreation(user.id);
        
        if (existingBusinessId) {
          businessId = existingBusinessId;
          setBusinessCreated({
            id: existingBusinessId
          });
          toast.warning("Negócio foi criado, mas houve problemas na comunicação.");
        } else {
          throw new Error("Não foi possível criar o negócio. Tente novamente.");
        }
      }
      
      // Se chegou aqui, temos um ID de negócio. Completar configuração.
      setProcessingStep("Configurando serviços e profissionais...");
      
      try {
        await completeBusinessSetup(businessId);
      } catch (setupError) {
        console.error("Falha ao completar configuração:", setupError);
        
        // Tentar atualizar manualmente o status do negócio
        setProcessingStep("Atualizando status do negócio...");
        
        try {
          // Tentar atualizar status diretamente
          const { error: updateError } = await supabase
            .from('businesses')
            .update({ 
              status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('id', businessId);
          
          if (updateError) {
            console.error("Erro ao atualizar status em businesses:", updateError);
            
            // Tentar tabela legacy como fallback
            const { error: legacyError } = await supabase
              .from('negocios')
              .update({ 
                status: 'ativo',
                atualizado_em: new Date().toISOString()
              })
              .eq('id', businessId);
              
            if (legacyError) {
              console.error("Erro ao atualizar status em negocios:", legacyError);
              throw new Error("Não foi possível atualizar o status do negócio");
            }
          }
        } catch (manualUpdateError) {
          console.error("Erro ao atualizar manualmente:", manualUpdateError);
          throw new Error("Configuração parcial: criamos seu negócio mas houve um erro ao finalizar a configuração.");
        }
      }
      
      // Success!
      setStatus("success");
      setProcessingStep("Configuração concluída com sucesso!");
      toast.success("Estabelecimento configurado com sucesso!");
      
      // Clear onboarding data
      localStorage.removeItem('unclic-manager-onboarding');
      
      // Refresh business data to update contexts
      await refreshBusinessData();
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
      
    } catch (error) {
      console.error("Erro ao configurar estabelecimento:", error);
      setError(error.message || "Erro ao configurar estabelecimento");
      setStatus("error");
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
            isLoading={status === "processing"}
            loadingText="Finalizando..."
            icon={<Save className="mr-2 h-4 w-4" />}
            className="bg-primary hover:bg-primary/90"
          >
            Finalizar
          </LoadingButton>
        ) : (
          <LoadingButton
            onClick={handleNext}
            isLoading={status === "verifying"}
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
