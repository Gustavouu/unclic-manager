
import { useState, useEffect } from 'react';
import { ServiceData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useServicesState = () => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch services from Supabase when the hook is initialized
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('servicos')
          .select('*')
          .eq('ativo', true);

        if (error) {
          throw error;
        }

        if (data) {
          // Map database services to ServiceData format
          const mappedServices = data.map(service => ({
            id: service.id,
            name: service.nome,
            duration: service.duracao,
            price: service.preco,
            description: service.descricao || undefined
          }));
          
          setServices(mappedServices);
        }
      } catch (error: any) {
        console.error('Error fetching services:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Function to add a new service
  const addService = async (service: ServiceData) => {
    try {
      // Insert the service into the database
      const { data, error } = await supabase
        .from('servicos')
        .insert({
          nome: service.name,
          duracao: service.duration,
          preco: service.price,
          descricao: service.description,
          ativo: true
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add the new service to the local state with the generated ID from the database
      if (data) {
        const newService = {
          ...service,
          id: data.id
        };
        
        setServices(prev => [...prev, newService]);
      }
      
      return data;
    } catch (error: any) {
      console.error('Error adding service:', error);
      toast.error(`Erro ao adicionar serviço: ${error.message}`);
      throw error;
    }
  };

  // Function to remove a service
  const removeService = async (id: string) => {
    try {
      // In Supabase, we're setting ativo to false instead of deleting
      const { error } = await supabase
        .from('servicos')
        .update({ ativo: false })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Remove the service from local state
      setServices(prev => prev.filter(service => service.id !== id));
    } catch (error: any) {
      console.error('Error removing service:', error);
      toast.error(`Erro ao remover serviço: ${error.message}`);
      throw error;
    }
  };

  // Function to update a service
  const updateService = async (id: string, data: Partial<ServiceData>) => {
    try {
      // Map to database column names
      const dbData: any = {};
      if (data.name !== undefined) dbData.nome = data.name;
      if (data.duration !== undefined) dbData.duracao = data.duration;
      if (data.price !== undefined) dbData.preco = data.price;
      if (data.description !== undefined) dbData.descricao = data.description;
      
      // Update in the database
      const { error } = await supabase
        .from('servicos')
        .update(dbData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update in local state
      setServices(prev =>
        prev.map(service => (service.id === id ? { ...service, ...data } : service))
      );
    } catch (error: any) {
      console.error('Error updating service:', error);
      toast.error(`Erro ao atualizar serviço: ${error.message}`);
      throw error;
    }
  };

  return {
    services,
    setServices,
    addService,
    removeService,
    updateService,
    loading,
    error
  };
};
