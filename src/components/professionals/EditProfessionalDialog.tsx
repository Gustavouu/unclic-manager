
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { ProfessionalForm } from "./form/ProfessionalForm";
import { Professional, ProfessionalFormData } from "@/hooks/professionals/types";
import { toast } from "sonner";

interface EditProfessionalDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  professional: Professional;
}

export const EditProfessionalDialog = ({ 
  open: controlledOpen, 
  onOpenChange: setControlledOpen,
  onSuccess,
  professional
}: EditProfessionalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateProfessional } = useProfessionals();
  
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? setControlledOpen : setOpen;
  
  const handleSubmit = async (data: ProfessionalFormData) => {
    setIsSubmitting(true);
    
    try {
      await updateProfessional(professional.id, data);
      setIsOpen(false);
      toast.success("Profissional atualizado com sucesso!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating professional:", error);
      toast.error("Erro ao atualizar profissional");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Profissional</DialogTitle>
        </DialogHeader>
        <ProfessionalForm 
          onClose={() => setIsOpen(false)} 
          onSubmit={handleSubmit}
          professional={professional}
          editMode={true}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
