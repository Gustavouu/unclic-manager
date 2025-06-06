
import { useState, useEffect, useCallback } from 'react';
import { ClientService } from '@/services/clients/clientService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Client, ClientFormData, ClientSearchParams, ClientStats } from '@/types/client';
import { toast } from 'sonner';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ClientStats>({
    total: 0,
    active: 0,
    inactive: 0,
    new_this_month: 0,
    total_spent: 0,
    average_spent: 0,
    last_30_days: 0,
  });

  const { businessId } = useCurrentBusiness();
  const clientService = ClientService.getInstance();

  const fetchClients = useCallback(async (searchParams?: Partial<ClientSearchParams>) => {
    if (!businessId) {
      console.log('No business ID available, skipping clients fetch');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching clients for business ID:', businessId);

      const params: ClientSearchParams = {
        business_id: businessId,
        ...searchParams,
      };

      const clientsData = await clientService.search(params);
      const statsData = await clientService.getStats(businessId);

      setClients(clientsData);
      setStats(statsData);
      console.log(`Successfully loaded ${clientsData.length} clients`);
    } catch (err) {
      console.error('Error in fetchClients:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar clientes';
      setError(errorMessage);
      toast.error(errorMessage);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  }, [businessId, clientService]);

  const createClient = useCallback(async (data: ClientFormData): Promise<Client> => {
    if (!businessId) throw new Error('Business ID não encontrado');

    try {
      const newClient = await clientService.create({ ...data, business_id: businessId });
      setClients(prev => [newClient, ...prev]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        active: data.status === 'active' ? prev.active + 1 : prev.active,
        inactive: data.status === 'inactive' ? prev.inactive + 1 : prev.inactive,
      }));

      return newClient;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }, [businessId, clientService]);

  const updateClient = useCallback(async (id: string, data: Partial<ClientFormData>): Promise<Client> => {
    try {
      const updatedClient = await clientService.update(id, data);
      setClients(prev => prev.map(client => 
        client.id === id ? updatedClient : client
      ));
      return updatedClient;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }, [clientService]);

  const deleteClient = useCallback(async (id: string): Promise<void> => {
    try {
      await clientService.delete(id);
      setClients(prev => prev.filter(client => client.id !== id));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }, [clientService]);

  const getClientById = useCallback(async (id: string): Promise<Client> => {
    try {
      return await clientService.getById(id);
    } catch (error) {
      console.error('Error fetching client by ID:', error);
      throw error;
    }
  }, [clientService]);

  const searchClients = useCallback(async (searchParams: Partial<ClientSearchParams>) => {
    await fetchClients(searchParams);
  }, [fetchClients]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    stats,
    isLoading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    getClientById,
    searchClients,
  };
}
