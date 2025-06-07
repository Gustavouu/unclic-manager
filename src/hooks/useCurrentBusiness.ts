
import { useMultiTenant } from '@/contexts/MultiTenantContext';

export const useCurrentBusiness = () => {
  const { 
    currentBusiness, 
    isLoading, 
    error 
  } = useMultiTenant();

  return {
    businessId: currentBusiness?.id || null,
    businessName: currentBusiness?.name || null,
    isLoading,
    error: error || (currentBusiness ? null : 'Nenhum negócio selecionado'),
  };
};
