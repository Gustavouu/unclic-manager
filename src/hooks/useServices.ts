
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  category?: string;
  isActive?: boolean;
  businessId: string;
}

// Dados de exemplo para serviços
const createSampleServices = (businessId: string): Service[] => [
  {
    id: 'sample-service-1',
    name: 'Corte e Escova',
    description: 'Corte de cabelo feminino com escova',
    duration: 60,
    price: 80,
    category: 'hair',
    isActive: true,
    businessId,
  },
  {
    id: 'sample-service-2',
    name: 'Corte Masculino',
    description: 'Corte de cabelo masculino',
    duration: 45,
    price: 50,
    category: 'haircut',
    isActive: true,
    businessId,
  },
  {
    id: 'sample-service-3',
    name: 'Manicure',
    description: 'Cuidados com as unhas das mãos',
    duration: 60,
    price: 40,
    category: 'nails',
    isActive: true,
    businessId,
  },
  {
    id: 'sample-service-4',
    name: 'Barba',
    description: 'Aparar e modelar barba',
    duration: 30,
    price: 35,
    category: 'barber',
    isActive: true,
    businessId,
  },
  {
    id: 'sample-service-5',
    name: 'Hidratação Capilar',
    description: 'Tratamento intensivo para cabelos',
    duration: 90,
    price: 120,
    category: 'treatment',
    isActive: true,
    businessId,
  },
  {
    id: 'sample-service-6',
    name: 'Pedicure',
    description: 'Cuidados com as unhas dos pés',
    duration: 75,
    price: 45,
    category: 'nails',
    isActive: true,
    businessId,
  },
];

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  const fetchServices = async () => {
    if (!businessId) {
      console.log('No business ID available, using sample services');
      const sampleData = createSampleServices('sample-business');
      setServices(sampleData);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Tentar buscar da tabela services_v2 primeiro
      const { data: servicesData, error: servicesError } = await supabase
        .from('services_v2')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_active', true);

      if (servicesError) {
        console.warn('Error fetching from services_v2:', servicesError);
        
        // Tentar da tabela servicos
        const { data: servicosData, error: servicosError } = await supabase
          .from('servicos')
          .select('*')
          .eq('id_negocio', businessId);

        if (servicosError) {
          console.warn('No services found in database, using sample data');
          const sampleData = createSampleServices(businessId);
          setServices(sampleData);
        } else if (servicosData && servicosData.length > 0) {
          const mappedServices: Service[] = servicosData.map((service: any) => ({
            id: service.id,
            name: service.nome,
            description: service.descricao,
            duration: service.duracao,
            price: service.preco,
            category: service.categoria,
            isActive: service.ativo,
            businessId: service.id_negocio,
          }));
          setServices(mappedServices);
        } else {
          const sampleData = createSampleServices(businessId);
          setServices(sampleData);
        }
      } else if (servicesData && servicesData.length > 0) {
        const mappedServices: Service[] = servicesData.map((service: any) => ({
          id: service.id,
          name: service.name,
          description: service.description,
          duration: service.duration,
          price: service.price,
          category: service.category,
          isActive: service.is_active,
          businessId: service.business_id,
        }));
        setServices(mappedServices);
      } else {
        // Se não há dados, usar dados de exemplo
        const sampleData = createSampleServices(businessId);
        setServices(sampleData);
        console.log('No services found, using sample data');
      }
    } catch (err: any) {
      console.error('Error fetching services:', err);
      setError(err.message);
      
      // Em caso de erro, usar dados de exemplo
      const sampleData = createSampleServices(businessId || 'sample-business');
      setServices(sampleData);
      toast.error('Erro ao carregar serviços, exibindo dados de exemplo');
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
    error,
    refetch: fetchServices,
  };
};
