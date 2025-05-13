
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { Professional } from "@/hooks/professionals/types";
import { toast } from 'sonner';

interface DeleteProfessionalDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  professional: Professional;
}

export const DeleteProfessionalDialog = ({ 
  open: controlledOpen, 
  onOpenChange: setControlledOpen,
  onSuccess,
  professional
}: DeleteProfessionalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteProfessional } = useProfessionals();
  
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? setControlledOpen : setOpen;
  
  const handleDelete = async () => {
    if (!professional?.id) return;
    
    setIsDeleting(true);
    try {
      await deleteProfessional(professional.id);
      setIsOpen(false);
      toast.success("Profissional excluído com sucesso!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error deleting professional:", error);
      toast.error("Erro ao excluir profissional");
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (!professional) return null;
  
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isto irá remover o profissional <strong>{professional.name}</strong> permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
