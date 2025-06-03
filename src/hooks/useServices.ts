
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
      // Try the services table first
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessId);

      if (!servicesError && servicesData) {
        const normalizedServices = servicesData.map(service => ({
          id: service.id,
          name: service.name || '',
          description: service.description || '',
          price: service.price || 0,
          duration: service.duration || 0,
          category: service.category_id || '',
          isActive: service.is_active !== false
        }));
        setServices(normalizedServices);
        setIsLoading(false);
        return;
      }

      // Fallback to legacy servicos table
      const { data: legacyData, error: legacyError } = await supabase
        .from('servicos')
        .select('*')
        .eq('id_negocio', businessId);

      if (!legacyError && legacyData) {
        const normalizedServices = legacyData.map(service => ({
          id: service.id,
          name: service.nome || '',
          description: service.descricao || '',
          price: service.preco || 0,
          duration: service.duracao || 0,
          category: service.id_categoria || '',
          isActive: service.ativo !== false
        }));
        setServices(normalizedServices);
      } else {
        setServices([]);
      }
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
