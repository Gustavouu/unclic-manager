
import React from 'react';
// Re-export from the new location for backwards compatibility
export { OnboardingProvider, useOnboarding } from "./onboarding/OnboardingContext";
export type { 
  BusinessData, 
  ServiceData, 
  StaffData, 
  BusinessHours, 
  OnboardingContextType,
  OnboardingMethod,
  OnboardingStatus
} from "./onboarding/types";
