
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfessionalForm } from "./form/ProfessionalForm";
import { Professional } from "@/hooks/professionals/types";
import { useEffect, useState } from "react";

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
  
  // When the dialog opens or professional changes, update the local state
  useEffect(() => {
    if (professional && open) {
      // Create a deep copy to avoid reference issues
      setCurrentProfessional({...professional});
    }
  }, [professional, open]);

  if (!currentProfessional) return null;
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Colaborador</DialogTitle>
        </DialogHeader>
        
        <ProfessionalForm 
          onClose={() => onOpenChange(false)} 
          professional={currentProfessional}
          editMode
        />
      </DialogContent>
    </Dialog>
  );
};
