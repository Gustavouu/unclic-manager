
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTenant } from '@/contexts/TenantContext';
import { Professional, ProfessionalFormData, ProfessionalStatus } from './types';

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { businessId } = useTenant();
  
  const fetchProfessionals = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('business_id', businessId);
      
      if (error) {
        throw error;
      }
      
      setProfessionals(data || []);
      return data;
    } catch (err) {
      console.error('Error fetching professionals:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch professionals'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchProfessionalById = async (id: string): Promise<Professional | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('business_id', businessId)
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching professional:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch professional'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const createProfessional = async (professionalData: ProfessionalFormData): Promise<Professional | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('professionals')
        .insert([
          {
            ...professionalData,
            business_id: businessId,
            status: professionalData.status || ProfessionalStatus.ACTIVE
          }
        ])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setProfessionals(prev => [...prev, data]);
      toast.success('Profissional criado com sucesso');
      return data;
    } catch (err) {
      console.error('Error creating professional:', err);
      setError(err instanceof Error ? err : new Error('Failed to create professional'));
      toast.error('Erro ao criar profissional');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfessional = async (id: string, updates: Partial<ProfessionalFormData>): Promise<Professional | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('professionals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setProfessionals(prev => prev.map(professional => 
        professional.id === id ? data : professional
      ));
      toast.success('Profissional atualizado com sucesso');
      return data;
    } catch (err) {
      console.error('Error updating professional:', err);
      setError(err instanceof Error ? err : new Error('Failed to update professional'));
      toast.error('Erro ao atualizar profissional');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfessionalStatus = async (id: string, status: ProfessionalStatus): Promise<Professional | null> => {
    return updateProfessional(id, { status });
  };
  
  const deleteProfessional = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setProfessionals(prev => prev.filter(professional => professional.id !== id));
      toast.success('Profissional removido com sucesso');
      return true;
    } catch (err) {
      console.error('Error deleting professional:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete professional'));
      toast.error('Erro ao remover profissional');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const assignServiceToProfessional = async (professionalId: string, serviceId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('professional_services')
        .insert([
          {
            professional_id: professionalId,
            service_id: serviceId
          }
        ]);
      
      if (error) {
        throw error;
      }
      
      toast.success('Serviço atribuído com sucesso');
      return true;
    } catch (err) {
      console.error('Error assigning service:', err);
      setError(err instanceof Error ? err : new Error('Failed to assign service'));
      toast.error('Erro ao atribuir serviço');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeServiceFromProfessional = async (professionalId: string, serviceId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('professional_services')
        .delete()
        .eq('professional_id', professionalId)
        .eq('service_id', serviceId);
      
      if (error) {
        throw error;
      }
      
      toast.success('Serviço removido com sucesso');
      return true;
    } catch (err) {
      console.error('Error removing service:', err);
      setError(err instanceof Error ? err : new Error('Failed to remove service'));
      toast.error('Erro ao remover serviço');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getProfessionalServices = async (professionalId: string): Promise<any[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('professional_services')
        .select('service_id, services(*)')
        .eq('professional_id', professionalId);
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (err) {
      console.error('Error fetching professional services:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch professional services'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    professionals,
    isLoading,
    error,
    fetchProfessionals,
    fetchProfessionalById,
    createProfessional,
    updateProfessional,
    updateProfessionalStatus,
    deleteProfessional,
    assignServiceToProfessional,
    removeServiceFromProfessional,
    getProfessionalServices
  };
};
