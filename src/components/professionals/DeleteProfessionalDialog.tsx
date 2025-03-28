
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Professional } from "@/hooks/professionals/types";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { Loader2 } from "lucide-react";

interface DeleteProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professional: Professional;
}

export const DeleteProfessionalDialog = ({
  open,
  onOpenChange,
  professional
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
        title: "Sucesso",
        description: "Colaborador removido com sucesso!"
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error removing professional:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o colaborador.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Remover Colaborador</DialogTitle>
        </DialogHeader>
        
        <DialogDescription className="py-4">
          Tem certeza que deseja remover <strong>{professional?.name}</strong> da lista de colaboradores? 
          Esta ação não pode ser desfeita.
        </DialogDescription>
        
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removendo...
              </>
            ) : (
              "Remover Colaborador"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
