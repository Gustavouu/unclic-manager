
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category?: string;
  image_url?: string;
  is_active: boolean;
  commission_percentage?: number;
  business_id: string;
  created_at: string;
  updated_at: string;
}

export const useServices = () => {
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
      console.log('Fetching services for business ID:', businessId);
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_active', true)
        .order('name', { ascending: true });
      
      if (error) {
        console.error("Error fetching services:", error);
        throw error;
      }
      
      setServices(data || []);
      console.log(`Successfully loaded ${(data || []).length} services`);
    } catch (err) {
      console.error("Error in fetchServices:", err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar serviços';
      setError(errorMessage);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [businessId]);

  const createService = async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at' | 'business_id'>) => {
    if (!businessId) throw new Error('No business selected');
    
    const { data, error } = await supabase
      .from('services')
      .insert({
        ...serviceData,
        business_id: businessId,
      })
      .select()
      .single();

    if (error) throw error;
    
    await fetchServices();
    return data;
  };

  const updateService = async (id: string, serviceData: Partial<Service>) => {
    const { error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', id);

    if (error) throw error;
    
    await fetchServices();
  };

  const deleteService = async (id: string) => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
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
