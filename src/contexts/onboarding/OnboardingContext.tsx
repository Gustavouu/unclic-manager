
import React, { createContext, useContext, ReactNode } from "react";
import { OnboardingContextType } from "./types";
import { useOnboardingState } from "./useOnboardingState";

// Create context
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Provider component
export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const onboardingState = useOnboardingState();

  return (
    <OnboardingContext.Provider value={onboardingState}>
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
