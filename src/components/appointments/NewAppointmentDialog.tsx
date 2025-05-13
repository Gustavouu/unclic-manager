
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppointmentStepperForm } from "./form/StepperForm";
import { Appointment } from "@/hooks/appointments/types";
import { useBusinessConfig } from "@/hooks/business/useBusinessConfig";
import { Loader2 } from "lucide-react";

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
  const { loading } = useBusinessConfig();
  
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-2 text-sm text-muted-foreground">Carregando configurações...</p>
          </div>
        ) : (
          <div className="overflow-y-auto flex-grow pr-2">
            <AppointmentStepperForm 
              onClose={() => onOpenChange(false)}
              onAppointmentCreated={handleAppointmentCreated}
              createAppointment={createAppointment} 
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
