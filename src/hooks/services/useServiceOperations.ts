
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Service, ServiceFormData } from '@/types/service';

export const useServiceOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { businessId } = useCurrentBusiness();

  const createService = async (serviceData: ServiceFormData): Promise<Service | null> => {
    if (!businessId) {
      toast.error('Business ID não encontrado');
      return null;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Creating service:', serviceData);
      
      const { data, error } = await supabase
        .from('services')
        .insert({
          id_negocio: businessId,
          nome: serviceData.name,
          descricao: serviceData.description || null,
          duracao: serviceData.duration,
          preco: serviceData.price,
          category: serviceData.category || 'Geral',
          ativo: true,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Map the response to include both Portuguese and English field names
      const serviceResult: Service = {
        ...data,
        categoria: data.category || 'Geral',
        name: data.nome,
        description: data.descricao,
        duration: data.duracao,
        price: data.preco,
        is_active: data.ativo,
        created_at: data.criado_em,
        updated_at: data.atualizado_em,
      };

      toast.success('Serviço criado com sucesso!');
      return serviceResult;
    } catch (error: any) {
      console.error('Error creating service:', error);
      toast.error('Erro ao criar serviço');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateService = async (serviceId: string, serviceData: ServiceFormData): Promise<Service | null> => {
    setIsSubmitting(true);
    try {
      console.log('Updating service:', serviceId, serviceData);
      
      const { data, error } = await supabase
        .from('services')
        .update({
          nome: serviceData.name,
          descricao: serviceData.description || null,
          duracao: serviceData.duration,
          preco: serviceData.price,
          category: serviceData.category || 'Geral',
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', serviceId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Map the response to include both Portuguese and English field names
      const serviceResult: Service = {
        ...data,
        categoria: data.category || 'Geral',
        name: data.nome,
        description: data.descricao,
        duration: data.duracao,
        price: data.preco,
        is_active: data.ativo,
        created_at: data.criado_em,
        updated_at: data.atualizado_em,
      };

      toast.success('Serviço atualizado com sucesso!');
      return serviceResult;
    } catch (error: any) {
      console.error('Error updating service:', error);
      toast.error('Erro ao atualizar serviço');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteService = async (serviceId: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      console.log('Deleting service:', serviceId);
      
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) {
        throw error;
      }

      toast.success('Serviço excluído com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast.error('Erro ao excluir serviço');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createService,
    updateService,
    deleteService,
    isSubmitting,
  };
};
