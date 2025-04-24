
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast"
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

export interface Client {
  id: string;
  name: string;
  nome: string; // Portuguese version of name
  email?: string;
  phone?: string;
  telefone?: string; // Portuguese version of phone
  ultima_visita?: string;
  valor_total_gasto?: number;
  total_agendamentos?: number;
  status?: 'active' | 'inactive';
  criado_em?: string;
  cidade?: string;
  estado?: string;
  notas?: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { businessId } = useCurrentBusiness();

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('clientes')
          .select('*');

        if (error) {
          console.error("Erro ao buscar clientes:", error);
          setError(error.message);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          })
        }

        // Map the database columns to our client interface
        const mappedClients = (data || []).map(client => ({
          id: client.id,
          name: client.nome,
          nome: client.nome,
          email: client.email,
          phone: client.telefone,
          telefone: client.telefone,
          ultima_visita: client.ultima_visita,
          valor_total_gasto: client.valor_total_gasto,
          total_agendamentos: client.total_agendamentos,
          status: client.status || 'active',
          criado_em: client.criado_em,
          cidade: client.cidade,
          estado: client.estado,
          notas: client.notas
        }));

        setClients(mappedClients);
      } catch (err: any) {
        console.error("Erro inesperado ao buscar clientes:", err);
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [toast, businessId]);

  // Add methods to create, find, and manage clients
  const createClient = async (clientData: Partial<Client>) => {
    try {
      if (!businessId) {
        throw new Error("Business ID not available");
      }
      
      const { data, error } = await supabase
        .from('clientes')
        .insert([{
          ...clientData,
          id_negocio: businessId
        }])
        .select()
        .single();

      if (error) throw error;

      // Map the database response to our client interface
      const newClient: Client = {
        id: data.id,
        name: data.nome,
        nome: data.nome,
        email: data.email,
        phone: data.telefone,
        telefone: data.telefone,
        ultima_visita: data.ultima_visita,
        valor_total_gasto: data.valor_total_gasto || 0,
        total_agendamentos: data.total_agendamentos || 0,
        status: data.status || 'active',
        criado_em: data.criado_em,
        cidade: data.cidade,
        estado: data.estado,
        notas: data.notas
      };
      
      setClients(prev => [...prev, newClient]);
      return newClient;
      
    } catch (err: any) {
      console.error("Error creating client:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create client: " + err.message,
      });
      throw err;
    }
  };

  const findClientByEmail = async (email: string) => {
    try {
      if (!businessId) {
        throw new Error("Business ID not available");
      }
      
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('email', email)
        .eq('id_negocio', businessId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) return null;
      
      // Map database fields to our client interface
      return {
        id: data.id,
        name: data.nome,
        nome: data.nome,
        email: data.email,
        phone: data.telefone,
        telefone: data.telefone,
        ultima_visita: data.ultima_visita,
        valor_total_gasto: data.valor_total_gasto || 0,
        status: data.status || 'active',
        criado_em: data.criado_em,
        cidade: data.cidade,
        estado: data.estado,
        notas: data.notas
      };
      
    } catch (err: any) {
      console.error("Error finding client:", err);
      return null;
    }
  };

  return { 
    clients, 
    isLoading, 
    error, 
    createClient, 
    findClientByEmail 
  };
};
