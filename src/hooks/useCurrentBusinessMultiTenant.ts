
import { useMultiTenant } from '@/contexts/MultiTenantContext';

export const useCurrentBusinessMultiTenant = () => {
  const { 
    currentBusiness, 
    availableBusinesses, 
    isLoading, 
    error, 
    switchBusiness,
    refreshBusinesses,
    hasMultipleBusinesses 
  } = useMultiTenant();

  return {
    businessId: currentBusiness?.id || null,
    businessName: currentBusiness?.name || null,
    businessRole: currentBusiness?.role || null,
    businessStatus: currentBusiness?.status || null,
    isLoading,
    error,
    availableBusinesses,
    hasMultipleBusinesses,
    switchBusiness,
    refreshBusinesses,
    // Compatibility with existing useCurrentBusiness hook
    business: currentBusiness,
  };
};
