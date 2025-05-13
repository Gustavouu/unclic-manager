
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { ProfessionalForm } from "./form/ProfessionalForm";
import { ProfessionalFormData } from "@/hooks/professionals/types";
import { toast } from "sonner";

interface NewProfessionalDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export const NewProfessionalDialog = ({ 
  open: controlledOpen, 
  onOpenChange: setControlledOpen,
  onSuccess,
  trigger 
}: NewProfessionalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createProfessional } = useProfessionals();
  
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? setControlledOpen : setOpen;
  
  const handleSubmit = async (data: ProfessionalFormData) => {
    setIsSubmitting(true);
    
    try {
      await createProfessional(data);
      setIsOpen(false);
      toast.success("Profissional adicionado com sucesso!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating professional:", error);
      toast.error("Erro ao adicionar profissional");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Profissional</DialogTitle>
        </DialogHeader>
        <ProfessionalForm 
          onClose={() => setIsOpen(false)} 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
