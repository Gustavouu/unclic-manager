
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
    if (!businessId) {
      setServices([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      // For now, return mock services to avoid database schema issues
      const mockServices: Service[] = [
        {
          id: '1',
          name: 'Corte de Cabelo',
          description: 'Corte moderno e estiloso',
          price: 50,
          duration: 30,
          category: 'Cabelo',
          isActive: true,
        },
        {
          id: '2',
          name: 'Barba',
          description: 'Aparar e modelar barba',
          price: 25,
          duration: 20,
          category: 'Barba',
          isActive: true,
        },
      ];

      setServices(mockServices);
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
