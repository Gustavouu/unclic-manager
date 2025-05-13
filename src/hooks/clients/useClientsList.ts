
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";

export interface Client {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  data_nascimento?: string;
  genero?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  notas?: string;
  preferencias?: Record<string, any>;
  ultima_visita?: string;
  valor_total_gasto?: number;
  criado_em: string;
  status?: 'active' | 'inactive';
}

export const useClientsList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();
  
  const fetchClients = async () => {
    if (!businessId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id_negocio', businessId);
        
      if (error) throw error;
      
      // Add a calculated status field based on some business logic
      const clientsWithStatus = (data || []).map(client => ({
        ...client,
        status: client.ultima_visita ? 'active' : 'inactive'
      })) as Client[];
      
      setClients(clientsWithStatus);
    } catch (err: any) {
      console.error("Error fetching clients:", err);
      setError(err.message || "Failed to load clients");
      toast.error("Erro ao carregar clientes");
    } finally {
      setIsLoading(false);
    }
  };
  
  const addClient = async (client: Omit<Client, 'id' | 'criado_em' | 'status'>) => {
    if (!businessId) {
      toast.error("ID do negócio não disponível");
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert([{
          ...client,
          id_negocio: businessId
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      const newClient = {
        ...data,
        status: 'active'
      } as Client;
      
      setClients(prev => [...prev, newClient]);
      toast.success("Cliente adicionado com sucesso!");
      return newClient;
    } catch (err: any) {
      console.error("Error adding client:", err);
      toast.error("Erro ao adicionar cliente");
      return null;
    }
  };
  
  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      // Remove calculated fields
      const { status, ...clientUpdates } = updates;
      
      const { error } = await supabase
        .from('clientes')
        .update(clientUpdates)
        .eq('id', id);
        
      if (error) throw error;
      
      setClients(prev =>
        prev.map(client => 
          client.id === id ? { ...client, ...updates } : client
        )
      );
      
      toast.success("Cliente atualizado com sucesso!");
      return true;
    } catch (err: any) {
      console.error("Error updating client:", err);
      toast.error("Erro ao atualizar cliente");
      return false;
    }
  };
  
  useEffect(() => {
    fetchClients();
    
    // Subscribe to client changes
    const clientsChannel = supabase
      .channel('clients-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clientes' },
        () => {
          fetchClients(); // Refresh when clients data changes
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(clientsChannel);
    };
  }, [businessId]);
  
  return {
    clients,
    isLoading,
    error,
    fetchClients,
    addClient,
    updateClient
  };
};
