
import { useMemo, useCallback } from "react";
import { Professional } from "./types";

export const useProfessionalUtils = (professionals: Professional[] = []) => {
  // Ensure professionals is always an array
  const safeProfessionals = Array.isArray(professionals) ? professionals : [];
  
  // Extract all specialties from professionals with proper null checks
  const specialties = useMemo(() => {
    const allSpecialties = safeProfessionals.flatMap(p => {
      if (!p) return [];
      return Array.isArray(p.specialties) ? p.specialties : [];
    });
    return [...new Set(allSpecialties)];
  }, [safeProfessionals]);
  
  // Find professional by ID with null check
  const getProfessionalById = useCallback((id: string) => {
    return safeProfessionals.find(p => p?.id === id);
  }, [safeProfessionals]);

  return {
    specialties,
    getProfessionalById
  };
};
