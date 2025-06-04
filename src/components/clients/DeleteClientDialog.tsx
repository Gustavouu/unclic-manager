
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useClientOperations } from "@/hooks/clients/useClientOperations";
import { Button } from "@/components/ui/button";

interface DeleteClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string | null;
  clientName: string;
  onClientDeleted?: () => void;
}

export const DeleteClientDialog: React.FC<DeleteClientDialogProps> = ({
  open,
  onOpenChange,
  clientId,
  clientName,
  onClientDeleted
}) => {
  const { handleDeleteClient, isSubmitting } = useClientOperations();

  const handleDelete = async () => {
    if (!clientId) return;
    
    const success = await handleDeleteClient(clientId);
    if (success) {
      onClientDeleted?.();
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Cliente</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o cliente <strong>{clientName}</strong>?
            Esta ação não pode ser desfeita e removerá permanentemente todos os dados do cliente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
