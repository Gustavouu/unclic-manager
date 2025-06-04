
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Professional, ProfessionalFormData } from '@/types/professional';

export const useProfessionalOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { businessId } = useCurrentBusiness();

  const createProfessional = async (professionalData: ProfessionalFormData): Promise<Professional | null> => {
    if (!businessId) {
      toast.error('Business ID não encontrado');
      return null;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Creating professional:', professionalData);
      
      const { data, error } = await supabase
        .from('funcionarios')
        .insert({
          business_id: businessId,
          id_negocio: businessId,
          nome: professionalData.name,
          email: professionalData.email || null,
          telefone: professionalData.phone || null,
          cargo: professionalData.position || null,
          bio: professionalData.bio || null,
          foto_url: professionalData.photo_url || null,
          especializacoes: professionalData.specialties || [],
          comissao_percentual: professionalData.commission_percentage || 0,
          data_contratacao: professionalData.hire_date || null,
          status: professionalData.status || 'ativo',
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('Profissional criado com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Error creating professional:', error);
      toast.error('Erro ao criar profissional');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProfessional = async (professionalId: string, professionalData: ProfessionalFormData): Promise<Professional | null> => {
    setIsSubmitting(true);
    try {
      console.log('Updating professional:', professionalId, professionalData);
      
      const { data, error } = await supabase
        .from('funcionarios')
        .update({
          nome: professionalData.name,
          email: professionalData.email || null,
          telefone: professionalData.phone || null,
          cargo: professionalData.position || null,
          bio: professionalData.bio || null,
          foto_url: professionalData.photo_url || null,
          especializacoes: professionalData.specialties || [],
          comissao_percentual: professionalData.commission_percentage || 0,
          data_contratacao: professionalData.hire_date || null,
          status: professionalData.status || 'ativo',
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', professionalId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('Profissional atualizado com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Error updating professional:', error);
      toast.error('Erro ao atualizar profissional');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProfessional = async (professionalId: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      console.log('Deleting professional:', professionalId);
      
      const { error } = await supabase
        .from('funcionarios')
        .delete()
        .eq('id', professionalId);

      if (error) {
        throw error;
      }

      toast.success('Profissional excluído com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error deleting professional:', error);
      toast.error('Erro ao excluir profissional');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createProfessional,
    updateProfessional,
    deleteProfessional,
    isSubmitting,
  };
};
