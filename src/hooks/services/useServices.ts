
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
  category_id?: string;
  commission_percentage?: number;
  image_url?: string;
  is_active: boolean;
  isActive?: boolean; // Alias for is_active for compatibility with components
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { businessId } = useTenant();
  
  const fetchServices = async () => {
    if (!businessId) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('servicos')
        .select('*, categorias:category_id(id, name)')
        .eq('business_id', businessId);
        
      if (error) throw error;
      
      // Add the isActive alias for compatibility
      const processedServices = (data || []).map(service => ({
        ...service,
        isActive: service.is_active
      }));
      
      setServices(processedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Erro ao carregar serviços");
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    if (!businessId) return;
    
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('id, name')
        .eq('business_id', businessId)
        .eq('type', 'servico');
        
      if (error) throw error;
      
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Erro ao carregar categorias");
    }
  };
  
  const createService = async (service: Omit<Service, 'id' | 'is_active' | 'isActive'>) => {
    if (!businessId) {
      toast.error("ID do negócio não disponível");
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('servicos')
        .insert([{
          ...service,
          business_id: businessId,
          is_active: true
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      const newService = {
        ...data,
        isActive: data.is_active
      };
      
      setServices(prev => [...prev, newService]);
      
      toast.success("Serviço criado com sucesso!");
      return newService;
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Erro ao criar serviço");
      return null;
    }
  };
  
  const updateService = async (id: string, updates: Partial<Omit<Service, 'id' | 'isActive'>>) => {
    try {
      // Handle the isActive/is_active mapping if it's in the updates
      const dbUpdates = { ...updates };
      if ('is_active' in updates) {
        dbUpdates.is_active = updates.is_active;
      }
      
      const { error } = await supabase
        .from('servicos')
        .update(dbUpdates)
        .eq('id', id);
        
      if (error) throw error;
      
      setServices(prev =>
        prev.map(service => 
          service.id === id 
            ? { 
                ...service, 
                ...updates, 
                isActive: 'is_active' in updates ? updates.is_active : service.isActive 
              } 
            : service
        )
      );
      
      toast.success("Serviço atualizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Erro ao atualizar serviço");
      return false;
    }
  };
  
  const toggleServiceActive = async (id: string, active: boolean) => {
    return updateService(id, { is_active: active });
  };
  
  useEffect(() => {
    fetchServices();
    fetchCategories();
    
    // Subscribe to service changes
    const servicesChannel = supabase
      .channel('services-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'servicos' },
        () => {
          fetchServices(); // Refresh when services change
        }
      )
      .subscribe();
      
    const categoriesChannel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categorias' },
        () => {
          fetchCategories(); // Refresh when categories change
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(servicesChannel);
      supabase.removeChannel(categoriesChannel);
    };
  }, [businessId]);
  
  return {
    services,
    categories,
    isLoading,
    fetchServices,
    createService,
    updateService,
    toggleServiceActive
  };
};
