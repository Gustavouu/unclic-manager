
/**
 * Main hook for client management (aggregates all client hooks)
 */
import { useClientsList } from './clients/useClientsList';
import { useClientOperations } from './clients/useClientOperations';
import { useClientSearch } from './clients/useClientSearch';
import { Client, ClientFormData } from '@/types/client';

export type { Client } from '@/types/client';

export const useClients = (onClientCreated?: (client: Client) => void) => {
  const { clients, isLoading, error: fetchError, filterClients } = useClientsList();
  
  const { 
    createClient, 
    updateClient,
    deleteClient,
    findClientByEmail,
    findClientByPhone,
    isSubmitting, 
    error: operationError 
  } = useClientOperations(onClientCreated);

  const {
    searchClientByEmail,
    searchClientByPhone,
    clearSearch,
    searchResult,
    searchError,
    isSearching
  } = useClientSearch();

  // Aggregated error state
  const error = fetchError || operationError || searchError;

  return {
    // Client list operations
    clients,
    isLoading,
    filterClients,
    
    // CRUD operations
    createClient,
    updateClient,
    deleteClient,
    isSubmitting,
    
    // Search operations
    findClientByEmail,
    findClientByPhone,
    searchClientByEmail,
    searchClientByPhone,
    clearSearch,
    searchResult,
    isSearching,
    
    // Error handling
    error
  };
};

// For backward compatibility, export the operations directly
export { 
  fetchClients,
  createClient, 
  findClientByEmail,
  findClientByPhone,
  updateClient,
  deleteClient
} from '@/services/client/clientOperations';
