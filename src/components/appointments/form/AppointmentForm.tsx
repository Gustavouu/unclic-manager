
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { appointmentFormSchema, AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClientSelect } from "./ClientSelect";
import { ServiceSelect } from "./ServiceSelect";
import { ProfessionalSelect } from "./ProfessionalSelect";
import { DateTimeSelect } from "./DateTimeSelect";
import { NotesField } from "./NotesField";
import { StatusSelect } from "./StatusSelect";
import { NotificationsOptions } from "./NotificationsOptions";
import { clients } from "../data/appointmentMockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { useAppointmentConflicts } from "@/hooks/appointments/useAppointmentConflicts";
import { v4 as uuidv4 } from "uuid";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Appointment, AppointmentStatus } from "@/hooks/appointments/types"; // Using the hooks appointments type

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

  const { appointments, createAppointment, fetchAppointments } = useAppointments();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Convert the appointments to the correct type for conflict validation
  const appointmentsForConflict = appointments;
  
  // Use the hook for checking conflicts
  const { validateAppointmentTime } = useAppointmentConflicts(appointmentsForConflict);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      notes: "",
      status: "agendado" as AppointmentStatus,
      notifications: {
        sendConfirmation: true,
        sendReminder: true,
      },
    },
  });
  
  // Clear validation error when the fields of date, time, or professional change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'date' || name === 'time' || name === 'professionalId') {
        setValidationError(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (values: AppointmentFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Build the appointment date from form values
      const appointmentDate = new Date(values.date);
      const [hours, minutes] = values.time.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      const client = clients.find(c => c.id === values.clientId);
      
      // Generate valid UUIDs if they're missing
      const serviceId = values.serviceId || uuidv4();
      const clientId = values.clientId || uuidv4();
      const professionalId = values.professionalId || uuidv4();
      
      // Verify appointment conflicts
      const validationResult = validateAppointmentTime({
        date: appointmentDate,
        duration: selectedService?.duration || 60,
        professionalId: professionalId
      });
      
      if (!validationResult.valid) {
        setValidationError(validationResult.reason || "Horário inválido para agendamento.");
        setIsSubmitting(false);
        return;
      }
      
      console.log("Creating appointment with form values:", {
        ...values,
        appointmentDate,
        serviceId,
        clientId,
        professionalId
      });
      
      // Create the appointment through the hook
      await createAppointment({
        clientName: client?.name || "Cliente não identificado",
        serviceName: selectedService?.name || "Serviço não identificado",
        date: appointmentDate,
        status: values.status,
        price: selectedService?.price || 0,
        serviceType: "haircut", // This could be improved with actual categories
        duration: selectedService?.duration || 60,
        notes: values.notes,
        clientId: clientId,
        serviceId: serviceId,
        professionalId: professionalId,
        paymentMethod: values.paymentMethod || "local",
        notifications: {
          sendConfirmation: values.notifications?.sendConfirmation ?? true,
          sendReminder: values.notifications?.sendReminder ?? true
        }
      });
      
      // Refresh appointments to show the new one
      fetchAppointments();
      
      // Close the dialog and reset form
      onClose();
      form.reset();
      
      toast.success("Agendamento criado com sucesso!", {
        description: `Cliente: ${client?.name}, 
                     Data: ${format(appointmentDate, "d 'de' MMMM", { locale: ptBR })} às ${values.time}`,
      });
      
      // If notification settings are set to send confirmation, show an info toast
      if (values.notifications?.sendConfirmation) {
        toast.info("Enviando confirmação para o cliente...");
      }
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
        <StatusSelect form={form} />
        <NotesField form={form} />
        <NotificationsOptions form={form} />
        
        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro de validação</AlertTitle>
            <AlertDescription>
              {validationError}
            </AlertDescription>
          </Alert>
        )}

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
