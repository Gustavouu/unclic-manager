import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppointmentStepperForm } from "./form/StepperForm";

type NewAppointmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const NewAppointmentDialog = ({
  open,
  onOpenChange
}: NewAppointmentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col p-6">
        <DialogHeader className="mb-4">
          <DialogTitle>Novo Agendamento</DialogTitle>
          <DialogDescription>
            Preencha os campos para criar um novo agendamento.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-grow pr-2">
          <AppointmentStepperForm onClose={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
