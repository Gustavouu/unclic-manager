
// This file is no longer used since the state handling has been moved directly into OnboardingContext.tsx
// It's kept as an empty file to avoid breaking existing imports until they're all updated

// The code has been refactored into the following hooks:
// - useBusinessDataState
// - useServicesState
// - useStaffState
// - useBusinessHoursState
// - usePersistence
// - useCompletion

/**
 * @deprecated This hook has been refactored. Please use the OnboardingProvider directly.
 */
export const useOnboardingState = () => {
  console.warn('useOnboardingState is deprecated. The functionality has been moved to OnboardingContext.tsx');
  
  return {};
};
