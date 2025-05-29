
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  is_active: boolean;
  business_id: string;
  category_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  useEffect(() => {
    const fetchServices = async () => {
      if (!businessId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Try servicos table (legacy schema)
        const { data: servicosData, error: servicosError } = await supabase
          .from('servicos')
          .select('*')
          .eq('id_negocio', businessId);
          
        if (!servicosError && servicosData) {
          const mappedServices: Service[] = servicosData.map(service => ({
            id: service.id,
            name: service.nome,
            description: service.descricao,
            price: service.preco,
            duration: service.duracao,
            is_active: service.ativo,
            business_id: service.id_negocio,
            category_id: service.id_categoria,
            created_at: service.criado_em,
            updated_at: service.atualizado_em,
          }));
          
          setServices(mappedServices);
          setLoading(false);
          return;
        }
        
        // If that fails, try services table (modern schema)
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('business_id', businessId);
          
        if (!servicesError && servicesData) {
          setServices(servicesData as Service[]);
        } else {
          // Return empty array if both queries fail
          setServices([]);
        }
        
      } catch (err: any) {
        console.error('Error in useServices:', err);
        setError(err.message || 'Failed to fetch services');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [businessId]);

  // CRUD operations would go here
  const createService = async (serviceData: Omit<Service, 'id' | 'business_id'>) => {
    // Implementation for creating services
    console.log('Create service:', serviceData);
  };

  const updateService = async (id: string, serviceData: Partial<Service>) => {
    // Implementation for updating services
    console.log('Update service:', id, serviceData);
  };

  const deleteService = async (id: string) => {
    // Implementation for deleting services
    console.log('Delete service:', id);
  };

  return { 
    services, 
    loading, 
    isLoading: loading,
    error,
    createService,
    updateService,
    deleteService
  };
};
