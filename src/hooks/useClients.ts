
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTenant } from '@/contexts/TenantContext';

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
  tenant_id?: string; // Added standard field
  id_negocio?: string; // Original field
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  useEffect(() => {
    const fetchClients = async () => {
      if (!businessId) {
        console.log('No business ID available, skipping client fetch');
        return;
      }

      setIsLoading(true);
      try {
        console.log('Fetching clients for business ID:', businessId);
        
        // Query using both field names to ensure compatibility
        const { data, error } = await supabase
          .from('clientes')
          .select('*')
          .or(`id_negocio.eq.${businessId},tenant_id.eq.${businessId}`);

        if (error) {
          console.error("Erro ao buscar clientes:", error);
          setError(error.message);
          toast.error("Não foi possível carregar os clientes.");
          return;
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
          notas: client.notas,
          tenant_id: client.tenant_id,
          id_negocio: client.id_negocio
        }));

        setClients(mappedClients);
      } catch (err: any) {
        console.error("Erro inesperado ao buscar clientes:", err);
        setError(err.message);
        toast.error("Erro ao carregar clientes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [businessId, toast]);

  const createClient = async (clientData: Partial<Client>) => {
    try {
      if (!businessId) {
        throw new Error("ID do negócio não disponível");
      }
      
      console.log('Creating client for business ID:', businessId, clientData);
      
      // Certifique-se de que o usuário esteja autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("Usuário não autenticado");
        toast.error("Você precisa estar autenticado para criar clientes");
        throw new Error("Usuário não autenticado");
      }
      
      // Include both tenant_id and id_negocio for compatibility
      const dataToInsert = {
        ...clientData,
        id_negocio: businessId,
        tenant_id: businessId // Adding standard field
      };

      const { data, error } = await supabase
        .from('clientes')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) {
        console.error("Error creating client:", error);
        throw error;
      }

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
        notas: data.notas,
        tenant_id: data.tenant_id,
        id_negocio: data.id_negocio
      };
      
      setClients(prev => [...prev, newClient]);
      toast.success("Cliente criado com sucesso!");
      return newClient;
      
    } catch (err: any) {
      console.error("Error creating client:", err);
      toast.error("Erro ao criar cliente: " + err.message);
      throw err;
    }
  };

  const findClientByEmail = async (email: string) => {
    try {
      if (!businessId) {
        throw new Error("ID do negócio não disponível");
      }
      
      console.log('Finding client by email for business ID:', businessId, email);
      
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('email', email)
        .or(`id_negocio.eq.${businessId},tenant_id.eq.${businessId}`)
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
        notas: data.notas,
        tenant_id: data.tenant_id,
        id_negocio: data.id_negocio
      };
      
    } catch (err: any) {
      console.error("Error finding client:", err);
      return null;
    }
  };

  const findClientByPhone = async (phone: string) => {
    try {
      if (!businessId) {
        throw new Error("ID do negócio não disponível");
      }
      
      console.log('Finding client by phone for business ID:', businessId, phone);
      
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('telefone', phone)
        .or(`id_negocio.eq.${businessId},tenant_id.eq.${businessId}`)
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
        notas: data.notas,
        tenant_id: data.tenant_id, 
        id_negocio: data.id_negocio
      };
      
    } catch (err: any) {
      console.error("Error finding client by phone:", err);
      return null;
    }
  };

  return { 
    clients, 
    isLoading, 
    error, 
    createClient, 
    findClientByEmail,
    findClientByPhone
  };
};
