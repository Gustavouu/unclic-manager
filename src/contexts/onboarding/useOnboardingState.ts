
import { useState, useRef } from "react";
import { useBusinessDataState } from "./hooks/useBusinessDataState";
import { useServicesState } from "./hooks/useServicesState";
import { useStaffState } from "./hooks/useStaffState";
import { useBusinessHoursState } from "./hooks/useBusinessHoursState";
import { usePersistence } from "./hooks/usePersistence";
import { useCompletion } from "./hooks/useCompletion";

export const useOnboardingState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const hasLoaded = useRef(false);
  
  // Este hook é usado em outros hooks, então precisamos defini-lo primeiro
  const saveTimeoutRef = useRef<number | null>(null);
  
  // Inicializa estados dos hooks separados
  const { services, setServices, addService, removeService, updateService } = useServicesState();
  const { staffMembers, setStaffMembers, hasStaff, setHasStaff, addStaffMember, removeStaffMember, updateStaffMember } = useStaffState();
  const { businessHours, setBusinessHours, updateBusinessHours } = useBusinessHoursState();
  
  // Esse hook precisa de uma referência à função saveProgress que ainda não foi definida
  // Vamos criar uma função temporária que será substituída depois
  let saveProgressTemp = () => {};
  
  // Estado dos dados do negócio
  const { businessData, setBusinessData, updateBusinessData } = useBusinessDataState(saveTimeoutRef, () => saveProgressTemp());
  
  // Hooks de persistência e validação de conclusão
  const { saveProgress, loadProgress } = usePersistence(
    businessData, 
    services, 
    staffMembers, 
    businessHours, 
    hasStaff, 
    currentStep, 
    hasLoaded,
    setBusinessData,
    setServices,
    setStaffMembers,
    setBusinessHours,
    setHasStaff,
    setCurrentStep
  );
  
  // Agora podemos atribuir a função real
  saveProgressTemp = saveProgress;
  
  const { isComplete } = useCompletion(businessData, services, staffMembers, hasStaff);

  return {
    currentStep,
    setCurrentStep,
    businessData,
    updateBusinessData,
    services,
    addService,
    removeService,
    updateService,
    staffMembers,
    addStaffMember,
    removeStaffMember,
    updateStaffMember,
    businessHours,
    updateBusinessHours,
    hasStaff,
    setHasStaff,
    isComplete,
    saveProgress,
    loadProgress
  };
};
