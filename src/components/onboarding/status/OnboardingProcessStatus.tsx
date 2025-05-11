
import React, { useEffect } from "react";
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
  
  // Function to handle finishing setup after business creation
  const handleCompleteSetup = async () => {
    if (!businessCreated?.id || !user) {
      setError("ID do negócio ou usuário não encontrado");
      return;
    }
    
    setStatus("processing");
    setError(null);
    setProcessingStep("Finalizando configuração do estabelecimento...");
    
    try {
      // Call the Edge Function to complete the business setup
      const response = await supabase.functions.invoke('complete-business-setup', {
        body: {
          userId: user.id,
          businessId: businessCreated.id,
          services: services,
          staffMembers: staffMembers,
          hasStaff: hasStaff,
          businessHours: businessHours
        }
      });
      
      // Check for Edge Function response
      if (!response || !response.data) {
        throw new Error("O servidor não respondeu. Verificando status...");
      }
      
      const { success, message, error: setupError } = response.data;
      
      if (!success) {
        throw new Error(setupError || "Erro ao finalizar configuração");
      }
      
      // Manually update the business status just to be extra safe
      await updateBusinessStatus(businessCreated.id, "ativo");
      
      // Update status to success
      setStatus("success");
      setProcessingStep("Configuração concluída com sucesso!");
      toast.success(message || "Configuração concluída com sucesso!");
      
      // Clear onboarding data from localStorage
      localStorage.removeItem('unclic-manager-onboarding');
      
      // Refresh both business data and onboarding status
      await Promise.all([
        refreshBusinessData(), 
        refreshOnboardingStatus()
      ]);
      
      // Redirect to dashboard after successful setup
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
    } catch (error: any) {
      console.error("Erro ao finalizar configuração:", error);
      
      // In case of timeout or other errors, try to verify if setup is complete
      if (error.message && (error.message.includes("não respondeu") || error.message.includes("verificando"))) {
        setProcessingStep("Verificando status de configuração...");
        
        // Try to manually update the business status directly
        try {
          const updated = await updateBusinessStatus(businessCreated.id, "ativo");
          
          if (updated) {
            setStatus("success");
            setProcessingStep("Configuração concluída com sucesso!");
            toast.success("Status do negócio atualizado manualmente com sucesso!");
            
            // Clear onboarding data
            localStorage.removeItem('unclic-manager-onboarding');
            
            // Refresh both business data and onboarding status
            await Promise.all([
              refreshBusinessData(),
              refreshOnboardingStatus()
            ]);
            
            // Redirect to dashboard
            setTimeout(() => {
              navigate("/dashboard", { replace: true });
            }, 1500);
            return;
          }
        } catch (updateError) {
          console.error("Erro ao atualizar status manualmente:", updateError);
        }
        
        // Delay to allow server processing to complete
        setTimeout(async () => {
          try {
            // Check if the user has access to the business
            const { data: accessProfile, error: profileError } = await supabase
              .from('perfis_acesso')
              .select('id')
              .eq('id_usuario', user.id)
              .eq('id_negocio', businessCreated.id)
              .maybeSingle();
            
            if (profileError) throw profileError;
            
            if (accessProfile) {
              // Access profile exists, indicating setup is complete
              // Try to manually update the business status
              await updateBusinessStatus(businessCreated.id, "ativo");
              
              setStatus("success");
              setProcessingStep("Configuração concluída com sucesso!");
              toast.success("Configuração concluída com sucesso!");
              
              // Clear onboarding data
              localStorage.removeItem('unclic-manager-onboarding');
              
              // Refresh both business data and onboarding status
              await Promise.all([
                refreshBusinessData(), 
                refreshOnboardingStatus()
              ]);
              
              // Redirect to dashboard
              setTimeout(() => {
                navigate("/dashboard", { replace: true });
              }, 1500);
            } else {
              // Access profile does not exist yet
              setError("Configuração em andamento. Por favor, tente novamente em alguns instantes.");
              setStatus("error");
            }
          } catch (verificationError) {
            console.error("Erro ao verificar status de configuração:", verificationError);
            setError("Não foi possível verificar o status da configuração. Por favor, tente novamente.");
            setStatus("error");
          }
        }, 3000);
      } else {
        // Handle regular errors
        setError(error.message || "Erro ao finalizar configuração");
        setStatus("error");
      }
    }
  };
  
  // Function to retry the onboarding process
  const handleRetry = () => {
    setError(null);
    setStatus("idle");
    setCurrentStep(4); // Back to summary
  };
  
  // Function to go to dashboard
  const handleGoToDashboard = async () => {
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
  };

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
    if (status === "processing" && businessCreated?.id && !processingStep?.includes("Finalizando")) {
      handleCompleteSetup();
    }
    
    // Clean up local storage when component unmounts if successful
    return () => {
      if (status === "success") {
        localStorage.removeItem('unclic-manager-onboarding');
      }
    };
  }, [businessCreated, status, processingStep]);

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
            
            {businessCreated?.id && (
              <Button
                onClick={handleCompleteSetup}
                className="min-w-[150px]"
              >
                Finalizar configuração
              </Button>
            )}
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
