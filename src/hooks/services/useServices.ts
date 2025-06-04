
import { useState, useEffect } from 'react';
import { ServiceService } from '@/services/service/serviceService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Service, ServiceCreate, ServiceUpdate } from '@/types/service';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    
    setIsSubmitting(true);
    try {
      const newService = await serviceService.create({
        ...data,
        business_id: businessId,
      });
      
      await fetchServices();
      return newService;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateService = async (id: string, data: ServiceUpdate) => {
    await serviceService.update(id, data);
    await fetchServices();
  };

  const deleteService = async (id: string) => {
    await serviceService.delete(id);
    await fetchServices();
  };

  const searchServices = async (searchTerm: string) => {
    if (!businessId) return [];
    return serviceService.search({ 
      business_id: businessId, 
      search: searchTerm 
    });
  };

  return {
    services,
    isLoading,
    isSubmitting,
    error,
    refetch: fetchServices,
    createService,
    updateService,
    deleteService,
    searchServices,
  };
};

export type { Service, ServiceCreate, ServiceUpdate } from '@/types/service';
