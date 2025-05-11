
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { ArrowLeft, ArrowRight, Save, Loader, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LoadingButton } from "@/components/ui/loading-button";
import { cn } from "@/lib/utils";

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
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isVerifyingCreation, setIsVerifyingCreation] = useState(false);
  const [businessCreated, setBusinessCreated] = useState<{id?: string; slug?: string} | null>(null);
  
  // Function to check if a slug is available before proceeding
  const checkSlugAvailability = async (name: string): Promise<boolean> => {
    setIsCheckingSlug(true);
    setError(null);
    
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

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    
    if (businessCreated) {
      // Se o negócio foi criado mas o perfil de acesso falhou, tentamos apenas criar o perfil
      handleCreateProfile();
    } else {
      // Caso contrário, tentamos o processo completo novamente
      handleFinish();
    }
  };
  
  // Novo método para tentar criar apenas o perfil de acesso
  const handleCreateProfile = async () => {
    if (!user || !businessCreated?.id) {
      toast.error("Informações incompletas para criar o perfil de acesso");
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      const loadingToast = toast.loading("Criando seu perfil de acesso...");
      
      // Tentar criar manualmente apenas o perfil de acesso
      const { data: accessProfile, error: accessProfileError } = await supabase
        .from('perfis_acesso')
        .insert([{
          id_usuario: user.id,
          id_negocio: businessCreated.id,
          e_administrador: true,
          acesso_configuracoes: true,
          acesso_agendamentos: true,
          acesso_clientes: true,
          acesso_financeiro: true,
          acesso_estoque: true,
          acesso_marketing: true,
          acesso_relatorios: true
        }])
        .select();
        
      toast.dismiss(loadingToast);
      
      if (accessProfileError) {
        if (accessProfileError.code === '23503') {
          // Erro de chave estrangeira, aguardar mais tempo e verificar se o negócio foi associado ao usuário
          setError("Erro ao criar perfil de acesso. Verificando associação do usuário...");
          
          // Verificar se o usuário tem o negócio associado
          const { data: userCheck } = await supabase
            .from('usuarios')
            .select('id_negocio')
            .eq('id', user.id)
            .single();
            
          if (userCheck && userCheck.id_negocio === businessCreated.id) {
            // Se o usuário já tem o negócio associado, podemos prosseguir
            toast.success("Estabelecimento associado com sucesso!");
            
            // Limpar dados salvos no localStorage após configuração bem-sucedida
            localStorage.removeItem('unclic-manager-onboarding');
            
            // Redirecionar para o dashboard após um breve delay para que o toast seja visível
            setTimeout(() => {
              navigate("/dashboard", { replace: true });
            }, 2000);
            return;
          } else {
            throw new Error("O usuário não está corretamente associado ao negócio");
          }
        }
        
        throw new Error(`Erro ao criar perfil de acesso: ${accessProfileError.message}`);
      }
      
      toast.success("Perfil de acesso criado com sucesso!");
      
      // Limpar dados salvos no localStorage após configuração bem-sucedida
      localStorage.removeItem('unclic-manager-onboarding');
      
      // Redirecionar para o dashboard
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
      
    } catch (error: any) {
      console.error("Erro ao criar perfil de acesso:", error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Function to verify if a business was created for the user
  const verifyBusinessCreated = async () => {
    if (!user) return { success: false };
    
    setIsVerifyingCreation(true);
    try {
      // Check if user already has a business
      console.log("Verifying if business exists for user", user.id);
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('id_negocio')
        .eq('id', user.id)
        .maybeSingle();
      
      if (userError) {
        console.error("Error checking user business:", userError);
        return { success: false };
      }
      
      if (userData?.id_negocio) {
        console.log("Found existing business:", userData.id_negocio);
        
        // Get business details
        const { data: businessData, error: businessError } = await supabase
          .from('negocios')
          .select('id, slug')
          .eq('id', userData.id_negocio)
          .maybeSingle();
          
        if (!businessError && businessData) {
          // Store the business info for potential profile creation
          setBusinessCreated({
            id: businessData.id,
            slug: businessData.slug
          });
        }
        
        // Business exists, redirect to dashboard
        localStorage.removeItem('unclic-manager-onboarding');
        
        toast.success("Estabelecimento já configurado. Redirecionando para o dashboard...");
        
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1000);
        return { success: true };
      }
      
      return { success: false };
    } catch (err) {
      console.error("Error verifying business creation:", err);
      return { success: false };
    } finally {
      setIsVerifyingCreation(false);
    }
  };
  
  // Check on component mount if the user already has a business
  useEffect(() => {
    if (user) {
      verifyBusinessCreated();
    }
  }, [user]);
  
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
    setError(null);
    setBusinessCreated(null);
    
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
      
      console.log("Sending request to create business with payload:", businessPayload);
      
      // Verificar se o usuário já existe na tabela de usuários antes de prosseguir
      const { data: existingUser, error: userCheckError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      // Se o usuário não existir, criá-lo primeiro para evitar problemas com chaves estrangeiras
      if (!existingUser && !userCheckError) {
        console.log("User doesn't exist in usuarios table, creating...");
        const { error: createUserError } = await supabase
          .from('usuarios')
          .insert([
            { 
              id: user.id,
              email: user.email || businessData.email,
              nome_completo: user.name || businessData.name,
              status: 'ativo'
            },
          ]);
          
        if (createUserError) {
          console.error("Error pre-creating user:", createUserError);
          // Continue anyway, the edge function will try to create the user
        } else {
          console.log("User pre-created successfully");
          // Wait a bit to ensure database consistency
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
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
      
      // Verificar timeout
      if (!response.ok && response.status === 504) {
        toast.dismiss(loadingToast);
        setError("Timeout na criação do negócio. Verificando se o processo foi concluído...");
        
        // Aguardar um pouco antes de verificar se o negócio foi criado apesar do timeout
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const businessVerification = await verifyBusinessCreated();
        
        if (businessVerification.success) {
          // O código de redirecionamento já está na função verifyBusinessCreated
          return;
        }
        
        throw new Error("Timeout na criação do negócio e não foi possível verificar se o processo foi concluído. Por favor, tente novamente.");
      }
      
      const result = await response.json();
      console.log("Create business response:", result);
      
      if (!response.ok && !result.success) {
        toast.dismiss(loadingToast);
        
        // Handle specific errors
        if (result.error && result.error.includes("já está em uso")) {
          throw new Error("O nome do estabelecimento já está em uso. Por favor, escolha outro nome.");
        } else if (result.error && result.error.includes("perfis_acesso")) {
          // Armazenar que o negócio foi criado, mas o perfil falhou
          if (result.businessId) {
            setBusinessCreated({
              id: result.businessId,
              slug: result.businessSlug || slug
            });
          }
          throw new Error("Erro ao criar perfil de acesso. O negócio foi criado, mas você precisará finalizar a configuração do seu perfil.");
        } else {
          throw new Error(result.error || "Erro ao criar negócio");
        }
      }
      
      const businessId = result.businessId;
      const finalSlug = result.businessSlug || slug;
      const wasRecovered = result.recovered || false;
      const partialSuccess = result.partialSuccess || false;
      
      // Se o negócio foi criado, armazene as informações
      setBusinessCreated({
        id: businessId,
        slug: finalSlug
      });
      
      console.log("Negócio criado com sucesso" + (wasRecovered ? " (recuperado após erro)" : "") + 
        (partialSuccess ? " (parcialmente)" : "") +
        ". ID:", businessId, "Slug:", finalSlug);
      
      toast.dismiss(loadingToast);
      
      // Mensagem diferente baseada no resultado
      if (wasRecovered) {
        toast.success("Estabelecimento recuperado com sucesso!", {
          duration: 5000
        });
      } else if (partialSuccess) {
        toast.success("Estabelecimento criado, mas o perfil de acesso não foi configurado completamente.", {
          duration: 5000
        });
      } else {
        toast.success("Estabelecimento configurado com sucesso!", {
          duration: 5000
        });
      }
      
      if (result.accessProfileCreated === false || partialSuccess) {
        console.warn("Access profile was not created, but business creation was successful");
        
        if (!partialSuccess) {
          toast.warning("Perfil de acesso não foi criado completamente, mas o estabelecimento foi configurado. Atualizando...");
        }
        
        // Se o perfil não foi criado, oferecemos um botão de retry para esse passo específico
        setError("O estabelecimento foi criado, mas o perfil de acesso não foi configurado corretamente. Clique em 'Finalizar configuração' para tentar novamente.");
        
        // Não redirecionamos automaticamente nesse caso, aguardamos o usuário clicar no botão
        setIsSaving(false);
        return;
      }
      
      // Limpar dados salvos no localStorage após configuração bem-sucedida
      localStorage.removeItem('unclic-manager-onboarding');
      
      // Redirecionar para o dashboard após um breve delay para que o toast seja visível
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
      
    } catch (error: any) {
      console.error("Erro ao finalizar configuração:", error);
      
      // Se for um erro de timeout, verifique se o negócio foi criado
      if (error.message.includes("Timeout")) {
        setError("Timeout na requisição. Verificando se o negócio foi criado...");
        
        try {
          // Verificar se o usuário agora tem um negócio associado
          const businessVerification = await verifyBusinessCreated();
          
          if (businessVerification.success) {
            // O código de redirecionamento já está na função verifyBusinessCreated
            return;
          }
          
          // Se chegar aqui, o negócio não foi criado
          setError("Timeout na requisição e não foi possível verificar se o negócio foi criado. Tente novamente.");
        } catch (checkErr) {
          console.error("Erro ao verificar criação do negócio:", checkErr);
          setError("Erro ao verificar se o negócio foi criado. Tente novamente.");
        }
      } else if (error.message.includes("perfis_acesso")) {
        setError("O negócio foi criado, mas ocorreu um erro ao configurar seu perfil de acesso. Clique em 'Finalizar configuração' para completar o processo.");
        
        if (!businessCreated) {
          // Esperar um pouco e verificar se o negócio foi criado mesmo com o erro no perfil
          setTimeout(async () => {
            const businessVerification = await verifyBusinessCreated();
            
            if (!businessVerification.success) {
              setError("Erro ao criar negócio. Por favor, tente novamente.");
            }
          }, 2000);
        }
      } else {
        // Erro normal
        setError(error.message || "Erro ao finalizar configuração. Tente novamente.");
      }
      
      // Decidir se mostra botão de retry
      const showRetry = error.message.includes("perfis_acesso") || 
                         error.message.includes("Timeout") || 
                         retryCount < 3 || 
                         !!businessCreated;
      
      if (!showRetry) {
        setError(`${error.message || "Erro ao finalizar configuração"}. Entre em contato com o suporte.`);
      }
      
      toast.error(error.message || "Erro ao finalizar configuração. Tente novamente.");
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-4 mt-8">
      {error && (
        <div className={cn(
          "bg-red-50 border rounded-lg p-4 mb-4",
          businessCreated ? "border-amber-200" : "border-red-200"
        )}>
          <div className="flex items-center">
            <div className={cn(
              "flex-shrink-0",
              businessCreated ? "text-amber-500" : "text-red-500"
            )}>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className={cn(
                "text-sm",
                businessCreated ? "text-amber-700" : "text-red-700"
              )}>{error}</p>
            </div>
          </div>
          {((error.includes("perfis_acesso") || error.includes("Timeout") || businessCreated) && retryCount < 5) && (
            <div className="mt-3">
              <Button 
                variant={businessCreated ? "default" : "outline"} 
                size="sm" 
                className={businessCreated 
                  ? "bg-amber-500 hover:bg-amber-600" 
                  : "border-red-300 text-red-700 hover:bg-red-50"}
                onClick={handleRetry}
                disabled={isSaving || isVerifyingCreation}
              >
                <RefreshCw className={cn("mr-2 h-4 w-4", (isSaving || isVerifyingCreation) && "animate-spin")} />
                {businessCreated ? "Finalizar configuração" : "Tentar novamente"}
              </Button>
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious} 
          disabled={currentStep === 0 || isSaving || isCheckingSlug || isVerifyingCreation}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        
        {currentStep === 4 ? (
          <LoadingButton 
            onClick={handleFinish}
            isLoading={isSaving || isVerifyingCreation} 
            loadingText={isVerifyingCreation ? "Verificando..." : "Salvando..."}
            icon={<Save className="mr-2 h-4 w-4" />}
            disabled={isSaving || isCheckingSlug || isVerifyingCreation}
            className="bg-primary hover:bg-primary/90"
          >
            Finalizar
          </LoadingButton>
        ) : (
          <LoadingButton
            onClick={handleNext}
            isLoading={isCheckingSlug}
            loadingText="Verificando..."
            icon={<ArrowRight className="ml-2 h-4 w-4" />}
            disabled={isSaving || isCheckingSlug || isVerifyingCreation}
            className="bg-primary hover:bg-primary/90"
          >
            Avançar
          </LoadingButton>
        )}
      </div>
    </div>
  );
};
