
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { toast } from 'sonner';

export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  bio?: string;
  photoUrl?: string;
  specialties?: string[];
  commissionPercentage?: number;
  hireDate?: string;
  status?: string;
  businessId: string;
}

export const useProfessionalOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { businessId } = useTenant();

  const createProfessional = async (professionalData: Omit<Professional, 'id' | 'businessId'>) => {
    if (!businessId) {
      toast.error('Business ID não encontrado');
      return null;
    }

    setIsLoading(true);
    try {
      // Generate required IDs
      const professionalId = crypto.randomUUID();
      const tenantId = businessId;
      const establishmentId = crypto.randomUUID(); // In a real app, this should come from existing establishments

      const { data, error } = await supabase
        .from('professionals')
        .insert({
          id: professionalId,
          tenantId: tenantId,
          establishmentId: establishmentId,
          business_id: businessId,
          name: professionalData.name,
          email: professionalData.email,
          phone: professionalData.phone,
          bio: professionalData.bio,
          avatar: professionalData.photoUrl,
          status: professionalData.status || 'active',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Profissional criado com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Error creating professional:', error);
      toast.error('Erro ao criar profissional');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfessional = async (id: string, updates: Partial<Professional>) => {
    if (!businessId) {
      toast.error('Business ID não encontrado');
      return null;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('professionals')
        .update({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          bio: updates.bio,
          avatar: updates.photoUrl,
          status: updates.status,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('business_id', businessId)
        .select()
        .single();

      if (error) throw error;

      toast.success('Profissional atualizado com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Error updating professional:', error);
      toast.error('Erro ao atualizar profissional');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProfessional = async (id: string) => {
    if (!businessId) {
      toast.error('Business ID não encontrado');
      return false;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id)
        .eq('business_id', businessId);

      if (error) throw error;

      toast.success('Profissional removido com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error deleting professional:', error);
      toast.error('Erro ao remover profissional');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createProfessional,
    updateProfessional,
    deleteProfessional,
    isLoading,
  };
};
