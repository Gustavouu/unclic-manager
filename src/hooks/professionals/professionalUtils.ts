
import { useMemo, useCallback } from "react";
import { Professional } from "./types";

export const useProfessionalUtils = (professionals: Professional[] = []) => {
  // Garantir que professionals é sempre um array
  const safeProfessionals = Array.isArray(professionals) ? professionals : [];
  
  // Extrair todas as especialidades dos profissionais com verificação de null
  const specialties = useMemo(() => {
    const allSpecialties = safeProfessionals.flatMap(p => Array.isArray(p.specialties) ? p.specialties : []);
    return [...new Set(allSpecialties)];
  }, [safeProfessionals]);
  
  // Buscar profissional por ID com verificação de null
  const getProfessionalById = useCallback((id: string) => {
    return safeProfessionals.find(p => p.id === id);
  }, [safeProfessionals]);

  return {
    specialties,
    getProfessionalById
  };
};
