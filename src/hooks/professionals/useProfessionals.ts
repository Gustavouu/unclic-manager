
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
  
  // Ensure professionals is always an array
  const safeProfessionals = Array.isArray(fetchedProfessionals) ? fetchedProfessionals : [] as Professional[];
  
  // Add a local state to track changes
  const [trackedProfessionals, setTrackedProfessionals] = useState<Professional[]>(safeProfessionals);
  
  // Sync professionals when they change
  useEffect(() => {
    console.log("Updating professionals in useProfessionals:", safeProfessionals);
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
