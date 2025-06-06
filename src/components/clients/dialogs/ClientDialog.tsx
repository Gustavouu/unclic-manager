
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClientForm } from '@/components/clients/forms/ClientForm';
import { useClients } from '@/hooks/clients/useClients';
import { toast } from 'sonner';
import type { Client, ClientFormData } from '@/types/client';

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
  mode: 'create' | 'edit';
}

export const ClientDialog: React.FC<ClientDialogProps> = ({
  open,
  onOpenChange,
  client,
  mode,
}) => {
  const { createClient, updateClient } = useClients();

  const handleSubmit = async (data: ClientFormData) => {
    try {
      if (mode === 'create') {
        await createClient(data);
        toast.success('Cliente criado com sucesso!');
      } else if (client) {
        await updateClient(client.id, data);
        toast.success('Cliente atualizado com sucesso!');
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error(mode === 'create' ? 'Erro ao criar cliente' : 'Erro ao atualizar cliente');
      throw error;
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Novo Cliente' : 'Editar Cliente'}
          </DialogTitle>
        </DialogHeader>
        <ClientForm
          client={client}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
