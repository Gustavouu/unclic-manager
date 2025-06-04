
// Export main services
export { authService } from './auth/authService';

// Export client service functions
export { 
  fetchClients, 
  createClient,
  updateClient,
  deleteClient,
  searchClients,
  getClientById,
  findClientByEmail, 
  findClientByPhone 
} from './clientService';
