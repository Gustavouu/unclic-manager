
import { useState, useEffect } from 'react';
import { ServiceService } from '@/services/service/serviceService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Service } from '@/types/service';
import { toast } from 'sonner';

export const useServicesList = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    } catch (err: any) {
      console.error('Error fetching services:', err);
      const errorMessage = err.message || 'Erro ao carregar serviços';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const searchServices = async (searchTerm: string, category?: string) => {
    if (!businessId) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await serviceService.search({
        business_id: businessId,
        search: searchTerm,
        category,
        is_active: true
      });
      setServices(data);
    } catch (err: any) {
      console.error('Error searching services:', err);
      const errorMessage = err.message || 'Erro ao buscar serviços';
      setError(errorMessage);
      toast.error(errorMessage);
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
