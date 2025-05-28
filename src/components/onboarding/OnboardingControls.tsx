
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useTenant } from "@/contexts/TenantContext";
import { v4 as uuidv4 } from 'uuid';

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
      // Try to create a tenant record first if it doesn't exist
      try {
        const { error: tenantError } = await supabase
          .from('tenants')
          .upsert([
            {
              id: businessId,
              name: 'Estabelecimento',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ], {
            onConflict: 'id'
          });
        
        if (tenantError) {
          console.warn('Warning creating tenant:', tenantError);
        }
      } catch (tenantErr) {
        console.warn('Could not create tenant record:', tenantErr);
      }
      
      // Navigate to next step without saving to onboarding_progress for now
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
    if (!businessId) {
      toast.error("ID do negócio não encontrado. Não foi possível finalizar o onboarding.");
      return;
    }
    
    setLoading(true);
    try {
      toast.info("Finalizando configuração do estabelecimento...");
      
      // First try to create tenant record if it doesn't exist
      try {
        const { error: tenantError } = await supabase
          .from('tenants')
          .upsert([
            {
              id: businessId,
              name: 'Estabelecimento',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ], {
            onConflict: 'id'
          });
        
        if (tenantError) {
          console.warn('Warning creating tenant:', tenantError);
        } else {
          console.log('Tenant record created/updated successfully');
        }
      } catch (tenantErr) {
        console.warn('Could not create tenant record:', tenantErr);
      }
      
      // Ativar o negócio
      const { error: businessError } = await supabase
        .from('businesses')
        .update({ status: 'active' })
        .eq('id', businessId);
        
      if (businessError) {
        console.error('Error updating business status:', businessError);
        throw businessError;
      }
      
      toast.success("Estabelecimento ativado com sucesso!");
      
      // Clear onboarding data from localStorage
      localStorage.removeItem('unclic-manager-onboarding');
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao finalizar onboarding:', error);
      toast.error("Erro ao finalizar configuração: " + (error?.message || error));
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
    // Aceita tanto string 'complete' quanto o índice do último step (4 ou 5)
    const isLastStep = currentStep === 'complete' || currentStep === 4 || currentStep === '4' || currentStep === 5 || currentStep === '5';
    if (isLastStep) {
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
