
/**
 * Hook for listing and filtering clients
 */
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTenant } from '@/contexts/TenantContext';
import { Client } from '@/types/client';
import { fetchClients } from '@/services/client/clientOperations';
import { getClientErrorMessage } from '@/services/client/clientUtils';

export function useClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  useEffect(() => {
    const loadClients = async () => {
      if (!businessId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await fetchClients(businessId || '');
        
        if (result.success && result.data) {
          setClients(result.data);
        } else {
          setError(result.error || 'Erro ao carregar clientes');
          toast.error("Erro ao carregar clientes.");
        }
      } catch (err: any) {
        const errorMessage = getClientErrorMessage(err);
        setError(errorMessage);
        toast.error("Erro ao carregar clientes.");
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, [businessId]);

  const filterClients = (filters: {
    status?: string;
    search?: string;
    city?: string;
    state?: string;
  }) => {
    return clients.filter(client => {
      // Filter by status
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'active' && client.status !== 'active') return false;
        if (filters.status === 'inactive' && client.status !== 'inactive') return false;
      }
      
      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const nameMatch = client.nome?.toLowerCase().includes(searchTerm) || false;
        const emailMatch = client.email?.toLowerCase().includes(searchTerm) || false;
        const phoneMatch = client.telefone?.includes(searchTerm) || false;
        
        if (!nameMatch && !emailMatch && !phoneMatch) return false;
      }
      
      // Filter by city
      if (filters.city && client.cidade !== filters.city) return false;
      
      // Filter by state
      if (filters.state && client.estado !== filters.state) return false;
      
      return true;
    });
  };

  return { clients, isLoading, error, filterClients };
}
