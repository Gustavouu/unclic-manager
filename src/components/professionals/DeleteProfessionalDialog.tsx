
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useProfessionalsOperations } from '@/hooks/professionals/useProfessionalsOperations';
import { Professional } from '@/hooks/professionals/types';

interface DeleteProfessionalDialogProps {
  professional: Professional;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteProfessionalDialog: React.FC<DeleteProfessionalDialogProps> = ({
  professional,
  open,
  onOpenChange
}) => {
  const { deleteProfessional, isSubmitting } = useProfessionalsOperations();

  const handleDelete = async () => {
    const success = await deleteProfessional(professional.id);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Profissional</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir <strong>{professional.name}</strong>?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
