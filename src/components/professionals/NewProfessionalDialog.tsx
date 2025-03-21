
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Colaborador</DialogTitle>
          <DialogDescription>
            Preencha os dados para cadastrar um novo colaborador no sistema.
          </DialogDescription>
        </DialogHeader>

        <ProfessionalForm onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
