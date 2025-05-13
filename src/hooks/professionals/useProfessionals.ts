
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Professional, UseProfessionalsReturn } from './types';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/useToast';
import { createProfessional, updateProfessional, deleteProfessional } from './professionalOperations';

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
  const { tenant } = useTenant();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!tenant?.id) {
          setProfessionals([]);
          return;
        }

        const { data, error } = await supabase
          .from('professionals')
          .select('*')
          .eq('tenantId', tenant.id);

        if (error) throw error;
        setProfessionals(data || []);
      } catch (err: any) {
        setError(err);
        toast({
          title: 'Erro',
          description: `Falha ao carregar profissionais: ${err.message}`,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [tenant?.id, toast]);

  const handleCreateProfessional = async (professionalData: any) => {
    try {
      setLoading(true);
      const newProfessional = await createProfessional(professionalData, tenant?.id);
      setProfessionals(prev => [...prev, newProfessional]);
      toast({
        title: 'Sucesso',
        description: 'Profissional criado com sucesso!',
      });
      return newProfessional;
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Erro',
        description: `Falha ao criar profissional: ${err.message}`,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfessional = async (id: string, updates: Partial<Professional>) => {
    try {
      setLoading(true);
      const updatedProfessional = await updateProfessional(id, updates);
      setProfessionals(prev => 
        prev.map(prof => prof.id === id ? { ...prof, ...updatedProfessional } : prof)
      );
      toast({
        title: 'Sucesso',
        description: 'Profissional atualizado com sucesso!',
      });
      return updatedProfessional;
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Erro',
        description: `Falha ao atualizar profissional: ${err.message}`,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfessional = async (id: string) => {
    try {
      setLoading(true);
      await deleteProfessional(id);
      setProfessionals(prev => prev.filter(prof => prof.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Profissional removido com sucesso!',
      });
      return true;
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Erro',
        description: `Falha ao remover profissional: ${err.message}`,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
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
    specialties: availableSpecialties
  };
};
