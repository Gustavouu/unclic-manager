import React, { createContext, useContext, ReactNode, useState, useRef, useEffect } from "react";
import { OnboardingContextType, BusinessData, OnboardingMethod, OnboardingStatus } from "./types";
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
  const [currentStep, setCurrentStep] = useState(-1); // Start at -1 for welcome screen
  const [onboardingMethod, setOnboardingMethod] = useState<OnboardingMethod>(null);
  const [status, setStatus] = useState<OnboardingStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [businessCreated, setBusinessCreated] = useState<{id?: string; slug?: string} | null>(null);
  
  const hasLoaded = useRef(false);
  const saveTimeoutRef = useRef<number | null>(null);
  
  // Initialize state hooks
  const { businessHours, setBusinessHours, updateBusinessHours } = useBusinessHoursState();
  const { services, setServices, addService, removeService, updateService } = useServicesState();
  const { staffMembers, setStaffMembers, hasStaff, setHasStaff, addStaffMember, removeStaffMember, updateStaffMember } = useStaffState();

  // Create a reference for saveProgress function
  const saveProgressRef = useRef<() => void>(() => {});
  
  // Create business data state directly with useState
  const [businessData, setBusinessDataState] = useState<BusinessData>({
    name: "",
    email: "",
    phone: "",
    cep: "",
    zipCode: "",
    address: "",
    number: "",
    addressNumber: "",
    neighborhood: "",
    city: "",
    state: ""
  });
  
  // Now use the useBusinessDataState hook with the correct parameters
  const { updateBusinessData } = useBusinessDataState(
    saveTimeoutRef, 
    () => saveProgressRef.current(),
    businessData,
    setBusinessDataState
  );
  
  // Persistence hook
  const { saveProgress, loadProgress } = usePersistence(
    businessData,
    services,
    staffMembers,
    businessHours,
    hasStaff,
    currentStep,
    onboardingMethod,
    hasLoaded,
    setBusinessDataState,
    setServices,
    setStaffMembers,
    setBusinessHours,
    setHasStaff,
    setCurrentStep,
    setOnboardingMethod
  );
  
  // Assign the real function to the ref
  useEffect(() => {
    saveProgressRef.current = saveProgress;
  }, [saveProgress]);
  
  // Completion hook
  const { isComplete } = useCompletion(businessData, services, staffMembers, hasStaff);

  // Function to reset onboarding
  const resetOnboarding = () => {
    setCurrentStep(-1);
    setOnboardingMethod(null);
    setStatus("idle");
    setError(null);
    setProcessingStep(null);
    setBusinessCreated(null);
    
    // Reset all data
    setBusinessDataState({
      name: "",
      email: "",
      phone: "",
      cep: "",
      zipCode: "",
      address: "",
      number: "",
      addressNumber: "",
      neighborhood: "",
      city: "",
      state: ""
    });
    setServices([]);
    setStaffMembers([]);
    setHasStaff(false);
    
    // Clear localStorage
    localStorage.removeItem('unclic-manager-onboarding');
  };

  // The updateBusinessData function should be modified to handle the dual naming
  const updateBusinessData = (data: Partial<BusinessData>) => {
    setBusinessDataState(prev => {
      // Sync zipCode and cep fields if either is provided
      const updatedData = { ...prev, ...data };
      
      // Keep zipCode and cep in sync
      if (data.zipCode && !data.cep) {
        updatedData.cep = data.zipCode;
      }
      if (data.cep && !data.zipCode) {
        updatedData.zipCode = data.cep;
      }
      
      // Keep addressNumber and number in sync
      if (data.addressNumber && !data.number) {
        updatedData.number = data.addressNumber;
      }
      if (data.number && !data.addressNumber) {
        updatedData.addressNumber = data.number;
      }
      
      // For nested objects like socialMedia, merge them properly
      if (data.socialMedia) {
        updatedData.socialMedia = {
          ...prev.socialMedia,
          ...data.socialMedia
        };
      }
      
      // Set a new timeout for auto-save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = window.setTimeout(() => {
        saveProgress();
      }, 1000) as unknown as number;
      
      return updatedData;
    });
  };

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
    loadProgress,
    onboardingMethod,
    setOnboardingMethod,
    status,
    setStatus,
    error,
    setError,
    processingStep,
    setProcessingStep,
    resetOnboarding,
    businessCreated,
    setBusinessCreated
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
