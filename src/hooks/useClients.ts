
import { useClientsData } from './clients/useClientsData';
import { useClientOperations } from './clients/useClientOperations';

export const useClients = () => {
  const clientsData = useClientsData();
  const operations = useClientOperations();
  
  return {
    ...clientsData,
    ...operations,
  };
};

// Export types for convenience
export type { Client, ClientFormData } from '@/types/client';
