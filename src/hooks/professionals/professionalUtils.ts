
import { useMemo } from "react";
import { Professional, ProfessionalStatus } from "./types";

export const useProfessionalUtils = (professionals: Professional[] = []) => {
  const specialties = useMemo(() => {
    // Extract all unique specialties from professionals
    const allSpecialties = professionals.flatMap(p => p.specialties || []);
    return [...new Set(allSpecialties)].sort();
  }, [professionals]);
  
  const getAvailableProfessionalsBySpecialty = (specialty: string) => {
    return professionals.filter(
      p => p.status === ProfessionalStatus.ACTIVE && p.specialties && p.specialties.includes(specialty)
    );
  };
  
  const getProfessionalById = (id: string) => {
    return professionals.find(p => p.id === id);
  };
  
  const getProfessionalsByStatus = (status: ProfessionalStatus | 'all') => {
    if (status === 'all') return professionals;
    return professionals.filter(p => p.status === status);
  };
  
  return {
    specialties,
    getAvailableProfessionalsBySpecialty,
    getProfessionalById,
    getProfessionalsByStatus
  };
};
