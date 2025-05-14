
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { Professional } from './types';

export const useProfessionals = (options?: { 
  activeOnly?: boolean, 
  withServices?: boolean 
}) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();
  
  const activeOnly = options?.activeOnly ?? true;
  const withServices = options?.withServices ?? false;

  useEffect(() => {
    const fetchProfessionals = async () => {
      if (!businessId) {
        setLoading(false);
        setProfessionals([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Try professionals table first (new schema)
        try {
          let query = supabase
            .from('professionals')
            .select('*')
            .eq('business_id', businessId);
            
          if (activeOnly) {
            query = query.eq('status', 'active');
          }
            
          const { data, error } = await query;
            
          if (!error) {
            setProfessionals(data || []);
            setLoading(false);
            return;
          }
        } catch (profError) {
          console.error('Error fetching professionals:', profError);
        }
        
        // Try funcionarios table (legacy schema)
        try {
          let query = supabase
            .from('funcionarios')
            .select('id, nome as name, position as cargo, photo_url, specialties as especialidades')
            .eq('id_negocio', businessId);
            
          if (activeOnly) {
            query = query.eq('status', 'ativo');
          }
            
          const { data, error } = await query;
            
          if (!error) {
            const mappedData = data?.map(item => ({
              id: item.id,
              name: item.name,
              position: item.cargo,
              photo_url: item.photo_url,
              specialties: item.especialidades,
              business_id: businessId
            })) || [];
            
            setProfessionals(mappedData);
            setLoading(false);
            return;
          }
        } catch (funcError) {
          console.error('Error fetching funcionarios:', funcError);
        }
        
        // If both tables failed, return empty array
        setProfessionals([]);
        
      } catch (err: any) {
        console.error('Error in useProfessionals:', err);
        setError(err.message || 'Failed to fetch professionals');
        setProfessionals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [businessId, activeOnly, withServices]);

  return { professionals, loading, error };
};
