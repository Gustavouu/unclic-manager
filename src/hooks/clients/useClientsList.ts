
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  last_visit?: string;
  status: string;
  business_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useClientsList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  const fetchClients = async () => {
    if (!businessId) {
      console.log('No business ID available, skipping clients fetch');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Use the clients table which exists in the database
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }

      if (!data) {
        setClients([]);
        return;
      }

      // Map the data to our Client interface
      const mappedClients: Client[] = data.map((client: any) => ({
        id: client.id,
        name: client.name || client.nome || 'Cliente',
        email: client.email,
        phone: client.phone || client.telefone,
        city: client.city || client.cidade,
        last_visit: client.last_visit || client.ultima_visita,
        status: 'active',
        business_id: client.business_id || client.id_negocio,
        created_at: client.created_at || client.criado_em,
        updated_at: client.updated_at || client.atualizado_em,
      }));

      setClients(mappedClients);
    } catch (err: any) {
      console.error('Error in fetchClients:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const searchClients = async (searchTerm: string) => {
    if (!businessId) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('business_id', businessId)
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedClients: Client[] = (data || []).map((client: any) => ({
        id: client.id,
        name: client.name || client.nome || 'Cliente',
        email: client.email,
        phone: client.phone || client.telefone,
        city: client.city || client.cidade,
        last_visit: client.last_visit || client.ultima_visita,
        status: 'active',
        business_id: client.business_id || client.id_negocio,
        created_at: client.created_at || client.criado_em,
        updated_at: client.updated_at || client.atualizado_em,
      }));

      setClients(mappedClients);
    } catch (err: any) {
      console.error('Error searching clients:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [businessId]);

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    searchClients,
  };
};
