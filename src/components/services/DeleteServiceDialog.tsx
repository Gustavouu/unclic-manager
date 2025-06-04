
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
import { useServiceOperations } from "@/hooks/services/useServiceOperations";
import type { Service } from "@/types/service";

interface DeleteServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | { id: string; nome?: string; name?: string } | null;
  onServiceDeleted?: () => void;
}

export const DeleteServiceDialog: React.FC<DeleteServiceDialogProps> = ({
  open,
  onOpenChange,
  service,
  onServiceDeleted
}) => {
  const { deleteService, isSubmitting } = useServiceOperations();

  const handleDelete = async () => {
    if (!service) return;
    
    const success = await deleteService(service.id);
    if (success) {
      onServiceDeleted?.();
      onOpenChange(false);
    }
  };

  const serviceName = service?.nome || service?.name || 'Serviço';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Serviço</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o serviço <strong>{serviceName}</strong>?
            Esta ação não pode ser desfeita.
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
