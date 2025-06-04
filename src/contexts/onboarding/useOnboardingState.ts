
// This file is deprecated and kept only for compatibility
// All onboarding state has been moved to OnboardingContext.tsx

export const useOnboardingState = () => {
  console.warn('useOnboardingState is deprecated. Use OnboardingProvider directly.');
  return {};
};
