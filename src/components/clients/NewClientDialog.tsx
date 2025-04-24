
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useClients } from "@/hooks/useClients";

interface NewClientDialogProps {
  onClose: () => void;
  onClientCreated?: (client: any) => void;
}

export const NewClientDialog = ({ onClose, onClientCreated }: NewClientDialogProps) => {
  const { createClient } = useClients();
  
  const handleSubmit = async (data: any) => {
    try {
      const newClient = await createClient(data);
      if (newClient && onClientCreated) {
        onClientCreated(newClient);
      }
      onClose();
    } catch (error) {
      console.error("Error creating client:", error);
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center text-muted-foreground">
            Funcionalidade de criação de cliente simplificada.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
