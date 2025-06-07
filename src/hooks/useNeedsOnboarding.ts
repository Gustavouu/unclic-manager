
import { useMultiTenant } from "@/contexts/MultiTenantContext";

export const useNeedsOnboarding = () => {
  const { currentBusiness, isLoading, error } = useMultiTenant();
  
  // For now, return false since we don't have onboarding status in the business object
  // In a real implementation, this would check onboarding status from the business data
  const needsOnboarding = false;
  const loading = isLoading;
  
  return {
    needsOnboarding,
    isLoading,
    loading,
    error: error || null
  };
};
