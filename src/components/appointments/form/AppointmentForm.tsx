
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

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      notes: "",
    },
  });

  const onSubmit = (values: AppointmentFormValues) => {
    // Here you would handle the form submission to create a new appointment
    console.log(values);
    
    // Close the dialog and display a success message
    onClose();
    
    toast.success("Agendamento criado com sucesso!", {
      description: `Cliente: ${clients.find(c => c.id === values.clientId)?.name}, 
                   Data: ${format(values.date, "d 'de' MMMM", { locale: ptBR })} às ${values.time}`,
    });
    
    // Reset the form
    form.reset();
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
          <Button type="submit">Agendar</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
