
import { useMultiTenant } from '@/contexts/MultiTenantContext';

export const useTenant = () => {
  const { 
    currentBusiness, 
    isLoading, 
    error 
  } = useMultiTenant();

  return {
    businessId: currentBusiness?.id || null,
    businessName: currentBusiness?.name || null,
    businessRole: currentBusiness?.role || null,
    isLoading,
    error,
  };
};
