
import { useMemo, useCallback } from "react";
import { Professional } from "./types";

export const useProfessionalUtils = (professionals: Professional[] = []) => {
  // Extrair todas as especialidades dos profissionais
  const specialties = useMemo(() => {
    const allSpecialties = professionals.flatMap(p => p.specialties || []);
    return [...new Set(allSpecialties)];
  }, [professionals]);
  
  // Buscar profissional por ID
  const getProfessionalById = useCallback((id: string) => {
    return professionals.find(p => p.id === id);
  }, [professionals]);

  return {
    specialties,
    getProfessionalById
  };
};
