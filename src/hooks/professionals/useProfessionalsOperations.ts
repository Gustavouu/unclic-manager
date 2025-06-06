
import { useState } from 'react';
import { ProfessionalService } from '@/services/professional/professionalService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { toast } from 'sonner';
import type { Professional, ProfessionalFormData } from '@/types/professional';

export const useProfessionalsOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { businessId } = useCurrentBusiness();
  const professionalService = ProfessionalService.getInstance();

  const createProfessional = async (professionalData: ProfessionalFormData): Promise<Professional | null> => {
    if (!businessId) {
      toast.error('Business ID não encontrado');
      return null;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Creating professional:', professionalData);
      const result = await professionalService.create({ ...professionalData, business_id: businessId });
      toast.success('Profissional criado com sucesso!');
      return result;
    } catch (error: any) {
      console.error('Error creating professional:', error);
      toast.error('Erro ao criar profissional');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProfessional = async (professionalId: string, professionalData: Partial<ProfessionalFormData>): Promise<Professional | null> => {
    setIsSubmitting(true);
    try {
      console.log('Updating professional:', professionalId, professionalData);
      const result = await professionalService.update(professionalId, professionalData);
      toast.success('Profissional atualizado com sucesso!');
      return result;
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
      await professionalService.delete(professionalId);
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
