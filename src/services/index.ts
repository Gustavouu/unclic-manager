
// Export main services
export { authService } from './auth/authService';

// Export legacy client service functions
export { 
  fetchClients, 
  createClient, 
  findClientByEmail, 
  findClientByPhone 
} from './clientService';
