
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTenant } from '@/contexts/TenantContext';
import { Client } from '@/types/client';
import { 
  fetchClients as fetchClientsService,
  createClient as createClientService,
  findClientByEmail as findClientByEmailService,
  findClientByPhone as findClientByPhoneService
} from '@/services/clientService';

export type { Client } from '@/types/client';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      try {
        const clientsData = await fetchClientsService(businessId || '');
        setClients(clientsData);
      } catch (err: any) {
        setError(err.message);
        toast.error("Erro ao carregar clientes.");
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, [businessId]);

  const createClient = async (clientData: Partial<Client>) => {
    try {
      if (!businessId) {
        throw new Error("ID do negócio não disponível");
      }
      
      const newClient = await createClientService(clientData, businessId);
      setClients(prev => [...prev, newClient]);
      toast.success("Cliente criado com sucesso!");
      return newClient;
    } catch (err: any) {
      toast.error("Erro ao criar cliente: " + err.message);
      throw err;
    }
  };

  const findClientByEmail = async (email: string) => {
    if (!businessId) return null;
    return findClientByEmailService(email, businessId);
  };

  const findClientByPhone = async (phone: string) => {
    if (!businessId) return null;
    return findClientByPhoneService(phone, businessId);
  };

  return { 
    clients, 
    isLoading, 
    error, 
    createClient, 
    findClientByEmail,
    findClientByPhone
  };
};
