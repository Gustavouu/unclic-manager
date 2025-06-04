
import { useClients } from '@/hooks/useClients';

export const useClientsDashboard = () => {
  const { clients, isLoading, error, createClient, updateClient, deleteClient, refetch } = useClients();

  const findClientByEmail = (email: string) => {
    return clients.find(client => client.email?.toLowerCase() === email.toLowerCase());
  };

  return {
    clients,
    isLoading,
    error,
    createClient,
    updateClient,
    deleteClient,
    refetch,
    findClientByEmail,
  };
};
