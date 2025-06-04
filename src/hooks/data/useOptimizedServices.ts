
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UnifiedDataService } from '@/services/unified/UnifiedDataService';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';
import type { UnifiedService } from '@/types/unified';

export const useOptimizedServices = () => {
  const { businessId } = useTenant();
  const queryClient = useQueryClient();
  const dataService = UnifiedDataService.getInstance();

  const {
    data: services = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['services', businessId],
    queryFn: () => businessId ? dataService.getServices(businessId) : [],
    enabled: !!businessId,
    staleTime: 10 * 60 * 1000, // 10 minutes - services don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });

  const getActiveServices = (): UnifiedService[] => {
    return services.filter(service => service.is_active);
  };

  const getServicesByCategory = (category: string): UnifiedService[] => {
    return services.filter(service => service.category === category);
  };

  const getCategories = (): string[] => {
    const categories = [...new Set(services.map(service => service.category).filter(Boolean))];
    return categories.length > 0 ? categories : ['Geral'];
  };

  const searchServices = (searchTerm: string, category?: string): UnifiedService[] => {
    let filtered = services;

    if (category && category !== 'all') {
      filtered = filtered.filter(service => service.category === category);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(term) ||
        service.description?.toLowerCase().includes(term) ||
        service.category?.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  return {
    services,
    isLoading,
    error,
    refetch,
    getActiveServices,
    getServicesByCategory,
    getCategories,
    searchServices,
  };
};
