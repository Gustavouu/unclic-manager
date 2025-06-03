
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  last_visit: string;
  status: string;
}

export const useClientsList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { businessId } = useCurrentBusiness();

  const fetchClients = async () => {
    if (!businessId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, nome, email, telefone, cidade, ultima_visita')
        .eq('id_negocio', businessId);

      if (error) throw error;

      const normalizedClients = data?.map(client => ({
        id: client.id,
        name: client.nome || '',
        email: client.email || '',
        phone: client.telefone || '',
        city: client.cidade || '',
        last_visit: client.ultima_visita || '',
        status: 'active'
      })) || [];

      setClients(normalizedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchClients = async (searchTerm: string) => {
    if (!businessId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, nome, email, telefone, cidade, ultima_visita')
        .eq('id_negocio', businessId)
        .or(`nome.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,telefone.ilike.%${searchTerm}%`);

      if (error) throw error;

      const normalizedClients = data?.map(client => ({
        id: client.id,
        name: client.nome || '',
        email: client.email || '',
        phone: client.telefone || '',
        city: client.cidade || '',
        last_visit: client.ultima_visita || '',
        status: 'active'
      })) || [];

      setClients(normalizedClients);
    } catch (error) {
      console.error('Error searching clients:', error);
      setClients([]);
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
    searchClients,
    refetch: fetchClients
  };
};
