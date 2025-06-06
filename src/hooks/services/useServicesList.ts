
import { useState, useEffect } from 'react';
import { ServiceService } from '@/services/service/serviceService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Service, ServiceSearchParams } from '@/types/service';

export const useServicesList = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

  const serviceService = ServiceService.getInstance();

  const fetchServices = async () => {
    if (!businessId) {
      setServices([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching services for business:', businessId);
      const data = await serviceService.getByBusinessId(businessId);
      console.log('Services fetched:', data);
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchServices = async (search?: string, category?: string) => {
    if (!businessId) return;

    setIsLoading(true);
    setError(null);

    try {
      const params: ServiceSearchParams = {
        business_id: businessId,
        search,
        category,
        is_active: true,
      };

      const data = await serviceService.search(params);
      setServices(data);
    } catch (err) {
      console.error('Error searching services:', err);
      setError(err instanceof Error ? err.message : 'Failed to search services');
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchServices();
  };

  useEffect(() => {
    fetchServices();
  }, [businessId]);

  return {
    services,
    isLoading,
    error,
    refetch,
    searchServices,
  };
};
