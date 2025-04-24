
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
  preselectedClientId?: string;
  preselectedClientName?: string;
}

export function CreateAppointmentDialog({
  open,
  onClose,
  preselectedClientId,
  preselectedClientName,
}: CreateAppointmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col p-6">
        <DialogHeader className="mb-4">
          <DialogTitle>Novo Agendamento</DialogTitle>
          <DialogDescription>
            {preselectedClientName 
              ? `Criando agendamento para ${preselectedClientName}`
              : "Preencha as informações para criar um novo agendamento"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-grow pr-2">
          <AppointmentStepperForm 
            onClose={onClose} 
            preselectedClientId={preselectedClientId}
            preselectedClientName={preselectedClientName}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 
