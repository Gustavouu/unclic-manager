
import { useTenant } from "@/contexts/TenantContext";

export const useNeedsOnboarding = () => {
  const { businessId } = useTenant();
  
  // For now, return false since we don't have a currentBusiness property
  // In a real implementation, this would check onboarding status
  const needsOnboarding = false;
  const isLoading = false;
  
  return {
    needsOnboarding,
    isLoading
  };
};
