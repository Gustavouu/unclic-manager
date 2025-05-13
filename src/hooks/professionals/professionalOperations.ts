
import { supabase } from "@/integrations/supabase/client";
import { Professional, ProfessionalFormData } from "./types";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import { useState } from "react";

export const useProfessionalOperations = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentBusiness } = useTenant();
  const businessId = currentBusiness?.id;

  const fetchProfessionals = async (): Promise<Professional[]> => {
    setIsLoading(true);
    setError(null);

    try {
      // First try to fetch from 'professionals' table (modern schema)
      let { data: professionals, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("business_id", businessId);

      // If that fails or returns empty, try 'profissionais' table (legacy schema)
      if (error || !professionals || professionals.length === 0) {
        const { data: profissionais, error: profissionaisError } = await supabase
          .from("profissionais")
          .select("*")
          .eq("id_negocio", businessId);

        if (profissionaisError) {
          console.error("Error fetching profissionais:", profissionaisError);
          throw profissionaisError;
        }

        // Map legacy schema to modern schema
        professionals = profissionais?.map((prof) => ({
          id: prof.id,
          name: prof.nome,
          email: prof.email,
          phone: prof.telefone,
          photo_url: prof.foto_url,
          photoUrl: prof.foto_url, // For backward compatibility
          position: prof.cargo,
          specialties: prof.especializacoes,
          commission_percentage: prof.comissao_percentual,
          isActive: prof.ativo,
          business_id: prof.id_negocio,
        })) || [];
      }

      return professionals;
    } catch (error: any) {
      setError(error);
      toast({
        description: `Erro ao carregar profissionais: ${error.message}`,
        variant: "destructive",
      });
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
        ...data,
        business_id: businessId,
      };

      // Insert the professional data
      const { data: newProfessional, error } = await supabase
        .from("professionals")
        .insert([professionalData])
        .select()
        .single();

      if (error) throw error;

      toast({
        description: "Profissional adicionado com sucesso!",
      });

      return newProfessional;
    } catch (error: any) {
      setError(error);
      toast({
        description: `Erro ao criar profissional: ${error.message}`,
        variant: "destructive",
      });
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
          ...data,
          business_id: businessId, // Ensure business_id is correct
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast({
        description: "Profissional atualizado com sucesso!",
      });

      return updatedProfessional;
    } catch (error: any) {
      setError(error);
      toast({
        description: `Erro ao atualizar profissional: ${error.message}`,
        variant: "destructive",
      });
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

      toast({
        description: "Profissional removido com sucesso!",
      });

      return true;
    } catch (error: any) {
      setError(error);
      toast({
        description: `Erro ao remover profissional: ${error.message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchProfessionals,
    createProfessional,
    updateProfessional,
    deleteProfessional,
    isLoading,
    error
  };
};
