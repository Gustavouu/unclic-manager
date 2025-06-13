
import { useOnboardingStatus } from './useOnboardingStatus';

export const useNeedsOnboarding = () => {
  const { needsOnboarding, isLoading, error, businessId, onboardingComplete } = useOnboardingStatus();
  
  return {
    needsOnboarding,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    error,
    businessId,
    onboardingComplete,
  };
};
