
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
        return [...safeArray, newProfessional];
      });
      
      return newProfessional;
    } catch (error) {
      console.error("Erro ao adicionar profissional:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Atualizar profissional
  const updateProfessional = useCallback(async (id: string, data: Partial<Professional>) => {
    setIsLoading(true);
    
    try {
      // Simular requisição
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProfessionals(prev => {
        const updated = prev.map(p => p.id === id ? { ...p, ...data } : p);
        return updated;
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar profissional:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Atualizar status do profissional
  const updateProfessionalStatus = useCallback(async (id: string, status: ProfessionalStatus) => {
    setIsLoading(true);
    
    try {
      // Simular requisição
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProfessionals(prev => {
        const updated = prev.map(p => p.id === id ? { ...p, status } : p);
        return updated;
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Remover profissional
  const removeProfessional = useCallback(async (id: string) => {
    setIsLoading(true);
    
    try {
      // Simular requisição
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProfessionals(prev => {
        const filtered = prev.filter(p => p.id !== id);
        return filtered;
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao remover profissional:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    professionals,
    isLoading,
    addProfessional,
    updateProfessional,
    updateProfessionalStatus,
    removeProfessional
  };
};
