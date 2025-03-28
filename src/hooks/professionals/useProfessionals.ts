
import { useProfessionalOperations } from "./professionalOperations";
import { useProfessionalUtils } from "./professionalUtils";
import { useEffect, useState } from "react";
import { Professional } from "./types";

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
  const safeProfessionals = Array.isArray(fetchedProfessionals) ? fetchedProfessionals : [] as Professional[];
  
  // Add a local state to track changes
  const [trackedProfessionals, setTrackedProfessionals] = useState<Professional[]>(safeProfessionals);
  
  // Sync professionals when they change
  useEffect(() => {
    console.log("Updating professionals in useProfessionals:", safeProfessionals);
    setTrackedProfessionals(safeProfessionals);
  }, [safeProfessionals]);
  
  const { specialties, getProfessionalById } = useProfessionalUtils(trackedProfessionals);
  
  // Wrap the operations to ensure state is updated correctly
  const handleAddProfessional = async (data: any) => {
    try {
      const result = await addProfessionalOp(data);
      return result;
    } catch (error) {
      console.error("Error in useProfessionals.handleAddProfessional:", error);
      throw error;
    }
  };

  const handleUpdateProfessional = async (id: string, data: any) => {
    try {
      await updateProfessionalOp(id, data);
      return true;
    } catch (error) {
      console.error("Error in useProfessionals.handleUpdateProfessional:", error);
      throw error;
    }
  };

  const handleRemoveProfessional = async (id: string) => {
    try {
      await removeProfessionalOp(id);
      return true;
    } catch (error) {
      console.error("Error in useProfessionals.handleRemoveProfessional:", error);
      throw error;
    }
  };
  
  return {
    professionals: trackedProfessionals,
    isLoading,
    specialties,
    getProfessionalById,
    addProfessional: handleAddProfessional,
    updateProfessional: handleUpdateProfessional,
    updateProfessionalStatus,
    removeProfessional: handleRemoveProfessional
  };
};
