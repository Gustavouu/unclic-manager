
// Export main services
export { authService } from './auth/authService';
export { clientOperations } from './client/clientOperations';
export { clientApi } from './client/clientApi';

// Export legacy client service functions
export { 
  fetchClients, 
  createClient, 
  findClientByEmail, 
  findClientByPhone 
} from './clientService';
