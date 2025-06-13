
import { useState } from 'react';
import { BusinessData, ServiceData, StaffData, BusinessHours, CompletionResult } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useCompletion = (
  businessData: BusinessData,
  services: ServiceData[],
  staff: StaffData[],
  businessHours: BusinessHours | null
) => {
  const { user } = useAuth();
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<string>('');

  const completeOnboarding = async (): Promise<CompletionResult> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      setIsCompleting(true);
      setCompletionStatus('Validando dados...');

      // Validate required data
      if (!businessData.name || !businessData.adminEmail) {
        throw new Error('Nome do negócio e email são obrigatórios');
      }

      setCompletionStatus('Criando negócio...');

      // Call the create-business edge function
      const { data, error } = await supabase.functions.invoke('create-business', {
        body: {
          businessData: {
            name: businessData.name,
            email: businessData.adminEmail || businessData.email,
            phone: businessData.phone,
            address: businessData.address,
            addressNumber: businessData.addressNumber || businessData.number,
            addressComplement: businessData.addressComplement,
            neighborhood: businessData.neighborhood,
            city: businessData.city,
            state: businessData.state,
            zipCode: businessData.zipCode || businessData.cep,
            logoUrl: businessData.logoUrl,
            bannerUrl: businessData.bannerUrl,
            description: businessData.description,
          },
          userId: user.id
        }
      });

      if (error) {
        console.error('Error creating business:', error);
        throw new Error(`Erro ao criar negócio: ${error.message}`);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Erro desconhecido ao criar negócio');
      }

      const businessId = data.businessId;
      
      setCompletionStatus('Criando serviços...');

      // Create services if any
      if (services.length > 0) {
        for (const service of services) {
          try {
            const { error: serviceError } = await supabase
              .from('services')
              .insert({
                business_id: businessId,
                name: service.nome || service.name,
                description: service.descricao || service.description,
                price: service.preco || service.price,
                duration: service.duracao || service.duration,
                is_active: service.ativo !== undefined ? service.ativo : service.active !== undefined ? service.active : true,
                category: service.categoria || service.category,
              });

            if (serviceError) {
              console.error('Error creating service:', serviceError);
              // Don't fail the entire process for service creation errors
              toast.warning(`Erro ao criar serviço "${service.nome || service.name}": ${serviceError.message}`);
            }
          } catch (error) {
            console.error('Error in service creation:', error);
          }
        }
      }

      setCompletionStatus('Criando funcionários...');

      // Create staff members if any using the correct table name
      if (staff.length > 0) {
        for (const member of staff) {
          try {
            const professionalId = uuidv4();
            const { error: staffError } = await supabase
              .from('professionals')
              .insert({
                id: professionalId,
                business_id: businessId,
                tenantId: businessId,
                establishmentId: businessId,
                name: member.nome || member.name,
                email: member.email,
                phone: member.phone,
                bio: member.bio,
                avatar_url: member.foto_url || member.photo_url,
                isActive: member.ativo !== undefined ? member.ativo : member.active !== undefined ? member.active : true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });

            if (staffError) {
              console.error('Error creating staff member:', staffError);
              toast.warning(`Erro ao criar funcionário "${member.nome || member.name}": ${staffError.message}`);
            }
          } catch (error) {
            console.error('Error in staff creation:', error);
          }
        }
      }

      setCompletionStatus('Configurando horários...');

      // Save business hours if provided
      if (businessHours) {
        try {
          const { error: hoursError } = await supabase
            .from('business_settings')
            .update({
              notes: {
                business_hours: businessHours,
                onboarding_completed: true,
                completed_at: new Date().toISOString(),
              }
            })
            .eq('business_id', businessId);

          if (hoursError) {
            console.error('Error saving business hours:', hoursError);
          }
        } catch (error) {
          console.error('Error in business hours save:', error);
        }
      }

      setCompletionStatus('Finalizando...');

      // Clear any saved progress from localStorage
      localStorage.removeItem('unclic-manager-onboarding');

      toast.success('Negócio criado com sucesso!');

      return {
        success: true,
        businessId: businessId
      };

    } catch (error) {
      console.error('Error completing onboarding:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao completar configuração: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsCompleting(false);
      setCompletionStatus('');
    }
  };

  return {
    completeOnboarding,
    isCompleting,
    completionStatus,
  };
};
