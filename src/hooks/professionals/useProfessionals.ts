
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Professional, UseProfessionalsReturn, ProfessionalCreateForm, PROFESSIONAL_STATUS, ProfessionalStatus } from './types';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner'; // Using sonner directly as it's available in the project

// Sample specialties data - could be fetched from the database in a real scenario
const availableSpecialties = [
  "Corte Masculino",
  "Corte Feminino",
  "Química",
  "Coloração",
  "Barba",
  "Tratamento Capilar",
  "Design de Sobrancelha",
  "Manicure",
  "Pedicure",
  "Depilação",
  "Maquiagem",
  "Massagem",
  "Limpeza de Pele",
  "Estética Corporal",
  "Drenagem Linfática"
];

export const useProfessionals = (): UseProfessionalsReturn => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBusiness, businessId } = useTenant() || { currentBusiness: null, businessId: null };

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!businessId) {
          setProfessionals([]);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('professionals')
          .select('*')
          .eq('tenantId', businessId);

        if (fetchError) throw fetchError;
        setProfessionals(data || []);
      } catch (err: any) {
        setError(err);
        toast.error(`Falha ao carregar profissionais: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [businessId]);

  // Create a new professional
  const handleCreateProfessional = async (professionalData: ProfessionalCreateForm): Promise<Professional> => {
    try {
      setLoading(true);
      
      // Prepare data for insertion
      const newProfData = {
        ...professionalData,
        tenantId: businessId,
        status: professionalData.status || PROFESSIONAL_STATUS.ACTIVE
      };
      
      const { data, error: createError } = await supabase
        .from('professionals')
        .insert([newProfData])
        .select()
        .single();
        
      if (createError) throw createError;
      
      const newProfessional = data as Professional;
      setProfessionals(prev => [...prev, newProfessional]);
      toast.success("Profissional criado com sucesso!");
      
      return newProfessional;
    } catch (err: any) {
      setError(err);
      toast.error(`Falha ao criar profissional: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing professional
  const handleUpdateProfessional = async (id: string, updates: Partial<Professional>): Promise<Professional> => {
    try {
      setLoading(true);
      
      const { data, error: updateError } = await supabase
        .from('professionals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (updateError) throw updateError;
      
      const updatedProfessional = data as Professional;
      setProfessionals(prev => 
        prev.map(prof => prof.id === id ? { ...prof, ...updatedProfessional } : prof)
      );
      
      toast.success("Profissional atualizado com sucesso!");
      return updatedProfessional;
    } catch (err: any) {
      setError(err);
      toast.error(`Falha ao atualizar profissional: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a professional
  const handleDeleteProfessional = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // In a real application, you might want to soft delete by updating the status
      const { error: deleteError } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);
        
      if (deleteError) throw deleteError;
      
      setProfessionals(prev => prev.filter(prof => prof.id !== id));
      toast.success("Profissional removido com sucesso!");
      return true;
    } catch (err: any) {
      setError(err);
      toast.error(`Falha ao remover profissional: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get a professional by ID
  const getProfessionalById = (id: string): Professional | undefined => {
    return professionals.find(prof => prof.id === id);
  };

  return {
    professionals,
    loading,
    error,
    createProfessional: handleCreateProfessional,
    updateProfessional: handleUpdateProfessional,
    deleteProfessional: handleDeleteProfessional,
    // Adding aliases to fix TypeScript errors
    addProfessional: handleCreateProfessional,
    removeProfessional: handleDeleteProfessional,
    isLoading: loading,
    specialties: availableSpecialties,
    getProfessionalById
  };
};
