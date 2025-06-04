
// Export main services
export { authService } from './auth/authService';
export * from './client/clientOperations';
export * from './client/clientApi';

// Export legacy client service functions
export { 
  fetchClients, 
  createClient, 
  findClientByEmail, 
  findClientByPhone 
} from './clientService';

// Export client API functions with aliases for backward compatibility
export { 
  createClientApi, 
  fetchClients as fetchClientsApi 
} from './client/clientApi';
