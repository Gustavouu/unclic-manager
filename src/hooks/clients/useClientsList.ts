
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import { Client } from "@/types/client";

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
      // and map properties to align with the Client interface
      const clientsWithStatus = (data || []).map(client => ({
        ...client,
        name: client.nome, // Add name field to match with Client interface
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
  
  // Add the missing filterClients method
  const filterClients = (searchTerm: string): Client[] => {
    if (!searchTerm) return clients;
    
    const lowercasedTerm = searchTerm.toLowerCase();
    
    return clients.filter(client => 
      client.nome?.toLowerCase().includes(lowercasedTerm) ||
      client.email?.toLowerCase().includes(lowercasedTerm) ||
      client.telefone?.toLowerCase().includes(lowercasedTerm) ||
      client.cidade?.toLowerCase().includes(lowercasedTerm)
    );
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
        name: data.nome, // Add name field to match Client interface
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
      const { status, name, ...clientUpdates } = updates;
      
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
    updateClient,
    filterClients
  };
};
