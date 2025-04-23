import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AppointmentStepperForm } from "../form/StepperForm";

interface CreateAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateAppointmentDialog({
  open,
  onClose,
}: CreateAppointmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col p-6">
        <DialogHeader className="mb-4">
          <DialogTitle>Novo Agendamento</DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo agendamento
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-grow pr-2">
          <AppointmentStepperForm onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
} 