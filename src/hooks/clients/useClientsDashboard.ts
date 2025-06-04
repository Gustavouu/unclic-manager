
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  fetchClients, 
  createClient, 
  updateClient, 
  deleteClient, 
  findClientByEmail, 
  findClientByPhone,
  searchClients,
  getClientById
} from '@/services/clientService';
import { Client, ClientFormData, ClientFilters, ClientSearchParams } from '@/types/client';
import { toast } from 'sonner';

export function useClientsDashboard() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClientFilters>({
    search: '',
    status: '',
    city: '',
    gender: '',
    dateRange: '',
    spendingRange: ''
  });

  // Get business ID from localStorage or user context
  const getBusinessId = useCallback(() => {
    const businessId = localStorage.getItem('businessId') || localStorage.getItem('business_id');
    if (!businessId && user) {
      console.warn('No business ID found for user:', user.id);
    }
    return businessId;
  }, [user]);

  // Load clients
  const loadClients = useCallback(async () => {
    const businessId = getBusinessId();
    if (!businessId) {
      setIsLoading(false);
      setClients([]);
      setFilteredClients([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const clientsData = await fetchClients(businessId);
      setClients(clientsData);
      setFilteredClients(clientsData);
    } catch (err: any) {
      console.error('Error loading clients:', err);
      setError(err.message || 'Erro ao carregar clientes');
      toast.error('Erro ao carregar clientes');
    } finally {
      setIsLoading(false);
    }
  }, [getBusinessId]);

  // Search clients
  const searchClientsList = useCallback(async (searchParams: ClientSearchParams) => {
    const businessId = getBusinessId();
    if (!businessId) return [];

    try {
      const params = {
        ...searchParams,
        business_id: businessId
      };
      
      return await searchClients(params);
    } catch (err: any) {
      console.error('Error searching clients:', err);
      toast.error('Erro ao buscar clientes');
      return [];
    }
  }, [getBusinessId]);

  // Create new client
  const handleCreateClient = useCallback(async (clientData: ClientFormData): Promise<Client | null> => {
    const businessId = getBusinessId();
    if (!businessId) {
      toast.error('ID do negócio não encontrado');
      return null;
    }

    try {
      const newClient = await createClient(clientData, businessId);
      setClients(prev => [...prev, newClient]);
      await loadClients(); // Refresh the list
      return newClient;
    } catch (err: any) {
      console.error('Error creating client:', err);
      return null;
    }
  }, [getBusinessId, loadClients]);

  // Update client
  const handleUpdateClient = useCallback(async (id: string, clientData: Partial<Client>): Promise<Client | null> => {
    try {
      const updatedClient = await updateClient(id, clientData);
      setClients(prev => prev.map(c => c.id === id ? updatedClient : c));
      await loadClients(); // Refresh the list
      return updatedClient;
    } catch (err: any) {
      console.error('Error updating client:', err);
      return null;
    }
  }, [loadClients]);

  // Delete client
  const handleDeleteClient = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteClient(id);
      setClients(prev => prev.filter(c => c.id !== id));
      await loadClients(); // Refresh the list
      return true;
    } catch (err: any) {
      console.error('Error deleting client:', err);
      return false;
    }
  }, [loadClients]);

  // Find client by email
  const findClientByEmailAddress = useCallback(async (email: string): Promise<Client | null> => {
    const businessId = getBusinessId();
    if (!businessId) return null;

    try {
      return await findClientByEmail(email, businessId);
    } catch (err: any) {
      console.error('Error finding client by email:', err);
      return null;
    }
  }, [getBusinessId]);

  // Find client by phone
  const findClientByPhoneNumber = useCallback(async (phone: string): Promise<Client | null> => {
    const businessId = getBusinessId();
    if (!businessId) return null;

    try {
      return await findClientByPhone(phone, businessId);
    } catch (err: any) {
      console.error('Error finding client by phone:', err);
      return null;
    }
  }, [getBusinessId]);

  // Get client by ID
  const getClient = useCallback(async (id: string): Promise<Client | null> => {
    try {
      return await getClientById(id);
    } catch (err: any) {
      console.error('Error getting client by ID:', err);
      return null;
    }
  }, []);

  // Apply filters
  const applyFilters = useCallback((newFilters: Partial<ClientFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    let filtered = [...clients];

    // Search filter
    if (newFilters.search || filters.search) {
      const searchTerm = (newFilters.search !== undefined ? newFilters.search : filters.search).toLowerCase();
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        client.phone.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (newFilters.status || filters.status) {
      const status = newFilters.status !== undefined ? newFilters.status : filters.status;
      if (status) {
        filtered = filtered.filter(client => client.status === status);
      }
    }

    // City filter
    if (newFilters.city || filters.city) {
      const city = newFilters.city !== undefined ? newFilters.city : filters.city;
      if (city) {
        filtered = filtered.filter(client => client.city === city);
      }
    }

    // Gender filter
    if (newFilters.gender || filters.gender) {
      const gender = newFilters.gender !== undefined ? newFilters.gender : filters.gender;
      if (gender) {
        filtered = filtered.filter(client => client.gender === gender);
      }
    }

    setFilteredClients(filtered);
  }, [clients, filters]);

  // Load clients on mount
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // Reapply filters when clients change
  useEffect(() => {
    applyFilters({});
  }, [clients, applyFilters]);

  return {
    clients: filteredClients,
    allClients: clients,
    isLoading,
    error,
    filters,
    loadClients,
    searchClients: searchClientsList,
    createClient: handleCreateClient,
    updateClient: handleUpdateClient,
    deleteClient: handleDeleteClient,
    findClientByEmail: findClientByEmailAddress,
    findClientByPhone: findClientByPhoneNumber,
    getClientById: getClient,
    applyFilters,
    setFilters
  };
}
