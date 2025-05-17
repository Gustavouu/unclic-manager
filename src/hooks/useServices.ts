
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';
import { tableExists, normalizeServiceData } from '@/utils/databaseUtils';

export interface Service {
  id: string;
  name: string;
  nome: string;
  descricao?: string;
  preco: number;
  duracao: number;
  categoria_id?: string;
  ativo: boolean;
  imagem_url?: string;
  price?: number;
  duration?: number;
  description?: string;
  isActive?: boolean;
  categoryId?: string;
  image_url?: string;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  useEffect(() => {
    const fetchServices = async () => {
      if (!businessId) {
        console.log('No business ID available, skipping services fetch');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log('Fetching services for business ID:', businessId);
        
        // Primeiro tenta na tabela services_v2
        const hasServicesV2 = await tableExists('services_v2');
        let servicesData = null;
        
        if (hasServicesV2) {
          console.log('Trying services_v2 table');
          const { data, error } = await supabase
            .from('services_v2')
            .select('*')
            .eq('business_id', businessId)
            .eq('is_active', true);
            
          if (error) {
            console.error("Erro ao buscar serviços em services_v2:", error);
          } else if (data && data.length > 0) {
            console.log('Found services in services_v2 table:', data.length);
            servicesData = data;
          }
        }
        
        // Se não encontrou na services_v2, tenta na servicos
        if (!servicesData) {
          console.log('Trying servicos table');
          const { data, error } = await supabase
            .from('servicos')
            .select('*')
            .eq('id_negocio', businessId)
            .eq('ativo', true);

          if (error) {
            console.error("Erro ao buscar serviços em servicos:", error);
            setError(error.message);
            toast.error("Não foi possível carregar os serviços.");
            return;
          }
          
          if (data && data.length > 0) {
            console.log('Found services in servicos table:', data.length);
            servicesData = data;
          }
        }
        
        if (!servicesData || servicesData.length === 0) {
          console.log('No services found in any table');
          setServices([]);
          setIsLoading(false);
          return;
        }

        // Normaliza os dados dos serviços
        const mappedServices = servicesData.map(normalizeServiceData);
        console.log('Normalized services:', mappedServices.length);

        setServices(mappedServices);
      } catch (err: any) {
        console.error("Erro inesperado ao buscar serviços:", err);
        setError(err.message);
        toast.error("Erro ao carregar serviços.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [businessId]);

  const createService = async (serviceData: Omit<Service, 'id'>) => {
    try {
      if (!businessId) {
        throw new Error("ID do negócio não disponível");
      }
      
      // Determine which table to use
      const hasServicesV2 = await tableExists('services_v2');
      
      if (hasServicesV2) {
        const { data, error } = await supabase
          .from('services_v2')
          .insert([{
            name: serviceData.name || serviceData.nome,
            description: serviceData.description || serviceData.descricao,
            price: serviceData.price || serviceData.preco,
            duration: serviceData.duration || serviceData.duracao,
            category_id: serviceData.categoryId || serviceData.categoria_id,
            is_active: serviceData.isActive ?? serviceData.ativo ?? true,
            image_url: serviceData.image_url || serviceData.imagem_url,
            business_id: businessId
          }])
          .select()
          .single();

        if (error) throw error;

        const newService = normalizeServiceData(data);
        setServices(prev => [...prev, newService]);
        toast.success("Serviço criado com sucesso!");
        return newService;
      } else {
        const { data, error } = await supabase
          .from('servicos')
          .insert([{
            nome: serviceData.name || serviceData.nome,
            descricao: serviceData.description || serviceData.descricao,
            preco: serviceData.price || serviceData.preco,
            duracao: serviceData.duration || serviceData.duracao,
            id_categoria: serviceData.categoryId || serviceData.categoria_id,
            ativo: serviceData.isActive ?? serviceData.ativo ?? true,
            imagem_url: serviceData.image_url || serviceData.imagem_url,
            id_negocio: businessId
          }])
          .select()
          .single();

        if (error) throw error;

        const newService = normalizeServiceData(data);
        setServices(prev => [...prev, newService]);
        toast.success("Serviço criado com sucesso!");
        return newService;
      }
      
    } catch (err: any) {
      console.error("Error creating service:", err);
      toast.error("Erro ao criar serviço: " + err.message);
      throw err;
    }
  };

  const updateService = async (id: string, serviceData: Partial<Service>) => {
    try {
      // Determine which table to use by checking where the service exists
      let tableToUse = '';
      
      // Check in services_v2
      const { data: servicesV2Check } = await supabase
        .from('services_v2')
        .select('id')
        .eq('id', id)
        .maybeSingle();
        
      if (servicesV2Check) {
        tableToUse = 'services_v2';
      } else {
        // Check in servicos
        const { data: servicosCheck } = await supabase
          .from('servicos')
          .select('id')
          .eq('id', id)
          .maybeSingle();
          
        if (servicosCheck) {
          tableToUse = 'servicos';
        }
      }
      
      if (!tableToUse) {
        throw new Error("Service not found in any table");
      }
      
      let updatedService;
      
      if (tableToUse === 'services_v2') {
        const updateData: any = {};
        
        if (serviceData.name) updateData.name = serviceData.name;
        if (serviceData.description !== undefined) updateData.description = serviceData.description;
        if (serviceData.price !== undefined) updateData.price = serviceData.price;
        if (serviceData.duration !== undefined) updateData.duration = serviceData.duration;
        if (serviceData.categoryId !== undefined) updateData.category_id = serviceData.categoryId;
        if (serviceData.isActive !== undefined) updateData.is_active = serviceData.isActive;
        if (serviceData.image_url !== undefined) updateData.image_url = serviceData.image_url;
        
        const { data, error } = await supabase
          .from('services_v2')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        updatedService = normalizeServiceData(data);
      } else {
        const updateData: any = {};
        
        if (serviceData.name || serviceData.nome) updateData.nome = serviceData.name || serviceData.nome;
        if (serviceData.description !== undefined || serviceData.descricao !== undefined) 
          updateData.descricao = serviceData.description || serviceData.descricao;
        if (serviceData.price !== undefined || serviceData.preco !== undefined) 
          updateData.preco = serviceData.price || serviceData.preco;
        if (serviceData.duration !== undefined || serviceData.duracao !== undefined) 
          updateData.duracao = serviceData.duration || serviceData.duracao;
        if (serviceData.categoryId !== undefined || serviceData.categoria_id !== undefined) 
          updateData.id_categoria = serviceData.categoryId || serviceData.categoria_id;
        if (serviceData.isActive !== undefined || serviceData.ativo !== undefined) 
          updateData.ativo = serviceData.isActive || serviceData.ativo;
        if (serviceData.image_url !== undefined || serviceData.imagem_url !== undefined) 
          updateData.imagem_url = serviceData.image_url || serviceData.imagem_url;
        
        const { data, error } = await supabase
          .from('servicos')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        updatedService = normalizeServiceData(data);
      }
      
      setServices(prev => prev.map(service => 
        service.id === id ? updatedService : service
      ));
      
      toast.success("Serviço atualizado com sucesso!");
      return updatedService;
      
    } catch (err: any) {
      console.error("Error updating service:", err);
      toast.error("Erro ao atualizar serviço: " + err.message);
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      // Determine which table to use by checking where the service exists
      let tableToUse = '';
      
      // Check in services_v2
      const { data: servicesV2Check } = await supabase
        .from('services_v2')
        .select('id')
        .eq('id', id)
        .maybeSingle();
        
      if (servicesV2Check) {
        tableToUse = 'services_v2';
      } else {
        // Check in servicos
        const { data: servicosCheck } = await supabase
          .from('servicos')
          .select('id')
          .eq('id', id)
          .maybeSingle();
          
        if (servicosCheck) {
          tableToUse = 'servicos';
        }
      }
      
      if (!tableToUse) {
        throw new Error("Service not found in any table");
      }
      
      // Set active/ativo = false instead of hard deleting
      if (tableToUse === 'services_v2') {
        const { error } = await supabase
          .from('services_v2')
          .update({ is_active: false })
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('servicos')
          .update({ ativo: false })
          .eq('id', id);

        if (error) throw error;
      }

      // Remove from local state
      setServices(prev => prev.filter(service => service.id !== id));
      
      toast.success("Serviço removido com sucesso!");
      return true;
      
    } catch (err: any) {
      console.error("Error deleting service:", err);
      toast.error("Erro ao remover serviço: " + err.message);
      throw err;
    }
  };

  return {
    services,
    isLoading,
    error,
    createService,
    updateService,
    deleteService
  };
};
