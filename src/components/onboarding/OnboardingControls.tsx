
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useTenant } from "@/contexts/TenantContext";

interface OnboardingControlsProps {
  currentStep: string;
  onPrevious?: () => void;
  onNext?: () => void;
  isSubmitting?: boolean;
}

export function OnboardingControls({
  currentStep,
  onPrevious,
  onNext,
  isSubmitting = false,
}: OnboardingControlsProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { businessId } = useTenant();
  
  const handleSkip = async () => {
    if (!businessId) {
      toast.error("ID do negócio não encontrado");
      return;
    }
    
    setLoading(true);
    try {
      // Mark current step as completed
      await supabase
        .from('onboarding_progress')
        .upsert([
          {
            tenantId: businessId,
            step: currentStep,
            completed: true,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ], {
          onConflict: 'tenantId,step'
        });
      
      // Navigate to next step based on current step
      switch (currentStep) {
        case 'welcome':
          navigate('/onboarding/business');
          break;
        case 'business':
          navigate('/onboarding/services');
          break;
        case 'services':
          navigate('/onboarding/professionals');
          break;
        case 'professionals':
          navigate('/onboarding/schedule');
          break;
        case 'schedule':
          navigate('/onboarding/complete');
          break;
        case 'complete':
          navigate('/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error skipping step:', error);
      toast.error("Erro ao pular etapa");
    } finally {
      setLoading(false);
    }
  };
  
  const handleFinishOnboarding = async () => {
    if (!businessId) return;
    
    setLoading(true);
    try {
      // Mark all steps as completed
      const steps = ['welcome', 'business', 'services', 'professionals', 'schedule', 'complete'];
      
      const upsertPromises = steps.map(step => 
        supabase
          .from('onboarding_progress')
          .upsert({
            tenantId: businessId,
            step,
            completed: true,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }, {
            onConflict: 'tenantId,step'
          })
      );
      
      await Promise.all(upsertPromises);
      
      // Set business as active
      await supabase
        .from('businesses')
        .update({ status: 'active' })
        .eq('id', businessId);
      
      toast.success("Configuração concluída com sucesso!");
      navigate('/dashboard');
    } catch (error) {
      console.error('Error finishing onboarding:', error);
      toast.error("Erro ao finalizar configuração");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateDefaultServices = async () => {
    if (!businessId) {
      toast.error("ID do negócio não encontrado");
      return;
    }
    
    setLoading(true);
    try {
      // Create service categories
      const { data: categoryData, error: categoryError } = await supabase
        .from('service_categories')
        .insert([
          { 
            tenantId: businessId,
            name: 'Cortes',
            description: 'Cortes de cabelo e barba',
            order: 1,
            isActive: true
          },
          {
            tenantId: businessId,
            name: 'Tratamentos',
            description: 'Tratamentos para cabelo e barba',
            order: 2,
            isActive: true
          }
        ])
        .select();
      
      if (categoryError) throw categoryError;
      
      if (categoryData && categoryData.length > 0) {
        const haircutsCategoryId = categoryData[0].id;
        const treatmentsCategoryId = categoryData[1].id;
        
        // Create default services
        const defaultServices = [
          {
            business_id: businessId,
            name: 'Corte de Cabelo',
            description: 'Corte masculino tradicional',
            duration: 30,
            price: 35,
            categoryId: haircutsCategoryId
          },
          {
            business_id: businessId,
            name: 'Barba',
            description: 'Aparo e modelagem de barba',
            duration: 20,
            price: 25,
            categoryId: haircutsCategoryId
          },
          {
            business_id: businessId,
            name: 'Hidratação',
            description: 'Tratamento hidratante para cabelos',
            duration: 45,
            price: 50,
            categoryId: treatmentsCategoryId
          }
        ];
        
        const { error: servicesError } = await supabase
          .from('services')
          .insert(defaultServices);
          
        if (servicesError) throw servicesError;
        
        toast.success("Serviços padrão criados com sucesso!");
        
        // Mark step as completed
        await supabase
          .from('onboarding_progress')
          .upsert({
            tenantId: businessId,
            step: 'services',
            completed: true,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }, {
            onConflict: 'tenantId,step'
          });
        
        // Navigate to next step
        navigate('/onboarding/professionals');
      }
    } catch (error) {
      console.error('Error creating default services:', error);
      toast.error("Erro ao criar serviços padrão");
    } finally {
      setLoading(false);
    }
  };
  
  // Render appropriate buttons based on current step
  const renderButtons = () => {
    if (currentStep === 'complete') {
      return (
        <Button 
          onClick={handleFinishOnboarding}
          disabled={loading || isSubmitting}
          className="ml-auto"
        >
          {loading || isSubmitting ? "Processando..." : "Finalizar e Ir para o Dashboard"}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      );
    }
    
    if (currentStep === 'services') {
      return (
        <>
          <Button 
            variant="outline" 
            onClick={onPrevious}
            disabled={loading || isSubmitting}
          >
            Voltar
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleCreateDefaultServices}
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? "Criando..." : "Criar Serviços Padrão"}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleSkip}
            disabled={loading || isSubmitting}
          >
            Pular
          </Button>
          
          <Button 
            onClick={onNext}
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? "Processando..." : "Continuar"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </>
      );
    }
    
    // Default buttons for most steps
    return (
      <>
        {onPrevious && (
          <Button 
            variant="outline" 
            onClick={onPrevious}
            disabled={loading || isSubmitting}
          >
            Voltar
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={handleSkip}
          disabled={loading || isSubmitting}
          className="ml-auto"
        >
          Pular
        </Button>
        
        {onNext && (
          <Button 
            onClick={onNext}
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? "Processando..." : "Continuar"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </>
    );
  };
  
  return (
    <div className="flex justify-between pt-6">
      {renderButtons()}
    </div>
  );
}
