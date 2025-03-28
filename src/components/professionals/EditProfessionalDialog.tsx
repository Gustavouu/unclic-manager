
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfessionalForm } from "./form/ProfessionalForm";
import { Professional } from "@/hooks/professionals/types";
import { useEffect, useState } from "react";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { useToast } from "@/components/ui/use-toast";

interface EditProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professional: Professional;
}

export const EditProfessionalDialog = ({ 
  open, 
  onOpenChange,
  professional
}: EditProfessionalDialogProps) => {
  const [currentProfessional, setCurrentProfessional] = useState<Professional | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateProfessional } = useProfessionals();
  const { toast } = useToast();
  
  // When the dialog opens or professional changes, update the local state
  useEffect(() => {
    if (professional && open) {
      // Create a deep copy to avoid reference issues
      setCurrentProfessional({...professional});
    }
  }, [professional, open]);

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  const handleSubmit = async (data: any) => {
    if (!currentProfessional?.id) return;
    
    try {
      setIsSubmitting(true);
      await updateProfessional(currentProfessional.id, data);
      toast({
        title: "Sucesso",
        description: "Colaborador atualizado com sucesso!"
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating professional:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o colaborador.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentProfessional) return null;
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={handleClose}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Colaborador</DialogTitle>
        </DialogHeader>
        
        <ProfessionalForm 
          onClose={handleClose}
          onSubmit={handleSubmit}
          professional={currentProfessional}
          editMode
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
