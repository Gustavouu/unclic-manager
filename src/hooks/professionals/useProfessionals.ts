
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Professional } from './types';
import { useTenant } from '@/contexts/TenantContext';

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  const fetchProfessionals = useCallback(async () => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First try to fetch from new professionals table
      let { data: professionalsData, error: professionalsError } = await supabase
        .from('professionals')
        .select('*')
        .eq('tenantId', businessId);

      if (professionalsError) {
        // If error with new table, try legacy table
        const { data: legacyProfessionalsData, error: legacyError } = await supabase
          .from('funcionarios')
          .select('*')
          .eq('id_negocio', businessId);

        if (legacyError) {
          throw legacyError;
        }

        // Map legacy data to new structure
        professionalsData = legacyProfessionalsData?.map(pro => ({
          id: pro.id,
          name: pro.nome,
          specialties: pro.especializacoes,
          role: pro.cargo,
          email: pro.email,
          phone: pro.telefone
        })) || [];
      }

      setProfessionals(professionalsData || []);
    } catch (err: any) {
      console.error('Error fetching professionals:', err);
      setError(err.message || 'Failed to fetch professionals');
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  return { professionals, loading, error, fetchProfessionals };
};
