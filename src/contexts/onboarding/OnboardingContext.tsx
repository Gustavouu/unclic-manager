
import React, { createContext, useContext, ReactNode, useState, useRef, useEffect } from "react";
import { OnboardingContextType } from "./types";
import { useBusinessDataState } from "./hooks/useBusinessDataState";
import { useServicesState } from "./hooks/useServicesState";
import { useStaffState } from "./hooks/useStaffState";
import { useBusinessHoursState } from "./hooks/useBusinessHoursState";
import { usePersistence } from "./hooks/usePersistence";
import { useCompletion } from "./hooks/useCompletion";

// Create context
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Provider component
export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const hasLoaded = useRef(false);
  const saveTimeoutRef = useRef<number | null>(null);
  
  // Initialize state hooks
  const { businessHours, setBusinessHours, updateBusinessHours } = useBusinessHoursState();
  const { services, setServices, addService, removeService, updateService } = useServicesState();
  const { staffMembers, setStaffMembers, hasStaff, setHasStaff, addStaffMember, removeStaffMember, updateStaffMember } = useStaffState();

  // Create a reference for saveProgress function
  const saveProgressRef = useRef<() => void>(() => {});
  
  // Business data state (needs the saveProgress reference)
  const { businessData, setBusinessData, updateBusinessData } = useBusinessDataState(saveTimeoutRef, () => saveProgressRef.current());
  
  // Persistence hook
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
  
  // Assign the real function to the ref
  useEffect(() => {
    saveProgressRef.current = saveProgress;
  }, [saveProgress]);
  
  // Completion hook
  const { isComplete } = useCompletion(businessData, services, staffMembers, hasStaff);

  // The context value object with all the state and functions
  const contextValue: OnboardingContextType = {
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

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Hook for using the context
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  
  if (context === undefined) {
    throw new Error("useOnboarding deve ser usado dentro de um OnboardingProvider");
  }
  
  return context;
};
