
import { useState, useEffect } from 'react';
import { ClientService } from '@/services/client/clientService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Client, ClientCreate, ClientUpdate, ClientFormData } from '@/types/client';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

  const clientService = ClientService.getInstance();

  const fetchClients = async () => {
    if (!businessId) {
      setClients([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await clientService.getByBusinessId(businessId);
      setClients(data);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [businessId]);

  const createClient = async (data: ClientFormData) => {
    if (!businessId) throw new Error('No business selected');
    
    const clientCreate: ClientCreate = {
      ...data,
      business_id: businessId,
    };
    
    const newClient = await clientService.create(clientCreate);
    await fetchClients();
    return newClient;
  };

  const updateClient = async (id: string, data: ClientUpdate) => {
    await clientService.update(id, data);
    await fetchClients();
  };

  const deleteClient = async (id: string) => {
    await clientService.delete(id);
    await fetchClients();
  };

  return {
    clients,
    isLoading,
    error,
    refetch: fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
};
