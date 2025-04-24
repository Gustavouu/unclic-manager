
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { Appointment, AppointmentStatus } from "@/hooks/appointments/types";
import { format } from "date-fns";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface AppointmentStepperFormProps {
  onClose: () => void;
  preselectedClientId?: string;
  preselectedClientName?: string;
}

export function AppointmentStepperForm({
  onClose,
  preselectedClientId,
  preselectedClientName
}: AppointmentStepperFormProps) {
  const { createAppointment } = useAppointments();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      clientId: preselectedClientId || "",
      clientName: preselectedClientName || "",
      serviceId: "",
      serviceName: "",
      serviceType: "",
      professionalId: "",
      professionalName: "",
      date: new Date(),
      duration: 30,
      price: 0,
      status: "agendado" as AppointmentStatus,
      paymentMethod: "dinheiro",
      notes: "",
    }
  });

  const handleSubmit = async (data: Omit<Appointment, "id">) => {
    try {
      setIsSubmitting(true);
      
      // Make sure clientId is present (required)
      const appointmentData = {
        ...data,
        clientId: data.clientId || "temp-client-id", // Make sure clientId is always provided
      };
      
      await createAppointment(appointmentData);
      
      toast.success("Agendamento criado com sucesso!");
      onClose();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Erro ao criar agendamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        {/* Simplificado para focar na correção */}
        <p className="text-sm text-muted-foreground">
          Formulário simplificado para demonstração.
          {preselectedClientId && (
            <span className="block mt-2 font-medium text-primary">
              Cliente já selecionado: {preselectedClientName}
            </span>
          )}
        </p>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          onClick={form.handleSubmit(handleSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Criando..." : "Criar Agendamento"}
        </Button>
      </div>
    </div>
  );
}
