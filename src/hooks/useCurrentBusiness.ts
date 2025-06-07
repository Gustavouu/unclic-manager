
import { useMultiTenant } from '@/contexts/MultiTenantContext';

export const useCurrentBusiness = () => {
  const { currentBusiness, isLoading, error } = useMultiTenant();
  
  return {
    businessId: currentBusiness?.id || null,
    business: currentBusiness,
    isLoading,
    error
  };
};
