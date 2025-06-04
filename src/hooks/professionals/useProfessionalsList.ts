
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Professional } from '@/types/professional';

export const useProfessionalsList = () => {
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
      console.log('Fetching professionals for business:', businessId);
      
      // Try funcionarios table first, then fallback to professionals if it exists
      const { data: professionalsData, error: professionalsError } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('id_negocio', businessId)
        .order('criado_em', { ascending: false });

      if (professionalsError) {
        console.log('Error from professionals table:', professionalsError);
        throw professionalsError;
      }

      console.log('Fetched professionals:', professionalsData);
      setProfessionals(professionalsData || []);
    } catch (err) {
      console.error('Error fetching professionals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch professionals');
      setProfessionals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [businessId]);

  const searchProfessionals = async (searchTerm: string): Promise<Professional[]> => {
    if (!businessId || !searchTerm.trim()) {
      return professionals;
    }

    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('id_negocio', businessId)
        .or(`nome.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,cargo.ilike.%${searchTerm}%`)
        .order('criado_em', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error searching professionals:', error);
      return [];
    }
  };

  return {
    professionals,
    isLoading,
    error,
    refetch: fetchProfessionals,
    searchProfessionals,
  };
};
