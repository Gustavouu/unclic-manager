
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
      // Try to fetch from 'funcionarios' table (legacy schema)
      const { data: funcionarios, error: funcionariosError } = await supabase
        .from("funcionarios")
        .select("id, nome, email, telefone, foto_url, cargo, comissao_percentual, status")
        .eq("id_negocio", businessId);

      if (funcionariosError) {
        console.error("Error fetching funcionarios:", funcionariosError);
        throw funcionariosError;
      }

      // Map legacy schema to modern schema
      const professionalsData = funcionarios?.map((prof) => ({
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
      // Insert into funcionarios table using legacy schema
      const { data: newProfessional, error } = await supabase
        .from("funcionarios")
        .insert([{
          nome: data.name,
          email: data.email,
          telefone: data.phone,
          cargo: data.position,
          foto_url: data.photo_url,
          bio: data.bio,
          comissao_percentual: data.commission_percentage,
          status: data.status === ProfessionalStatus.ACTIVE ? 'ativo' : 'inativo',
          id_negocio: businessId,
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success("Profissional adicionado com sucesso!");

      if (newProfessional) {
        const mappedProfessional: Professional = {
          id: newProfessional.id,
          name: newProfessional.nome,
          email: newProfessional.email,
          phone: newProfessional.telefone,
          photo_url: newProfessional.foto_url,
          position: newProfessional.cargo,
          specialties: [],
          commission_percentage: newProfessional.comissao_percentual,
          status: newProfessional.status === 'ativo' ? ProfessionalStatus.ACTIVE : ProfessionalStatus.INACTIVE,
          business_id: businessId,
        };
        
        setProfessionals(prev => [...prev, mappedProfessional]);
        return mappedProfessional;
      }

      return null;
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
      // Update using funcionarios table schema
      const { data: updatedProfessional, error } = await supabase
        .from("funcionarios")
        .update({
          nome: data.name,
          email: data.email,
          telefone: data.phone,
          cargo: data.position,
          foto_url: data.photo_url,
          comissao_percentual: data.commission_percentage,
          status: data.status === ProfessionalStatus.ACTIVE ? 'ativo' : 'inativo',
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast.success("Profissional atualizado com sucesso!");

      if (updatedProfessional) {
        const mappedProfessional: Professional = {
          id: updatedProfessional.id,
          name: updatedProfessional.nome,
          email: updatedProfessional.email,
          phone: updatedProfessional.telefone,
          photo_url: updatedProfessional.foto_url,
          position: updatedProfessional.cargo,
          specialties: [],
          commission_percentage: updatedProfessional.comissao_percentual,
          status: updatedProfessional.status === 'ativo' ? ProfessionalStatus.ACTIVE : ProfessionalStatus.INACTIVE,
          business_id: businessId,
        };
        
        setProfessionals(prev => 
          prev.map(p => p.id === id ? mappedProfessional : p)
        );
        
        return mappedProfessional;
      }

      return null;
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
        .from("funcionarios")
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
