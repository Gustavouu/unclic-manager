
// Export main services
export { authService } from './auth/authService';
export * from './client/clientOperations';
export * from './client/clientApi';

// Export legacy client service functions
export { 
  fetchClients, 
  createClientApi as createClient, 
  findClientByEmail, 
  findClientByPhone 
} from './clientService';
