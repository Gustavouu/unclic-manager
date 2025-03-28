
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfessionalForm } from "./form/ProfessionalForm";
import { Professional } from "@/hooks/professionals/types";

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
  if (!professional) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Colaborador</DialogTitle>
        </DialogHeader>
        
        <ProfessionalForm 
          onClose={() => onOpenChange(false)} 
          professional={professional}
          editMode
        />
      </DialogContent>
    </Dialog>
  );
};
