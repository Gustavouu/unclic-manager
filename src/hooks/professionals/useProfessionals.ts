
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/database.types';

export type Professional = Database['public']['Tables']['professionals']['Row'];

// Temporary business ID for demo purposes
const TEMP_BUSINESS_ID = "00000000-0000-0000-0000-000000000000";

export function useProfessionals(options?: { activeOnly?: boolean }) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let query = supabase
          .from('professionals')
          .select('*')
          .eq('business_id', TEMP_BUSINESS_ID);

        if (options?.activeOnly) {
          query = query.eq('status', 'active');
        }

        const { data, error } = await query.order('name');

        if (error) throw new Error(error.message);
        
        setProfessionals(data || []);
      } catch (err) {
        console.error('Error fetching professionals:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching professionals'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [options?.activeOnly]);

  const addProfessional = async (professional: Omit<Professional, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .insert({
          ...professional,
          business_id: TEMP_BUSINESS_ID
        })
        .select()
        .single();

      if (error) throw error;
      
      setProfessionals(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding professional:', error);
      throw error;
    }
  };

  const updateProfessional = async (id: string, updates: Partial<Professional>) => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .update(updates)
        .eq('id', id)
        .eq('business_id', TEMP_BUSINESS_ID)
        .select()
        .single();

      if (error) throw error;
      
      setProfessionals(prev => 
        prev.map(professional => professional.id === id ? data : professional)
      );
      
      return data;
    } catch (error) {
      console.error('Error updating professional:', error);
      throw error;
    }
  };

  const deleteProfessional = async (id: string) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id)
        .eq('business_id', TEMP_BUSINESS_ID);

      if (error) throw error;
      
      setProfessionals(prev => prev.filter(professional => professional.id !== id));
    } catch (error) {
      console.error('Error deleting professional:', error);
      throw error;
    }
  };

  return {
    professionals,
    loading,
    error,
    addProfessional,
    updateProfessional,
    deleteProfessional
  };
}
