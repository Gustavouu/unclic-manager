
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  rating?: number;
  total_reviews?: number;
  status: string;
  working_hours?: any;
  business_id: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

  const fetchProfessionals = async () => {
    if (!businessId) {
      setProfessionals([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching professionals for business ID:', businessId);
      
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('business_id', businessId)
        .eq('isActive', true)
        .order('name', { ascending: true });
      
      if (error) {
        console.error("Error fetching professionals:", error);
        throw error;
      }
      
      setProfessionals(data || []);
      console.log(`Successfully loaded ${(data || []).length} professionals`);
    } catch (err) {
      console.error("Error in fetchProfessionals:", err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar profissionais';
      setError(errorMessage);
      setProfessionals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [businessId]);

  const createProfessional = async (professionalData: Omit<Professional, 'id' | 'created_at' | 'updated_at' | 'business_id'>) => {
    if (!businessId) throw new Error('No business selected');
    
    const { data, error } = await supabase
      .from('professionals')
      .insert({
        ...professionalData,
        business_id: businessId,
        tenantId: businessId, // For compatibility
        establishmentId: businessId, // For compatibility
      })
      .select()
      .single();

    if (error) throw error;
    
    await fetchProfessionals();
    return data;
  };

  const updateProfessional = async (id: string, professionalData: Partial<Professional>) => {
    const { error } = await supabase
      .from('professionals')
      .update(professionalData)
      .eq('id', id);

    if (error) throw error;
    
    await fetchProfessionals();
  };

  const deleteProfessional = async (id: string) => {
    const { error } = await supabase
      .from('professionals')
      .update({ isActive: false })
      .eq('id', id);

    if (error) throw error;
    
    await fetchProfessionals();
  };

  return {
    professionals,
    isLoading,
    error,
    refetch: fetchProfessionals,
    createProfessional,
    updateProfessional,
    deleteProfessional,
  };
};
