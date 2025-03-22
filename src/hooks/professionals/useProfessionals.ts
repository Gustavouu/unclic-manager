
import { useProfessionalOperations } from "./professionalOperations";
import { useProfessionalUtils } from "./professionalUtils";
import { useEffect, useState } from "react";
import { Professional } from "./types";

export const useProfessionals = () => {
  const {
    professionals: fetchedProfessionals,
    isLoading,
    addProfessional,
    updateProfessional,
    updateProfessionalStatus,
    removeProfessional
  } = useProfessionalOperations();
  
  // Garantir que os profissionais estão sempre como um array
  const safeProfessionals = Array.isArray(fetchedProfessionals) ? fetchedProfessionals : [] as Professional[];
  
  // Adicionar um estado local para rastrear mudanças
  const [trackedProfessionals, setTrackedProfessionals] = useState<Professional[]>(safeProfessionals);
  
  // Sincronizar os profissionais quando eles mudarem
  useEffect(() => {
    console.log("Atualizando profissionais no useProfessionals:", safeProfessionals);
    setTrackedProfessionals(safeProfessionals);
  }, [safeProfessionals]);
  
  const { specialties, getProfessionalById } = useProfessionalUtils(trackedProfessionals);
  
  return {
    professionals: trackedProfessionals,
    isLoading,
    specialties,
    getProfessionalById,
    addProfessional,
    updateProfessional,
    updateProfessionalStatus,
    removeProfessional
  };
};
