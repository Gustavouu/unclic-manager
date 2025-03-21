
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfessionalForm } from "./form/ProfessionalForm";

interface NewProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewProfessionalDialog = ({ 
  open, 
  onOpenChange 
}: NewProfessionalDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Adicionar Novo Colaborador</DialogTitle>
        </DialogHeader>
        
        <ProfessionalForm onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
