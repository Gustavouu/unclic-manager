
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Professional, ProfessionalStatus } from './types';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';

export function useProfessionals(options?: { activeOnly?: boolean }) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  
  const { currentBusiness } = useTenant();
  const businessId = currentBusiness?.id;

  const fetchProfessionals = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!businessId) {
        throw new Error('No business selected');
      }

      // First try to fetch from 'professionals' table
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('business_id', businessId);

      if (error) throw error;

      setProfessionals(data || []);
      
      // Extract unique specialties
      const uniqueSpecialties = new Set<string>();
      data?.forEach(professional => {
        if (professional.specialties && Array.isArray(professional.specialties)) {
          professional.specialties.forEach(specialty => {
            uniqueSpecialties.add(specialty);
          });
        }
      });
      
      setSpecialties(Array.from(uniqueSpecialties));
      
      return data || [];
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast.error(`Failed to load professionals: ${err.message}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals, options?.activeOnly]);

  const createProfessional = async (data: Omit<Professional, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!businessId) {
        throw new Error('No business selected');
      }

      // Add business ID to the professional data
      const professionalData = {
        ...data,
        business_id: businessId,
      };

      const { data: newProfessional, error } = await supabase
        .from('professionals')
        .insert([professionalData])
        .select()
        .single();

      if (error) throw error;

      setProfessionals(prev => [...prev, newProfessional]);
      return newProfessional;
    } catch (error: any) {
      console.error('Error creating professional:', error);
      throw error;
    }
  };

  const updateProfessional = async (id: string, data: Partial<Professional>) => {
    try {
      if (!businessId) {
        throw new Error('No business selected');
      }

      const { data: updatedProfessional, error } = await supabase
        .from('professionals')
        .update({
          ...data,
          business_id: businessId,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProfessionals(prev => 
        prev.map(p => p.id === id ? updatedProfessional : p)
      );

      return updatedProfessional;
    } catch (error: any) {
      console.error('Error updating professional:', error);
      throw error;
    }
  };

  const deleteProfessional = async (id: string) => {
    try {
      if (!businessId) {
        throw new Error('No business selected');
      }

      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProfessionals(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error: any) {
      console.error('Error deleting professional:', error);
      throw error;
    }
  };

  return {
    professionals,
    specialties,
    isLoading,
    error,
    fetchProfessionals,
    createProfessional,
    updateProfessional,
    deleteProfessional
  };
}
