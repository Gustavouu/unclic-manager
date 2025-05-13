
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfessionalForm } from "./form/ProfessionalForm";
import { useState } from "react";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { ProfessionalCreateForm } from "@/hooks/professionals/types";
import { toast } from "sonner";

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

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  const handleSubmit = async (data: ProfessionalCreateForm) => {
    try {
      setIsSubmitting(true);
      await addProfessional(data);
      toast.success("Colaborador adicionado com sucesso!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding professional:", error);
      toast.error("Não foi possível adicionar o colaborador.");
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
