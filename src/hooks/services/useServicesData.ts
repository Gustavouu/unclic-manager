
import { useState, useEffect } from 'react';
import { ServiceService } from '@/services/service/serviceService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Service, ServiceCreate, ServiceUpdate } from '@/types/service';

export const useServicesData = () => {
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
      const data = await serviceService.getByBusinessId(businessId);
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [businessId]);

  const createService = async (data: Omit<ServiceCreate, 'business_id'>) => {
    if (!businessId) throw new Error('No business selected');
    
    const newService = await serviceService.create({
      ...data,
      business_id: businessId,
    });
    
    await fetchServices();
    return newService;
  };

  const updateService = async (id: string, data: ServiceUpdate) => {
    await serviceService.update(id, data);
    await fetchServices();
  };

  const deleteService = async (id: string) => {
    await serviceService.delete(id);
    await fetchServices();
  };

  return {
    services,
    isLoading,
    error,
    refetch: fetchServices,
    createService,
    updateService,
    deleteService,
  };
};
