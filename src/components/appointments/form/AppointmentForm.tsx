
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { appointmentFormSchema, AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClientSelect } from "./ClientSelect";
import { ServiceSelect } from "./ServiceSelect";
import { ProfessionalSelect } from "./ProfessionalSelect";
import { DateTimeSelect } from "./DateTimeSelect";
import { NotesField } from "./NotesField";
import { clients } from "../data/appointmentMockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { v4 as uuidv4 } from "uuid";

type AppointmentFormProps = {
  onClose: () => void;
};

export const AppointmentForm = ({ onClose }: AppointmentFormProps) => {
  const [selectedService, setSelectedService] = useState<{
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null>(null);

  const { createAppointment } = useAppointments();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      notes: "",
    },
  });

  const onSubmit = async (values: AppointmentFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Build the appointment date from form values
      const appointmentDate = new Date(values.date);
      const [hours, minutes] = values.time.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      const client = clients.find(c => c.id === values.clientId);
      
      // Create the appointment through the hook
      // Make sure all IDs are valid UUIDs or null if not available
      const defaultBusinessId = "00000000-0000-4000-a000-000000000001"; // Use a valid UUID format
      
      await createAppointment({
        clientName: client?.name || "Cliente não identificado",
        serviceName: selectedService?.name || "Serviço não identificado",
        date: appointmentDate,
        status: "agendado",
        price: selectedService?.price || 0,
        serviceType: "haircut", // This could be improved with actual categories
        duration: selectedService?.duration || 60,
        notes: values.notes,
        serviceId: values.serviceId,
        clientId: values.clientId,
        professionalId: values.professionalId,
        paymentMethod: "local" // Default payment method
      });
      
      // Close the dialog and reset form
      onClose();
      form.reset();
      
      toast.success("Agendamento criado com sucesso!", {
        description: `Cliente: ${client?.name}, 
                     Data: ${format(appointmentDate, "d 'de' MMMM", { locale: ptBR })} às ${values.time}`,
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Erro ao criar agendamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ClientSelect form={form} />
        <ServiceSelect 
          form={form} 
          selectedService={selectedService} 
          setSelectedService={setSelectedService} 
        />
        <ProfessionalSelect form={form} />
        <DateTimeSelect form={form} />
        <NotesField form={form} />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Agendando..." : "Agendar"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
