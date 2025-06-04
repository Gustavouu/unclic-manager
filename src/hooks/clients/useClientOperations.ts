
import { useState } from 'react';
import { useClientsData } from './useClientsData';
import { toast } from 'sonner';
import type { ClientFormData } from '@/types/client';

export const useClientOperations = () => {
  const { createClient, updateClient, deleteClient, refetch } = useClientsData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateClient = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      await createClient(data);
      toast.success('Cliente criado com sucesso!');
      return true;
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Erro ao criar cliente');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateClient = async (id: string, data: Partial<ClientFormData>) => {
    setIsSubmitting(true);
    try {
      await updateClient(id, data);
      toast.success('Cliente atualizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Erro ao atualizar cliente');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteClient(id);
      toast.success('Cliente excluído com sucesso!');
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Erro ao excluir cliente');
      return false;
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    setIsSubmitting(true);
    try {
      await Promise.all(ids.map(id => deleteClient(id)));
      toast.success(`${ids.length} clientes excluídos com sucesso!`);
      return true;
    } catch (error) {
      console.error('Error bulk deleting clients:', error);
      toast.error('Erro ao excluir clientes');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleCreateClient,
    handleUpdateClient,
    handleDeleteClient,
    handleBulkDelete,
    refetch,
  };
};
