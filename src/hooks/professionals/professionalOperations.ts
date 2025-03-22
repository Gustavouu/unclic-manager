import { useState, useCallback } from "react";
import { Professional, ProfessionalCreateForm, ProfessionalStatus } from "./types";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { initialProfessionals } from "./mockData";

export const useProfessionalOperations = () => {
  const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Adicionar novo profissional
  const addProfessional = useCallback(async (data: ProfessionalCreateForm) => {
    setIsLoading(true);
    
    try {
      // Simular requisição
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProfessional: Professional = {
        id: uuidv4(),
        name: data.name,
        role: data.role,
        email: data.email || "",
        phone: data.phone || "",
        specialties: Array.isArray(data.specialties) ? data.specialties : [],
        bio: data.bio || "",
        status: "active",
        commissionPercentage: data.commissionPercentage || 0,
        hireDate: new Date().toISOString().split('T')[0]
      };
      
      // Atualizar o estado com o novo profissional
      setProfessionals(prev => [...prev, newProfessional]);
      
      console.log("Profissional adicionado:", newProfessional);
      console.log("Lista atualizada:", [...professionals, newProfessional]);
      
      toast({
        title: "Colaborador adicionado",
        description: `${data.name} foi adicionado com sucesso!`
      });
      
      return newProfessional;
    } catch (error) {
      console.error("Erro ao adicionar profissional:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o colaborador.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [professionals, toast]);
  
  // Atualizar profissional
  const updateProfessional = useCallback(async (id: string, data: Partial<Professional>) => {
    setIsLoading(true);
    
    try {
      // Simular requisição
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfessionals(prev => 
        prev.map(p => p.id === id ? { ...p, ...data } : p)
      );
      
      toast({
        title: "Colaborador atualizado",
        description: "As informações foram atualizadas com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o colaborador.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // Atualizar status do profissional
  const updateProfessionalStatus = useCallback(async (id: string, status: ProfessionalStatus) => {
    setIsLoading(true);
    
    try {
      // Simular requisição
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfessionals(prev => 
        prev.map(p => p.id === id ? { ...p, status } : p)
      );
      
      const statusLabels = {
        active: "Ativo",
        vacation: "De férias",
        leave: "Licença",
        inactive: "Inativo"
      };
      
      toast({
        title: "Status atualizado",
        description: `Colaborador agora está: ${statusLabels[status]}`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // Remover profissional
  const removeProfessional = useCallback(async (id: string) => {
    setIsLoading(true);
    
    try {
      // Simular requisição
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const professional = professionals.find(p => p.id === id);
      setProfessionals(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: "Colaborador removido",
        description: `${professional?.name} foi removido com sucesso!`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover o colaborador.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [professionals, toast]);

  return {
    professionals,
    isLoading,
    addProfessional,
    updateProfessional,
    updateProfessionalStatus,
    removeProfessional
  };
};
