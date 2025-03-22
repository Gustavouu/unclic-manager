
import { useProfessionalOperations } from "./professionalOperations";
import { useProfessionalUtils } from "./professionalUtils";
import { useEffect, useState } from "react";
import { Professional } from "./types";

export const useProfessionals = () => {
  const {
    professionals,
    isLoading,
    addProfessional,
    updateProfessional,
    updateProfessionalStatus,
    removeProfessional
  } = useProfessionalOperations();
  
  // Garantir que os profissionais estão sempre como um array
  const safeProfessionals = Array.isArray(professionals) ? professionals : [] as Professional[];
  
  const { specialties, getProfessionalById } = useProfessionalUtils(safeProfessionals);
  
  return {
    professionals: safeProfessionals,
    isLoading,
    specialties,
    getProfessionalById,
    addProfessional,
    updateProfessional,
    updateProfessionalStatus,
    removeProfessional
  };
};
