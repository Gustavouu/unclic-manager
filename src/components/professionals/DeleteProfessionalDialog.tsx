
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
import { Professional } from "@/hooks/professionals/types";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DeleteProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professional: Professional;
}

export const DeleteProfessionalDialog = ({
  open,
  onOpenChange,
  professional,
}: DeleteProfessionalDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { removeProfessional } = useProfessionals();
  const { toast } = useToast();

  const handleClose = () => {
    if (!isDeleting) {
      onOpenChange(false);
    }
  };

  const handleDelete = async () => {
    if (!professional?.id) return;
    
    try {
      setIsDeleting(true);
      await removeProfessional(professional.id);
      toast({
        title: "Colaborador removido",
        description: `${professional.name} foi removido com sucesso.`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao excluir colaborador:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover o colaborador.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!professional) return null;

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={handleClose}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o colaborador <strong>{professional.name}</strong>?
            <br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }} 
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Sim, excluir"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
