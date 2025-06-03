
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { businessId } = useCurrentBusiness();

  const fetchServices = async () => {
    if (!businessId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessId);

      if (error) throw error;

      const normalizedServices = data?.map(service => ({
        id: service.id,
        name: service.name || '',
        description: service.description || '',
        price: service.price || 0,
        duration: service.duration || 0,
        category: service.category || '',
        isActive: service.is_active !== false
      })) || [];

      setServices(normalizedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [businessId]);

  return {
    services,
    isLoading,
    refetch: fetchServices
  };
};
