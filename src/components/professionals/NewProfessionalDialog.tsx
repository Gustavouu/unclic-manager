
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfessionalForm } from "./form/ProfessionalForm";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { ProfessionalCreateForm } from "@/hooks/professionals/types";

interface NewProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewProfessionalDialog = ({ 
  open, 
  onOpenChange 
}: NewProfessionalDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addProfessional } = useProfessionals();
  const { toast } = useToast();

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  const handleSubmit = async (data: ProfessionalCreateForm) => {
    try {
      setIsSubmitting(true);
      await addProfessional(data);
      toast({
        title: "Sucesso",
        description: "Colaborador adicionado com sucesso!"
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding professional:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o colaborador.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={handleClose}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Adicionar Novo Colaborador</DialogTitle>
        </DialogHeader>
        
        <ProfessionalForm 
          onClose={handleClose}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
