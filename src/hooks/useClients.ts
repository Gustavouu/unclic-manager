
import { useState, useEffect } from 'react';
import { ClientService } from '@/services/client/clientService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Client, ClientCreate, ClientUpdate } from '@/types/client';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const createClient = async (data: Omit<ClientCreate, 'business_id'>) => {
    if (!businessId) throw new Error('No business selected');
    
    setIsSubmitting(true);
    try {
      const newClient = await clientService.create({
        ...data,
        business_id: businessId,
      });
      
      await fetchClients();
      return newClient;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateClient = async (id: string, data: ClientUpdate) => {
    await clientService.update(id, data);
    await fetchClients();
  };

  const deleteClient = async (id: string) => {
    await clientService.delete(id);
    await fetchClients();
  };

  const searchClients = async (searchTerm: string) => {
    if (!businessId) return [];
    return clientService.search({ 
      business_id: businessId, 
      search: searchTerm 
    });
  };

  const findClientByEmail = async (email: string) => {
    if (!businessId) return null;
    const results = await clientService.search({
      business_id: businessId,
      search: email
    });
    return results.find(client => client.email === email) || null;
  };

  return {
    clients,
    isLoading,
    isSubmitting,
    error,
    refetch: fetchClients,
    createClient,
    updateClient,
    deleteClient,
    searchClients,
    findClientByEmail,
  };
};

// Export types for convenience
export type { Client, ClientCreate, ClientUpdate } from '@/types/client';
