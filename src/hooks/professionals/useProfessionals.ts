
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

  // Memoizar quais especialidades estão disponíveis
  const specialties = Array.from(new Set(professionals.flatMap(p => p.specialties || [])));

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
            query = query.eq('status', 'ACTIVE');
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
            .select('id, nome, cargo, foto_url, especialidades')
            .eq('id_negocio', businessId);
            
          if (activeOnly) {
            query = query.eq('status', 'ativo');
          }
            
          const { data, error } = await query;
            
          if (!error && data) {
            const mappedData = data.map(item => ({
              id: item.id,
              name: item.nome,
              position: item.cargo,
              photo_url: item.foto_url,
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

  // Fornece também as operações CRUD
  const createProfessional = async (data: any) => {
    try {
      const { data: newProfessional, error } = await supabase
        .from("professionals")
        .insert([{ ...data, business_id: businessId }])
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      setProfessionals(prev => [...prev, newProfessional]);
      
      return newProfessional;
    } catch (error) {
      console.error("Error creating professional:", error);
      throw error;
    }
  };
  
  const updateProfessional = async (id: string, data: any) => {
    try {
      const { data: updatedProfessional, error } = await supabase
        .from("professionals")
        .update(data)
        .eq("id", id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      setProfessionals(prev => 
        prev.map(p => p.id === id ? updatedProfessional : p)
      );
      
      return updatedProfessional;
    } catch (error) {
      console.error("Error updating professional:", error);
      throw error;
    }
  };
  
  const deleteProfessional = async (id: string) => {
    try {
      const { error } = await supabase
        .from("professionals")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      // Update local state
      setProfessionals(prev => prev.filter(p => p.id !== id));
      
      return true;
    } catch (error) {
      console.error("Error deleting professional:", error);
      throw error;
    }
  };

  return { 
    professionals, 
    loading, 
    isLoading: loading, 
    error,
    specialties,
    createProfessional,
    updateProfessional,
    deleteProfessional
  };
};
