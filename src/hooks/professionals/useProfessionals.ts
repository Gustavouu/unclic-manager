
import { useProfessionalOperations } from "./professionalOperations";
import { useProfessionalUtils } from "./professionalUtils";

export const useProfessionals = () => {
  const {
    professionals,
    isLoading,
    addProfessional,
    updateProfessional,
    updateProfessionalStatus,
    removeProfessional
  } = useProfessionalOperations();
  
  const { specialties, getProfessionalById } = useProfessionalUtils(professionals);
  
  return {
    professionals,
    isLoading,
    specialties,
    getProfessionalById,
    addProfessional,
    updateProfessional,
    updateProfessionalStatus,
    removeProfessional
  };
};
