
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Professional } from "./types";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { toast } from "sonner";

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { businessId } = useCurrentBusiness();

  const fetchProfessionals = async () => {
    if (!businessId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('business_id', businessId)
        .order('name', { ascending: true });

      if (error) throw error;
      
      setProfessionals(data?.map(pro => ({
        ...pro,
        specialties: pro.specialties || [],
        isActive: pro.status === 'active' || pro.status === 'ativo',
        hire_date: pro.hire_date ? new Date(pro.hire_date) : undefined
      })) || []);
    } catch (error: any) {
      console.error("Error fetching professionals:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addProfessional = async (professional: Omit<Professional, 'id'>) => {
    if (!businessId) {
      toast.error("ID do negócio não disponível");
      return null;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('funcionarios')
        .insert({
          ...professional,
          business_id: businessId,
          status: professional.isActive !== false ? 'active' : 'inactive',
        })
        .select();

      if (error) throw error;
      
      if (data) {
        const newProfessional = {
          ...data[0],
          specialties: data[0].specialties || [],
          isActive: data[0].status === 'active' || data[0].status === 'ativo',
          hire_date: data[0].hire_date ? new Date(data[0].hire_date) : undefined
        } as Professional;
        
        setProfessionals(prev => [...prev, newProfessional]);
        toast.success("Profissional adicionado com sucesso!");
        return newProfessional;
      }
      
      return null;
    } catch (error: any) {
      toast.error(`Erro ao adicionar profissional: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfessional = async (id: string, updates: Partial<Professional>) => {
    try {
      const dbUpdates = { 
        ...updates, 
        status: updates.isActive !== undefined 
          ? (updates.isActive ? 'active' : 'inactive') 
          : undefined
      };
      
      // Remove isActive from the updates as it's not a column in the database
      if ('isActive' in dbUpdates) {
        delete dbUpdates.isActive;
      }
      
      const { error } = await supabase
        .from('funcionarios')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      
      setProfessionals(prev => prev.map(pro => 
        pro.id === id ? { ...pro, ...updates } : pro
      ));
      
      toast.success("Profissional atualizado com sucesso!");
      return true;
    } catch (error: any) {
      toast.error(`Erro ao atualizar profissional: ${error.message}`);
      return false;
    }
  };

  const deleteProfessional = async (id: string) => {
    try {
      const { error } = await supabase
        .from('funcionarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProfessionals(prev => prev.filter(pro => pro.id !== id));
      toast.success("Profissional removido com sucesso!");
      return true;
    } catch (error: any) {
      toast.error(`Erro ao remover profissional: ${error.message}`);
      return false;
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchProfessionals();
    }
  }, [businessId]);

  return {
    professionals,
    isLoading,
    addProfessional,
    updateProfessional,
    deleteProfessional,
    refreshProfessionals: fetchProfessionals
  };
};
