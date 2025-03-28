
import { useProfessionalOperations } from "./professionalOperations";
import { useProfessionalUtils } from "./professionalUtils";
import { useEffect, useState, useCallback } from "react";
import { Professional, ProfessionalCreateForm, ProfessionalStatus } from "./types";

export const useProfessionals = () => {
  const {
    professionals: fetchedProfessionals,
    isLoading,
    addProfessional: addProfessionalOp,
    updateProfessional: updateProfessionalOp,
    updateProfessionalStatus,
    removeProfessional: removeProfessionalOp
  } = useProfessionalOperations();
  
  // Ensure professionals is always an array
  const safeProfessionals = Array.isArray(fetchedProfessionals) 
    ? fetchedProfessionals 
    : [] as Professional[];
  
  // Add a local state to track changes
  const [trackedProfessionals, setTrackedProfessionals] = useState<Professional[]>(safeProfessionals);
  
  // Sync professionals when they change
  useEffect(() => {
    console.log("Updating professionals in useProfessionals:", safeProfessionals);
    setTrackedProfessionals(safeProfessionals);
  }, [safeProfessionals]);
  
  const { specialties, getProfessionalById } = useProfessionalUtils(trackedProfessionals);
  
  // Wrap the operations to ensure state is updated correctly
  const handleAddProfessional = useCallback(async (data: ProfessionalCreateForm) => {
    try {
      const result = await addProfessionalOp(data);
      return result;
    } catch (error) {
      console.error("Error in useProfessionals.handleAddProfessional:", error);
      throw error;
    }
  }, [addProfessionalOp]);

  const handleUpdateProfessional = useCallback(async (id: string, data: ProfessionalCreateForm) => {
    try {
      await updateProfessionalOp(id, data);
      return true;
    } catch (error) {
      console.error("Error in useProfessionals.handleUpdateProfessional:", error);
      throw error;
    }
  }, [updateProfessionalOp]);

  const handleUpdateStatus = useCallback(async (id: string, status: ProfessionalStatus) => {
    try {
      await updateProfessionalStatus(id, status);
      return true;
    } catch (error) {
      console.error("Error in useProfessionals.handleUpdateStatus:", error);
      throw error;
    }
  }, [updateProfessionalStatus]);

  const handleRemoveProfessional = useCallback(async (id: string) => {
    try {
      await removeProfessionalOp(id);
      return true;
    } catch (error) {
      console.error("Error in useProfessionals.handleRemoveProfessional:", error);
      throw error;
    }
  }, [removeProfessionalOp]);
  
  return {
    professionals: trackedProfessionals,
    isLoading,
    specialties,
    getProfessionalById,
    addProfessional: handleAddProfessional,
    updateProfessional: handleUpdateProfessional,
    updateProfessionalStatus: handleUpdateStatus,
    removeProfessional: handleRemoveProfessional
  };
};
