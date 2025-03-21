
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppointmentForm } from "./form/AppointmentForm";

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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar um novo agendamento.
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
