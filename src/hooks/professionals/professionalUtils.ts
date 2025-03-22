
import { useMemo, useCallback } from "react";
import { Professional } from "./types";

export const useProfessionalUtils = (professionals: Professional[] = []) => {
  // Garantir que professionals é sempre um array
  const safeProfessionals = Array.isArray(professionals) ? professionals : [];
  
  // Extrair todas as especialidades dos profissionais com verificações adequadas
  const specialties = useMemo(() => {
    if (!safeProfessionals || safeProfessionals.length === 0) {
      // Retornar especializações padrão se não houver profissionais
      return [
        "Cabeleireiro", 
        "Manicure", 
        "Pedicure", 
        "Esteticista", 
        "Massagista", 
        "Barbeiro", 
        "Maquiador"
      ];
    }
    
    const allSpecialties = safeProfessionals.flatMap(p => {
      if (!p) return [];
      if (!Array.isArray(p.specialties)) return [];
      return p.specialties;
    });
    
    // Se não houver especialidades extraídas, retornar as padrão
    if (allSpecialties.length === 0) {
      return [
        "Cabeleireiro", 
        "Manicure", 
        "Pedicure", 
        "Esteticista", 
        "Massagista", 
        "Barbeiro", 
        "Maquiador"
      ];
    }
    
    return [...new Set(allSpecialties)].filter(Boolean);
  }, [safeProfessionals]);
  
  // Encontrar profissional por ID com verificação de nulos
  const getProfessionalById = useCallback((id: string) => {
    if (!safeProfessionals || safeProfessionals.length === 0) return undefined;
    return safeProfessionals.find(p => p?.id === id);
  }, [safeProfessionals]);

  return {
    specialties,
    getProfessionalById
  };
};
