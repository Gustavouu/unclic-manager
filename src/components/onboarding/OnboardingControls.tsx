
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { ArrowLeft, ArrowRight, Save, Check } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LoadingButton } from "@/components/ui/loading-button";
import { useTenant } from "@/contexts/TenantContext";

interface OnboardingControlsProps {
  isEditMode?: boolean;
}

export const OnboardingControls: React.FC<OnboardingControlsProps> = ({ isEditMode = false }) => {
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
    onboardingMethod,
    businessCreated
  } = useOnboarding();
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshBusinessData, updateBusinessStatus } = useTenant();
  
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
      
      // If not in edit mode, check slug availability
      if (!isEditMode) {
        setStatus("verifying");
        setProcessingStep("Verificando disponibilidade do nome...");
        
        try {
          // Gerar um nome único adicionando um timestamp se necessário
          const timestamp = Date.now().toString().slice(-4);
          const modifiedName = `${businessData.name}`;
          
          const { data, error } = await supabase.functions.invoke('check-slug-availability', {
            body: { name: modifiedName },
          });
          
          setStatus("idle");
          
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
          toast.error("Erro ao verificar disponibilidade do nome");
          setStatus("idle");
          return;
        }
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
  
  const handleUpdateBusiness = async () => {
    if (!isComplete()) {
      toast.error("Preencha todas as informações obrigatórias antes de salvar");
      return;
    }
    
    if (!user || !businessCreated?.id) {
      toast.error("Informações do negócio não encontradas. Tente novamente.");
      return;
    }
    
    // Update status to processing
    setStatus("processing");
    setError(null);
    setProcessingStep("Atualizando informações do estabelecimento...");
    
    try {
      // Update business information
      const { error: businessError } = await supabase
        .from('negocios')
        .update({
          nome: businessData.name,
          email_admin: businessData.email,
          telefone: businessData.phone,
          endereco: businessData.address,
          numero: businessData.number,
          bairro: businessData.neighborhood,
          cidade: businessData.city,
          estado: businessData.state,
          cep: businessData.cep,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', businessCreated.id);
      
      if (businessError) {
        throw new Error(businessError.message || "Erro ao atualizar informações do negócio");
      }
      
      // Update services
      // First, remove all existing services
      if (services.length > 0) {
        const { error: deleteServicesError } = await supabase
          .from('servicos')
          .delete()
          .eq('id_negocio', businessCreated.id);
        
        if (deleteServicesError) {
          console.error("Error deleting existing services:", deleteServicesError);
          // Continue anyway to try adding new services
        }
        
        // Add new services
        const servicesToInsert = services.map(service => ({
          id_negocio: businessCreated.id,
          nome: service.name,
          descricao: service.description || null,
          preco: service.price,
          duracao: service.duration,
          comissao_percentual: 0,
          ativo: true
        }));
        
        const { error: addServicesError } = await supabase
          .from('servicos')
          .insert(servicesToInsert);
        
        if (addServicesError) {
          console.error("Error adding services:", addServicesError);
          // Continue with other updates
        }
      }
      
      // Update staff if applicable
      if (hasStaff && staffMembers.length > 0) {
        // Remove existing staff
        const { error: deleteStaffError } = await supabase
          .from('funcionarios')
          .delete()
          .eq('id_negocio', businessCreated.id);
        
        if (deleteStaffError) {
          console.error("Error deleting existing staff:", deleteStaffError);
          // Continue anyway
        }
        
        // Add new staff
        const staffToInsert = staffMembers.map(staff => ({
          id_negocio: businessCreated.id,
          nome: staff.name,
          cargo: staff.role || "Profissional",
          email: staff.email || null,
          telefone: staff.phone || null,
          especializacoes: staff.specialties || [],
          status: "ativo"
        }));
        
        const { error: addStaffError } = await supabase
          .from('funcionarios')
          .insert(staffToInsert);
        
        if (addStaffError) {
          console.error("Error adding staff:", addStaffError);
          // Continue with other updates
        }
      }
      
      // Update business hours
      if (Object.keys(businessHours).length > 0) {
        // Remove existing hours
        const { error: deleteHoursError } = await supabase
          .from('horarios_disponibilidade')
          .delete()
          .eq('id_negocio', businessCreated.id);
        
        if (deleteHoursError) {
          console.error("Error deleting existing hours:", deleteHoursError);
          // Continue anyway
        }
        
        // Add new hours
        const dayMapping: Record<string, number> = {
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
          sunday: 0
        };
        
        const hoursToInsert = Object.entries(businessHours)
          .filter(([_, data]) => data.open)
          .map(([day, data]) => ({
            id_negocio: businessCreated.id,
            dia_semana: dayMapping[day],
            hora_inicio: data.openTime,
            hora_fim: data.closeTime,
            dia_folga: false,
            capacidade_simultanea: 1,
            intervalo_entre_agendamentos: 0
          }));
        
        const { error: addHoursError } = await supabase
          .from('horarios_disponibilidade')
          .insert(hoursToInsert);
        
        if (addHoursError) {
          console.error("Error adding business hours:", addHoursError);
          // Continue with other updates
        }
      }
      
      // Ensure business status is active
      const statusUpdated = await updateBusinessStatus(businessCreated.id, "ativo");
      if (!statusUpdated) {
        console.warn("Failed to update business status through context, trying direct update");
        
        const { error: statusError } = await supabase
          .from('negocios')
          .update({ 
            status: 'ativo',
            atualizado_em: new Date().toISOString()
          })
          .eq('id', businessCreated.id);
          
        if (statusError) {
          console.error("Error updating business status:", statusError);
          // Try one more approach - RPC function
          await supabase.rpc('set_business_status', {
            business_id: businessCreated.id,
            new_status: 'ativo'
          });
        }
      }
      
      // Success!
      setStatus("success");
      setProcessingStep("Alterações salvas com sucesso!");
      toast.success("Alterações salvas com sucesso!");
      
      // Clear onboarding data from localStorage
      localStorage.removeItem('unclic-manager-onboarding');
      
      // Refresh business data to update contexts
      await refreshBusinessData();
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
      
    } catch (error: any) {
      console.error("Erro ao atualizar estabelecimento:", error);
      setError(error.message || "Erro ao atualizar estabelecimento");
      setStatus("error");
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
      
      // Gerar um nome único adicionando um timestamp
      const timestamp = Date.now().toString().slice(-4);
      const uniqueName = `${businessData.name}-${timestamp}`;
      
      const { data: slugData, error: slugError } = await supabase.functions.invoke('check-slug-availability', {
        body: { name: uniqueName },
      });
      
      if (slugError || !slugData) {
        throw new Error(slugError?.message || "Erro ao verificar disponibilidade do nome");
      }
      
      // Se não estiver disponível, adicione um timestamp para torná-lo único
      const finalBusinessName = (!slugData.isAvailable) ? uniqueName : businessData.name;
      
      // Step 2: Create business
      setProcessingStep("Criando seu estabelecimento...");
      
      const businessResponse = await supabase.functions.invoke('create-business', {
        body: {
          businessData: {
            name: finalBusinessName, // Use o nome potencialmente modificado
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
      
      console.log("Calling complete-business-setup with", {
        userId: user.id,
        businessId: businessId,
        servicesCount: services.length,
        staffCount: staffMembers.length,
        hasStaff
      });
      
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
      
      // Refresh business data to update contexts
      await refreshBusinessData();
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
      
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
                  
                  // Refresh business data to update contexts
                  await refreshBusinessData();
                  
                  // Redirect to dashboard after a delay
                  setTimeout(() => {
                    navigate("/dashboard", { replace: true });
                  }, 1500);
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
  
  const handleCancel = () => {
    if (confirm("Deseja realmente cancelar as alterações e voltar para o dashboard?")) {
      // Clean up localStorage to avoid showing the draft next time
      localStorage.removeItem('unclic-manager-onboarding');
      navigate("/dashboard", { replace: true });
    }
  };
  
  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between">
        {isEditMode ? (
          <>
            <Button 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            
            <LoadingButton 
              onClick={handleUpdateBusiness}
              isLoading={status === "processing"}
              loadingText="Salvando..."
              icon={<Save className="mr-2 h-4 w-4" />}
              className="bg-primary hover:bg-primary/90"
            >
              Salvar Alterações
            </LoadingButton>
          </>
        ) : (
          <>
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
                icon={<Check className="mr-2 h-4 w-4" />}
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
          </>
        )}
      </div>
    </div>
  );
};
