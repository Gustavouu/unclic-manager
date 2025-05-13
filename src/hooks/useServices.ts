
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';

export interface Service {
  id: string;
  name: string;  // Required by both interface and implementation
  nome: string;  // The Portuguese equivalent used in the database
  descricao?: string;
  preco: number;
  duracao: number;
  categoria_id?: string;
  ativo: boolean;
  imagem_url?: string;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Function to fetch services that can be called to refresh data
  const fetchServices = useCallback(async () => {
    if (!businessId) {
      console.log('No business ID available, skipping services fetch');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching services for business ID:', businessId);
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.error("No active session found");
        setError("Sessão não encontrada. Faça login novamente.");
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('id_negocio', businessId)
        .eq('ativo', true);

      if (error) {
        console.error("Erro ao buscar serviços:", error);
        setError(error.message);
        toast.error("Não foi possível carregar os serviços.");
        return;
      }

      console.log('Services fetched successfully:', data?.length || 0, 'services');
      
      // Map the database columns to our service interface
      const mappedServices = (data || []).map(service => ({
        id: service.id,
        name: service.nome,  // Map nome to name as well
        nome: service.nome,
        descricao: service.descricao,
        preco: service.preco,
        duracao: service.duracao,
        categoria_id: service.id_categoria,
        ativo: service.ativo,
        imagem_url: service.imagem_url
      }));

      setServices(mappedServices);
    } catch (err: any) {
      console.error("Erro inesperado ao buscar serviços:", err);
      setError(err.message);
      toast.error("Erro ao carregar serviços.");
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  // Effect to fetch services when businessId changes or lastUpdate is updated
  useEffect(() => {
    fetchServices();
  }, [fetchServices, lastUpdate]);

  const createService = async (serviceData: Omit<Service, 'id'>) => {
    try {
      if (!businessId) {
        throw new Error("ID do negócio não disponível");
      }
      
      // Ensure we have an active session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      
      const { data, error } = await supabase
        .from('servicos')
        .insert([{
          nome: serviceData.nome || serviceData.name, // Use nome if available, otherwise use name
          descricao: serviceData.descricao,
          preco: serviceData.preco,
          duracao: serviceData.duracao,
          id_categoria: serviceData.categoria_id,
          ativo: serviceData.ativo ?? true,
          imagem_url: serviceData.imagem_url,
          id_negocio: businessId
        }])
        .select()
        .single();

      if (error) throw error;

      const newService: Service = {
        id: data.id,
        name: data.nome,  // Ensure name is set
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        duracao: data.duracao,
        categoria_id: data.id_categoria,
        ativo: data.ativo,
        imagem_url: data.imagem_url
      };
      
      // Update local state and force refresh
      setServices(prev => [...prev, newService]);
      toast.success("Serviço criado com sucesso!");
      setLastUpdate(Date.now()); // Force a refresh to ensure data consistency
      return newService;
      
    } catch (err: any) {
      console.error("Error creating service:", err);
      toast.error("Erro ao criar serviço: " + err.message);
      throw err;
    }
  };

  const updateService = async (id: string, serviceData: Partial<Service>) => {
    try {
      // Ensure we have an active session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      
      const updateData: any = {};
      
      // Map fields from the Service interface to database columns
      if (serviceData.name || serviceData.nome) updateData.nome = serviceData.nome || serviceData.name;
      if (serviceData.descricao !== undefined) updateData.descricao = serviceData.descricao;
      if (serviceData.preco !== undefined) updateData.preco = serviceData.preco;
      if (serviceData.duracao !== undefined) updateData.duracao = serviceData.duracao;
      if (serviceData.categoria_id !== undefined) updateData.id_categoria = serviceData.categoria_id;
      if (serviceData.ativo !== undefined) updateData.ativo = serviceData.ativo;
      if (serviceData.imagem_url !== undefined) updateData.imagem_url = serviceData.imagem_url;
      
      const { data, error } = await supabase
        .from('servicos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedService: Service = {
        id: data.id,
        name: data.nome,  // Ensure name is set
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        duracao: data.duracao,
        categoria_id: data.id_categoria,
        ativo: data.ativo,
        imagem_url: data.imagem_url
      };
      
      // Update local state
      setServices(prev => prev.map(service => 
        service.id === id ? updatedService : service
      ));
      
      toast.success("Serviço atualizado com sucesso!");
      setLastUpdate(Date.now()); // Force a refresh to ensure data consistency
      return updatedService;
      
    } catch (err: any) {
      console.error("Error updating service:", err);
      toast.error("Erro ao atualizar serviço: " + err.message);
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      // Ensure we have an active session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      
      // Instead of hard deleting, we set ativo = false
      const { error } = await supabase
        .from('servicos')
        .update({ ativo: false })
        .eq('id', id);

      if (error) throw error;

      // Remove from local state
      setServices(prev => prev.filter(service => service.id !== id));
      
      toast.success("Serviço removido com sucesso!");
      setLastUpdate(Date.now()); // Force a refresh to ensure data consistency
      return true;
      
    } catch (err: any) {
      console.error("Error deleting service:", err);
      toast.error("Erro ao remover serviço: " + err.message);
      throw err;
    }
  };

  // Function to manually refresh the services list
  const refreshServices = () => {
    setLastUpdate(Date.now());
  };

  return {
    services,
    isLoading,
    error,
    createService,
    updateService,
    deleteService,
    refreshServices
  };
};
