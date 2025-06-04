
import { useOptimizedTenant } from '@/contexts/OptimizedTenantContext';

export const useCurrentBusiness = () => {
  const { businessId, businessName, currentBusiness, isLoading, error } = useOptimizedTenant();
  
  return {
    businessId,
    businessName,
    currentBusiness,
    loading: isLoading,
    error,
  };
};
