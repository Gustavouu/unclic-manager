
import { supabase } from "@/integrations/supabase/client";
import { Professional, ProfessionalFormData, ProfessionalStatus } from "./types";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import { useState } from "react";

export const useProfessionalOperations = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { businessId } = useTenant();
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  const fetchProfessionals = async (): Promise<Professional[]> => {
    setIsLoading(true);
    setError(null);

    try {
      // First try to fetch from 'professionals' table (modern schema)
      let { data: professionalsData, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("business_id", businessId);

      // If that fails or returns empty, try 'funcionarios' table (legacy schema)
      if (error || !professionalsData || professionalsData.length === 0) {
        const { data: funcionarios, error: funcionariosError } = await supabase
          .from("funcionarios")
          .select("id, nome, email, telefone, foto_url, cargo, comissao_percentual, status")
          .eq("id_negocio", businessId);

        if (funcionariosError) {
          console.error("Error fetching funcionarios:", funcionariosError);
          throw funcionariosError;
        }

        // Map legacy schema to modern schema
        professionalsData = funcionarios?.map((prof) => ({
          id: prof.id,
          name: prof.nome,
          email: prof.email,
          phone: prof.telefone,
          photo_url: prof.foto_url,
          position: prof.cargo,
          specialties: [],
          commission_percentage: prof.comissao_percentual,
          status: prof.status === 'ativo' ? ProfessionalStatus.ACTIVE : ProfessionalStatus.INACTIVE,
          business_id: businessId,
        })) || [];
      }

      setProfessionals(professionalsData);
      return professionalsData;
    } catch (error: any) {
      setError(error);
      toast.error(`Erro ao carregar profissionais: ${error.message}`);
      console.error("Error in fetchProfessionals:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createProfessional = async (data: ProfessionalFormData): Promise<Professional | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Add business ID to the professional data
      const professionalData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        photo_url: data.photo_url,
        bio: data.bio,
        specialties: data.specialties,
        status: data.status,
        commission_percentage: data.commission_percentage,
        hire_date: data.hire_date,
        working_hours: data.working_hours,
        business_id: businessId,
      };

      // Insert the professional data
      const { data: newProfessional, error } = await supabase
        .from("professionals")
        .insert([professionalData])
        .select()
        .single();

      if (error) throw error;

      toast.success("Profissional adicionado com sucesso!");

      if (newProfessional) {
        setProfessionals(prev => [...prev, newProfessional as Professional]);
      }

      return newProfessional as Professional;
    } catch (error: any) {
      setError(error);
      toast.error(`Erro ao criar profissional: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfessional = async (id: string, data: Partial<Professional>): Promise<Professional | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Update the professional data
      const { data: updatedProfessional, error } = await supabase
        .from("professionals")
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          position: data.position,
          photo_url: data.photo_url,
          bio: data.bio,
          specialties: data.specialties,
          status: data.status,
          commission_percentage: data.commission_percentage,
          hire_date: data.hire_date,
          working_hours: data.working_hours,
          business_id: businessId,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast.success("Profissional atualizado com sucesso!");

      if (updatedProfessional) {
        setProfessionals(prev => 
          prev.map(p => p.id === id ? updatedProfessional as Professional : p)
        );
      }

      return updatedProfessional as Professional;
    } catch (error: any) {
      setError(error);
      toast.error(`Erro ao atualizar profissional: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProfessional = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("professionals")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Profissional removido com sucesso!");

      setProfessionals(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error: any) {
      setError(error);
      toast.error(`Erro ao remover profissional: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getProfessionalById = (id: string): Professional | undefined => {
    return professionals.find(p => p.id === id);
  };

  const updateProfessionalStatus = async (id: string, status: string): Promise<boolean> => {
    return updateProfessional(id, { status: status as any })
      .then(() => true)
      .catch(() => false);
  };

  return {
    professionals,
    fetchProfessionals,
    createProfessional,
    addProfessional: createProfessional,
    updateProfessional,
    deleteProfessional,
    removeProfessional: deleteProfessional,
    getProfessionalById,
    updateProfessionalStatus,
    isLoading,
    error
  };
};
