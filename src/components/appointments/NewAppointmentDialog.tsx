
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppointmentStepperForm } from "./form/StepperForm";
import { Appointment } from "@/hooks/appointments/types";

type NewAppointmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAppointmentCreated?: () => void;
  createAppointment?: (data: Omit<Appointment, "id">) => Promise<string>;
};

export const NewAppointmentDialog = ({
  open,
  onOpenChange,
  onAppointmentCreated,
  createAppointment
}: NewAppointmentDialogProps) => {
  const handleAppointmentCreated = () => {
    if (onAppointmentCreated) {
      onAppointmentCreated();
    }
    onOpenChange(false);
  };

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
          <AppointmentStepperForm 
            onClose={() => onOpenChange(false)}
            onAppointmentCreated={handleAppointmentCreated}
            createAppointment={createAppointment} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
