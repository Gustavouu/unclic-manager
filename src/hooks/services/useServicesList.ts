
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Service } from '@/types/service';

export const useServicesList = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

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
      
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessId)
        .order('criado_em', { ascending: false });

      if (servicesError) {
        console.log('Error from services table:', servicesError);
        throw servicesError;
      }

      console.log('Fetched services:', servicesData);
      
      // Map the data to include both Portuguese and English field names
      const mappedServices: Service[] = (servicesData || []).map(service => ({
        ...service,
        categoria: service.category || 'Geral',
        name: service.nome,
        description: service.descricao,
        duration: service.duracao,
        price: service.preco,
        is_active: service.ativo,
        created_at: service.criado_em,
        updated_at: service.atualizado_em,
      }));

      setServices(mappedServices);
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

  const searchServices = async (searchTerm: string): Promise<Service[]> => {
    if (!businessId || !searchTerm.trim()) {
      return services;
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessId)
        .or(`nome.ilike.%${searchTerm}%,descricao.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        .order('criado_em', { ascending: false });

      if (error) {
        throw error;
      }

      // Map the data to include both Portuguese and English field names
      const mappedServices: Service[] = (data || []).map(service => ({
        ...service,
        categoria: service.category || 'Geral',
        name: service.nome,
        description: service.descricao,
        duration: service.duracao,
        price: service.preco,
        is_active: service.ativo,
        created_at: service.criado_em,
        updated_at: service.atualizado_em,
      }));

      return mappedServices;
    } catch (error) {
      console.error('Error searching services:', error);
      return [];
    }
  };

  return {
    services,
    isLoading,
    error,
    refetch: fetchServices,
    searchServices,
  };
};
