
/**
 * Hook for CRUD operations on clients
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { useTenant } from '@/contexts/TenantContext';
import { Client, ClientFormData } from '@/types/client';
import { 
  createClient, 
  updateClient, 
  deleteClient,
  findClientByEmail,
  findClientByPhone
} from '@/services/client/clientOperations';
import { getClientErrorMessage } from '@/services/client/clientUtils';

export function useClientOperations(onSuccess?: (client: Client) => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  const handleCreateClient = async (clientData: ClientFormData): Promise<Client | null> => {
    if (!businessId) {
      setError("ID do negócio não disponível");
      toast.error("Erro ao criar cliente: ID do negócio não disponível");
      return null;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await createClient(businessId, clientData);
      
      if (result.success && result.data) {
        toast.success("Cliente criado com sucesso!");
        if (onSuccess && result.data) {
          onSuccess(result.data);
        }
        return result.data;
      } else {
        const errorMessage = result.error ? getClientErrorMessage(result.error) : 'Erro ao criar cliente';
        setError(errorMessage);
        toast.error(`Erro ao criar cliente: ${errorMessage}`);
        return null;
      }
    } catch (err: any) {
      const errorMessage = getClientErrorMessage(err);
      setError(errorMessage);
      toast.error(`Erro ao criar cliente: ${errorMessage}`);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateClient = async (id: string, clientData: Partial<ClientFormData>): Promise<Client | null> => {
    if (!businessId || !id) {
      setError("ID do negócio ou do cliente não disponível");
      toast.error("Erro ao atualizar cliente: Dados incompletos");
      return null;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await updateClient(id, clientData, businessId);
      
      if (result.success && result.data) {
        toast.success("Cliente atualizado com sucesso!");
        if (onSuccess && result.data) {
          onSuccess(result.data);
        }
        return result.data;
      } else {
        const errorMessage = result.error ? getClientErrorMessage(result.error) : 'Erro ao atualizar cliente';
        setError(errorMessage);
        toast.error(`Erro ao atualizar cliente: ${errorMessage}`);
        return null;
      }
    } catch (err: any) {
      const errorMessage = getClientErrorMessage(err);
      setError(errorMessage);
      toast.error(`Erro ao atualizar cliente: ${errorMessage}`);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (id: string): Promise<boolean> => {
    if (!businessId || !id) {
      setError("ID do negócio ou do cliente não disponível");
      toast.error("Erro ao excluir cliente: Dados incompletos");
      return false;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await deleteClient(id);
      
      if (result.success) {
        toast.success("Cliente excluído com sucesso!");
        return true;
      } else {
        const errorMessage = result.error ? getClientErrorMessage(result.error) : 'Erro ao excluir cliente';
        setError(errorMessage);
        toast.error(`Erro ao excluir cliente: ${errorMessage}`);
        return false;
      }
    } catch (err: any) {
      const errorMessage = getClientErrorMessage(err);
      setError(errorMessage);
      toast.error(`Erro ao excluir cliente: ${errorMessage}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const findClientInfo = async (type: 'email' | 'phone', value: string): Promise<Client | null> => {
    if (!businessId || !value) {
      return null;
    }
    
    try {
      if (type === 'email') {
        return await findClientByEmail(value, businessId);
      } else {
        return await findClientByPhone(value, businessId);
      }
    } catch (err) {
      console.error(`Error finding client by ${type}:`, err);
      return null;
    }
  };

  return {
    createClient: handleCreateClient,
    updateClient: handleUpdateClient,
    deleteClient: handleDeleteClient,
    findClientByEmail: (email: string) => findClientInfo('email', email),
    findClientByPhone: (phone: string) => findClientInfo('phone', phone),
    isSubmitting,
    error,
  };
}
