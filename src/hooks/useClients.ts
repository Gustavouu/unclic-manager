
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  birth_date?: string | Date;
  gender?: string;
  notes?: string;
  last_visit?: string | Date;
  total_spent?: number;
  business_id: string;
  created_at: string;
  updated_at: string;
  status?: 'active' | 'inactive';
}

export interface ClientFormData {
  nome?: string;
  name?: string;
  email?: string;
  telefone?: string;
  phone?: string;
  cidade?: string;
  city?: string;
  estado?: string;
  state?: string;
  address?: string;
  gender?: string;
  notes?: string;
}

export const useClients = (onClientCreated?: (client: any) => void) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  const fetchClients = useCallback(async () => {
    if (!businessId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // First, try to fetch from the new clients table
      let { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('business_id', businessId);

      if (error) throw error;

      // If we got data from the new table, use it
      if (data && data.length > 0) {
        const formattedClients = data.map(client => ({
          ...client,
          status: client.last_visit ? 'active' : 'inactive'
        }));
        setClients(formattedClients);
      } else {
        // If no data from new table, try the legacy table
        const { data: legacyData, error: legacyError } = await supabase
          .from('clientes')
          .select('*')
          .eq('id_negocio', businessId);

        if (legacyError) throw legacyError;

        const formattedClients = (legacyData || []).map(client => ({
          id: client.id,
          name: client.nome,
          email: client.email,
          phone: client.telefone,
          city: client.cidade,
          state: client.estado,
          address: client.endereco,
          birth_date: client.data_nascimento,
          gender: client.genero,
          notes: client.notas,
          last_visit: client.ultima_visita,
          total_spent: client.valor_total_gasto,
          business_id: client.id_negocio,
          created_at: client.criado_em,
          updated_at: client.atualizado_em,
          status: client.ultima_visita ? 'active' : 'inactive'
        }));
        
        setClients(formattedClients);
      }
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  const createClient = async (formData: ClientFormData) => {
    if (!businessId) {
      setError('Business ID is required');
      return null;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Map the form data to the appropriate schema
      const clientData = {
        business_id: businessId,
        name: formData.name || formData.nome,
        email: formData.email,
        phone: formData.phone || formData.telefone,
        city: formData.city || formData.cidade,
        state: formData.state || formData.estado,
        address: formData.address,
        gender: formData.gender,
        notes: formData.notes
      };

      // Insert into the new clients table
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;

      const newClient = {
        ...data,
        status: 'active'
      };

      setClients(prev => [...prev, newClient]);
      toast.success('Cliente criado com sucesso!');
      
      if (onClientCreated) {
        onClientCreated(newClient);
      }

      return newClient;
    } catch (err: any) {
      console.error('Error creating client:', err);
      setError(err.message);
      toast.error('Erro ao criar cliente');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    isLoading,
    isSubmitting,
    error,
    fetchClients,
    createClient
  };
};
