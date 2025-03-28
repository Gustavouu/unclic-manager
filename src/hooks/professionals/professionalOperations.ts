
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
        hireDate: new Date().toISOString().split('T')[0],
        photoUrl: data.photoUrl || ""
      };
      
      // Atualizar o estado com o novo profissional de forma imutável
      setProfessionals(prevProfessionals => {
        // Garantir que prevProfessionals é um array antes de adicionar
        const safeArray = Array.isArray(prevProfessionals) ? prevProfessionals : [];
        const updatedArray = [...safeArray, newProfessional];
        
        console.log("Profissional adicionado:", newProfessional);
        console.log("Lista atual:", safeArray);
        console.log("Lista atualizada:", updatedArray);
        
        return updatedArray;
      });
      
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
  }, [toast]);
  
  // Atualizar profissional
  const updateProfessional = useCallback(async (id: string, data: Partial<Professional>) => {
    setIsLoading(true);
    
    try {
      // Simular requisição
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfessionals(prev => {
        const updated = prev.map(p => p.id === id ? { ...p, ...data } : p);
        console.log("Profissional atualizado:", id, data);
        console.log("Lista atualizada:", updated);
        return updated;
      });
      
      toast({
        title: "Colaborador atualizado",
        description: "As informações foram atualizadas com sucesso!"
      });
    } catch (error) {
      console.error("Erro ao atualizar profissional:", error);
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
      
      setProfessionals(prev => {
        const updated = prev.map(p => p.id === id ? { ...p, status } : p);
        console.log("Status do profissional atualizado:", id, status);
        console.log("Lista atualizada:", updated);
        return updated;
      });
      
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
      console.error("Erro ao atualizar status:", error);
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
      
      setProfessionals(prev => {
        const filtered = prev.filter(p => p.id !== id);
        console.log("Profissional removido:", id);
        console.log("Lista atualizada:", filtered);
        return filtered;
      });
      
      toast({
        title: "Colaborador removido",
        description: `${professional?.name} foi removido com sucesso!`
      });
    } catch (error) {
      console.error("Erro ao remover profissional:", error);
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
