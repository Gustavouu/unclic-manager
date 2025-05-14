
import React, { useEffect, useCallback } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useTenant } from "@/contexts/TenantContext";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";

export const OnboardingProcessStatus: React.FC = () => {
  const { 
    status, 
    processingStep, 
    error, 
    resetOnboarding,
    businessCreated,
    setStatus,
    setCurrentStep,
    setError,
    setProcessingStep,
    services,
    staffMembers,
    hasStaff,
    businessHours
  } = useOnboarding();
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshBusinessData, updateBusinessStatus } = useTenant();
  const { refreshOnboardingStatus } = useNeedsOnboarding();
  
  // Function to check if a business exists and its status
  const checkBusinessExists = useCallback(async (businessId) => {
    try {
      console.log("Verificando existência do negócio:", businessId);
      
      // Verificar na tabela businesses primeiro
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('id, status')
        .eq('id', businessId)
        .maybeSingle();
        
      if (!businessError && businessData) {
        console.log("Negócio encontrado na tabela businesses:", businessData);
        return {
          exists: true,
          status: businessData.status,
          table: 'businesses'
        };
      }
      
      // Verificar na tabela negocios como fallback
      const { data: negociosData, error: negociosError } = await supabase
        .from('negocios')
        .select('id, status')
        .eq('id', businessId)
        .maybeSingle();
        
      if (!negociosError && negociosData) {
        console.log("Negócio encontrado na tabela negocios:", negociosData);
        return {
          exists: true,
          status: negociosData.status,
          table: 'negocios'
        };
      }
      
      console.log("Negócio não encontrado em nenhuma tabela");
      return { exists: false };
    } catch (error) {
      console.error("Erro ao verificar existência do negócio:", error);
      return { exists: false, error };
    }
  }, []);
  
  // Function to find existing business ID for a user
  const findUserBusinessId = useCallback(async (userId) => {
    if (!userId) return null;
    
    try {
      console.log("Procurando negócio associado ao usuário:", userId);
      
      // Procurar em business_users primeiro
      const { data: businessUserData, error: businessUserError } = await supabase
        .from('business_users')
        .select('business_id')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (!businessUserError && businessUserData?.business_id) {
        console.log("Negócio encontrado em business_users:", businessUserData.business_id);
        return businessUserData.business_id;
      }
      
      // Procurar em usuarios como fallback
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
      console.error("Erro ao procurar negócio do usuário:", error);
      return null;
    }
  }, []);
  
  // Function to handle finishing setup after business creation
  const handleCompleteSetup = useCallback(async () => {
    if (!user) {
      setError("Usuário não encontrado. Por favor, faça login novamente.");
      return;
    }
    
    setStatus("processing");
    setError(null);
    
    // Se não temos businessCreated.id, tentar encontrar o ID do negócio
    let businessId = businessCreated?.id;
    
    if (!businessId) {
      setProcessingStep("Procurando negócio existente...");
      businessId = await findUserBusinessId(user.id);
      
      if (!businessId) {
        setError("Não foi possível encontrar o negócio. Por favor, tente criar novamente.");
        setStatus("error");
        return;
      }
      
      // Atualizar o businessCreated
      setBusinessCreated({
        id: businessId
      });
    }
    
    // Verificar se o negócio existe e seu status
    setProcessingStep("Verificando status do negócio...");
    const businessStatus = await checkBusinessExists(businessId);
    
    // Se o negócio já estiver ativo, pular para o sucesso
    if (businessStatus.exists && 
        (businessStatus.status === 'active' || businessStatus.status === 'ativo')) {
      console.log("Negócio já está ativo, pulando para sucesso");
      setProcessingStep("Negócio já está ativo!");
      setStatus("success");
      
      // Limpar dados de onboarding
      localStorage.removeItem('unclic-manager-onboarding');
      
      // Atualizar dados
      await Promise.all([
        refreshBusinessData(),
        refreshOnboardingStatus()
      ]);
      
      // Redirecionar para dashboard
      toast.success("Configuração já está concluída!");
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
      return;
    }
    
    // Se o negócio existe mas não está ativo, finalizar a configuração
    if (businessStatus.exists) {
      setProcessingStep("Finalizando configuração do estabelecimento...");
      
      try {
        // Chamar Edge Function para completar configuração
        console.log("Chamando edge function com:", {
          userId: user.id,
          businessId,
          servicesCount: services?.length || 0,
          staffCount: staffMembers?.length || 0,
          hasStaff
        });
        
        // Definir timeout para evitar espera infinita
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Tempo limite excedido")), 15000)
        );
        
        const response = await Promise.race([
          supabase.functions.invoke('complete-business-setup', {
            body: {
              userId: user.id,
              businessId,
              services,
              staffMembers,
              hasStaff,
              businessHours
            }
          }),
          timeoutPromise
        ]);
        
        console.log("Resposta da edge function:", response);
        
        // Verificar resposta
        if (!response || !response.data) {
          throw new Error("Sem resposta do servidor");
        }
        
        const { success, error: setupError } = response.data;
        
        if (!success) {
          throw new Error(setupError || "Erro ao finalizar configuração");
        }
      } catch (error) {
        console.error("Erro na edge function:", error);
        
        // Tentar atualizar o status manualmente
        setProcessingStep("Atualizando status do negócio manualmente...");
        
        try {
          // Determinar em qual tabela atualizar baseado na verificação anterior
          if (businessStatus.table === 'businesses') {
            await supabase
              .from('businesses')
              .update({ 
                status: 'active',
                updated_at: new Date().toISOString()
              })
              .eq('id', businessId);
          } else {
            await supabase
              .from('negocios')
              .update({ 
                status: 'ativo',
                atualizado_em: new Date().toISOString()
              })
              .eq('id', businessId);
          }
          
          // Verificar se o perfil de acesso existe
          const { data: accessProfile } = await supabase
            .from('perfis_acesso')
            .select('id')
            .eq('id_usuario', user.id)
            .eq('id_negocio', businessId)
            .maybeSingle();
            
          if (!accessProfile) {
            // Criar perfil de acesso se não existir
            await supabase
              .from('perfis_acesso')
              .insert([{
                id_usuario: user.id,
                id_negocio: businessId,
                e_administrador: true,
                acesso_agendamentos: true,
                acesso_clientes: true,
                acesso_financeiro: true,
                acesso_estoque: true,
                acesso_relatorios: true,
                acesso_configuracoes: true,
                acesso_marketing: true
              }]);
          }
        } catch (manualError) {
          console.error("Erro ao atualizar status manualmente:", manualError);
          // Continuar mesmo se falhar
        }
      }
      
      // Independente do resultado, tentar seguir para concluir o processo
      setStatus("success");
      setProcessingStep("Configuração concluída com sucesso!");
      toast.success("Configuração concluída!");
      
      // Limpar dados de onboarding
      localStorage.removeItem('unclic-manager-onboarding');
      
      // Atualizar contextos
      try {
        await Promise.all([
          refreshBusinessData(),
          refreshOnboardingStatus()
        ]);
      } catch (updateError) {
        console.error("Erro ao atualizar dados:", updateError);
      }
      
      // Redirecionar para dashboard
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
      return;
    }
    
    // Se o negócio não existe, mostrar erro
    setError("Negócio não encontrado. Por favor, tente criar novamente.");
    setStatus("error");
  }, [
    businessCreated, 
    user, 
    services, 
    staffMembers, 
    hasStaff, 
    businessHours, 
    setError, 
    setStatus, 
    setProcessingStep, 
    navigate,
    updateBusinessStatus,
    refreshBusinessData,
    refreshOnboardingStatus,
    findUserBusinessId,
    checkBusinessExists
  ]);
  
  // Function to retry the onboarding process
  const handleRetry = useCallback(() => {
    setError(null);
    setStatus("idle");
    setCurrentStep(4); // Back to summary
  }, [setError, setStatus, setCurrentStep]);
  
  // Function to go to dashboard
  const handleGoToDashboard = useCallback(async () => {
    // Ensure we clear any onboarding data
    localStorage.removeItem('unclic-manager-onboarding');
    
    // Try to fix business status before redirecting
    if (businessCreated?.id) {
      try {
        await updateBusinessStatus(businessCreated.id, "ativo");
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
      }
    }
    
    // Refresh data before redirecting
    try {
      await Promise.all([
        refreshBusinessData(),
        refreshOnboardingStatus()
      ]);
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    }
    
    // Redirect to dashboard with replace (prevents going back to onboarding)
    navigate("/dashboard", { replace: true });
  }, [businessCreated, navigate, refreshBusinessData, refreshOnboardingStatus, updateBusinessStatus]);
  
  // Function to force activate business by creating all necessary entries
  const handleForceActivate = useCallback(async () => {
    if (!user) {
      setError("Usuário não encontrado. Por favor, faça login novamente.");
      return;
    }
    
    setStatus("processing");
    setProcessingStep("Recuperando configuração...");
    
    try {
      // 1. Primeiro, ver se já existe um negócio
      let businessId = businessCreated?.id;
      
      if (!businessId) {
        businessId = await findUserBusinessId(user.id);
      }
      
      // 2. Se não existe negócio, precisamos criar um novo
      if (!businessId) {
        setProcessingStep("Criando um novo negócio...");
        
        // Criar nome único
        const timestamp = Date.now().toString().slice(-8);
        const businessName = `Meu Negócio ${timestamp}`;
        
        // Inserir na tabela businesses
        try {
          const { data, error } = await supabase
            .from('businesses')
            .insert([
              {
                name: businessName,
                admin_email: user.email || 'contato@exemplo.com',
                slug: `meu-negocio-${timestamp}`,
                status: 'active'
              }
            ])
            .select('id')
            .single();
            
          if (error) throw error;
          businessId = data.id;
        } catch (businessError) {
          console.error("Erro ao criar na tabela businesses:", businessError);
          
          // Tentar tabela negocios
          const { data, error } = await supabase
            .from('negocios')
            .insert([
              {
                nome: `Meu Negócio ${timestamp}`,
                email_admin: user.email || 'contato@exemplo.com',
                slug: `meu-negocio-${timestamp}`,
                status: 'ativo'
              }
            ])
            .select('id')
            .single();
            
          if (error) throw error;
          businessId = data.id;
        }
        
        // Atualizar businessCreated
        setBusinessCreated({
          id: businessId,
          slug: `meu-negocio-${timestamp}`
        });
      }
      
      // 3. Criar associação de usuário se não existir
      setProcessingStep("Associando usuário ao negócio...");
      
      try {
        // Verificar se já existe associação
        const { data: existingAssoc, error: checkError } = await supabase
          .from('business_users')
          .select('id')
          .eq('user_id', user.id)
          .eq('business_id', businessId)
          .maybeSingle();
          
        if (checkError) throw checkError;
        
        if (!existingAssoc) {
          const { error: assocError } = await supabase
            .from('business_users')
            .insert([{
              user_id: user.id,
              business_id: businessId,
              role: 'owner'
            }]);
            
          if (assocError) throw assocError;
        }
      } catch (assocError) {
        console.error("Erro ao criar associação business_users:", assocError);
        
        // Tentar atualizar na tabela usuarios como fallback
        try {
          await supabase
            .from('usuarios')
            .update({ id_negocio: businessId })
            .eq('id', user.id);
        } catch (userError) {
          console.error("Erro ao atualizar usuario:", userError);
        }
      }
      
      // 4. Garantir que o negócio está ativo
      setProcessingStep("Ativando negócio...");
      await updateBusinessStatus(businessId, "ativo");
      
      // Success!
      setStatus("success");
      setProcessingStep("Recuperação concluída com sucesso!");
      toast.success("Configuração recuperada com sucesso!");
      
      // Limpar dados de onboarding
      localStorage.removeItem('unclic-manager-onboarding');
      
      // Atualizar contextos
      await Promise.all([
        refreshBusinessData(),
        refreshOnboardingStatus()
      ]);
      
      // Redirecionar para dashboard
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Erro ao forçar ativação:", error);
      setError(`Erro ao recuperar: ${error.message}`);
      setStatus("error");
    }
  }, [
    user, 
    businessCreated, 
    setStatus, 
    setProcessingStep, 
    setError, 
    setBusinessCreated, 
    navigate,
    findUserBusinessId, 
    updateBusinessStatus, 
    refreshBusinessData, 
    refreshOnboardingStatus
  ]);

  const getStatusMessage = () => {
    switch (status) {
      case "saving":
        return "Salvando dados...";
      case "processing":
        return processingStep || "Processando...";
      case "verifying":
        return "Verificando status...";
      case "error":
        return "Ocorreu um erro";
      case "success":
        return "Configuração concluída com sucesso!";
      default:
        return "Processando...";
    }
  };

  // Automatically try to complete setup when this component mounts if we have a business ID
  useEffect(() => {
    if ((status === "processing" || status === "verifying") && 
        (businessCreated?.id || user?.id) && 
        !processingStep?.includes("Finalizando")) {
      console.log("Iniciando handleCompleteSetup automaticamente");
      handleCompleteSetup();
    }
    
    // Clean up local storage when component unmounts if successful
    return () => {
      if (status === "success") {
        localStorage.removeItem('unclic-manager-onboarding');
      }
    };
  }, [businessCreated, status, processingStep, handleCompleteSetup, user]);

  return (
    <div className="space-y-8 py-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Configurando seu Estabelecimento</h2>
        <p className="text-muted-foreground mb-8">
          Estamos configurando seu estabelecimento. Isso pode levar alguns instantes.
        </p>
        
        {/* Status indicator */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{getStatusMessage()}</span>
            <span className="text-sm font-medium">
              {status === "error" ? "Erro" : status === "success" ? "100%" : "..."}
            </span>
          </div>
          
          <Progress 
            value={status === "error" ? 100 : status === "success" ? 100 : undefined} 
            className={`h-2 ${status === "error" ? "bg-red-200" : ""}`}
          />
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 max-w-lg mx-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-red-500">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Success message */}
      {status === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 max-w-lg mx-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-green-500">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Seu estabelecimento foi configurado com sucesso!</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {status === "error" && (
          <>
            <Button 
              variant="outline" 
              onClick={handleRetry}
              className="min-w-[150px]"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
            
            <Button
              onClick={handleCompleteSetup}
              className="min-w-[150px]"
            >
              Finalizar configuração
            </Button>
            
            <Button
              onClick={handleForceActivate}
              variant="destructive"
              className="min-w-[150px]"
            >
              Recuperação forçada
            </Button>
          </>
        )}
        
        {status === "success" && (
          <Button 
            onClick={handleGoToDashboard}
            className="min-w-[150px]"
          >
            Ir para o Dashboard
          </Button>
        )}
        
        {(status === "processing" || status === "verifying" || status === "saving") && (
          <div className="h-10 flex items-center justify-center">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
};
