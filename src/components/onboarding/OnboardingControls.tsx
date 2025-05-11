
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
  const [isCompletingSetup, setIsCompletingSetup] = useState(false);
  
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
        
        // Check if access profile exists
        const { data: accessProfile } = await supabase
          .from('perfis_acesso')
          .select('id')
          .eq('id_usuario', user.id)
          .eq('id_negocio', userData.id_negocio)
          .maybeSingle();
          
        if (accessProfile) {
          // Business exists and profile exists, redirect to dashboard
          localStorage.removeItem('unclic-manager-onboarding');
          
          toast.success("Estabelecimento já configurado. Redirecionando para o dashboard...");
          
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1000);
          return { success: true, complete: true };
        } else {
          // Business exists but profile doesn't, need to complete setup
          return { 
            success: true, 
            complete: false, 
            businessId: businessData?.id,
            businessSlug: businessData?.slug
          };
        }
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
  
  // Handle setup completion after business creation
  const handleCompleteSetup = async () => {
    if (!user || !businessCreated?.id) {
      toast.error("Informações incompletas para completar a configuração");
      return;
    }
    
    setIsCompletingSetup(true);
    setError(null);
    
    try {
      const loadingToast = toast.loading("Finalizando configuração do estabelecimento...");
      
      // Call the separate function to complete business setup
      const response = await supabase.functions.invoke('complete-business-setup', {
        body: {
          userId: user.id,
          businessId: businessCreated.id,
          services: services,
          staffMembers: staffMembers,
          hasStaff: hasStaff
        }
      });
      
      toast.dismiss(loadingToast);
      
      if (!response.data.success) {
        throw new Error(response.data.error || "Erro ao finalizar configuração");
      }
      
      toast.success("Configuração finalizada com sucesso!");
      
      // Limpar dados salvos no localStorage após configuração bem-sucedida
      localStorage.removeItem('unclic-manager-onboarding');
      
      // Redirecionar para o dashboard após um breve delay
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
      
    } catch (error: any) {
      console.error("Erro ao completar configuração:", error);
      setError(`Erro ao finalizar configuração: ${error.message}`);
      toast.error(error.message || "Erro ao finalizar configuração");
    } finally {
      setIsCompletingSetup(false);
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
    
    // Reset states
    setIsSaving(true);
    setError(null);
    setBusinessCreated(null);
    
    try {
      // Verificar disponibilidade do slug
      const isAvailable = await checkSlugAvailability(businessData.name);
      if (!isAvailable) {
        toast.error("O nome do estabelecimento já está em uso. Por favor, escolha outro nome.");
        setIsSaving(false);
        return;
      }
      
      // Mostrar toast de progresso
      const loadingToast = toast.loading("Criando seu negócio...");
      
      // STEP 1: Create the business first
      console.log("Sending request to create business");
      
      const response = await supabase.functions.invoke('create-business', {
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
      
      toast.dismiss(loadingToast);
      
      console.log("Create business response:", response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.error || "Erro ao criar negócio");
      }
      
      const businessId = response.data.businessId;
      const businessSlug = response.data.businessSlug;
      const needsProfileSetup = response.data.needsProfileSetup;
      
      // Store business info for next step
      setBusinessCreated({
        id: businessId,
        slug: businessSlug
      });
      
      console.log("Negócio criado com sucesso. ID:", businessId, "Slug:", businessSlug);
      
      if (needsProfileSetup) {
        // If we need to complete setup separately
        setError("Estabelecimento criado com sucesso! Agora precisamos finalizar a configuração do seu perfil de acesso. Clique em 'Finalizar Configuração' para continuar.");
        toast.success("Estabelecimento criado! Por favor, finalize a configuração.");
        setIsSaving(false);
        return;
      }
      
      // Proceed to complete setup immediately
      await handleCompleteSetup();
      
    } catch (error: any) {
      console.error("Erro ao finalizar configuração:", error);
      
      // Check if we hit the worker limit error (timeout)
      if (error.message.includes("compute resources") || error.message.includes("WORKER_LIMIT")) {
        setError("O servidor está ocupado. O estabelecimento pode ter sido criado, mas ainda precisamos finalizar a configuração.");
        
        // Wait a moment and check if business was created
        setTimeout(async () => {
          const result = await verifyBusinessCreated();
          
          if (result.success) {
            if (result.complete) {
              toast.success("Configuração concluída com sucesso!");
              // Redirect is handled by verifyBusinessCreated
            } else {
              setError("Estabelecimento criado com sucesso! Agora precisamos finalizar a configuração do seu perfil de acesso. Clique em 'Finalizar Configuração' para continuar.");
              toast.success("Estabelecimento criado! Por favor, finalize a configuração.");
            }
          } else {
            setError("Não foi possível verificar se o estabelecimento foi criado. Por favor, tente novamente.");
          }
        }, 2000);
      } else {
        setError(error.message || "Erro desconhecido ao criar estabelecimento");
        toast.error(error.message || "Erro ao finalizar configuração");
      }
    } finally {
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
          {businessCreated && (
            <div className="mt-3">
              <Button 
                variant="default" 
                size="sm" 
                className="bg-amber-500 hover:bg-amber-600"
                onClick={handleCompleteSetup}
                disabled={isSaving || isVerifyingCreation || isCompletingSetup}
              >
                <RefreshCw className={cn("mr-2 h-4 w-4", isCompletingSetup && "animate-spin")} />
                Finalizar Configuração
              </Button>
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious} 
          disabled={currentStep === 0 || isSaving || isCheckingSlug || isVerifyingCreation || isCompletingSetup}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        
        {currentStep === 4 ? (
          <LoadingButton 
            onClick={handleFinish}
            isLoading={isSaving || isVerifyingCreation || isCompletingSetup} 
            loadingText={isVerifyingCreation ? "Verificando..." : isCompletingSetup ? "Finalizando..." : "Salvando..."}
            icon={<Save className="mr-2 h-4 w-4" />}
            disabled={isSaving || isCheckingSlug || isVerifyingCreation || isCompletingSetup}
            className="bg-primary hover:bg-primary/90"
          >
            {businessCreated ? "Finalizar Configuração" : "Finalizar"}
          </LoadingButton>
        ) : (
          <LoadingButton
            onClick={handleNext}
            isLoading={isCheckingSlug}
            loadingText="Verificando..."
            icon={<ArrowRight className="ml-2 h-4 w-4" />}
            disabled={isSaving || isCheckingSlug || isVerifyingCreation || isCompletingSetup}
            className="bg-primary hover:bg-primary/90"
          >
            Avançar
          </LoadingButton>
        )}
      </div>
    </div>
  );
};
