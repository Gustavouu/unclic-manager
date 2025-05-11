
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { Appointment, AppointmentStatus } from "@/hooks/appointments/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentFormSchema } from "../schemas/appointmentFormSchema";
import { useServices } from "@/hooks/useServices"; 
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const { services, isLoading: servicesLoading } = useServices();
  const { professionals } = useProfessionals();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const form = useForm({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clientId: preselectedClientId || "",
      date: new Date(),
      time: "09:00",
      serviceId: "",
      professionalId: "",
      status: "agendado" as AppointmentStatus,
      notes: "",
      paymentMethod: "local",
      notifications: {
        sendConfirmation: true,
        sendReminder: true
      }
    }
  });

  // Watch for changes in the selected service
  const serviceId = form.watch("serviceId");
  
  useEffect(() => {
    if (serviceId && services) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
      }
    }
  }, [serviceId, services]);

  const handleSubmit = async (data: any) => {
    try {
      if (!preselectedClientId) {
        toast.error("Selecione um cliente");
        return;
      }

      if (!data.serviceId) {
        toast.error("Selecione um serviço");
        return;
      }

      if (!data.professionalId) {
        toast.error("Selecione um profissional");
        return;
      }
      
      setIsSubmitting(true);
      
      // Find the selected service and professional
      const service = services.find(s => s.id === data.serviceId);
      const professional = professionals.find(p => p.id === data.professionalId);
      
      if (!service || !professional) {
        toast.error("Serviço ou profissional não encontrado");
        return;
      }
      
      // Combine date and time
      const appointmentDate = new Date(data.date);
      const [hours, minutes] = data.time.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      const appointmentData: Omit<Appointment, "id"> = {
        clientId: preselectedClientId,
        clientName: preselectedClientName || "Cliente",
        serviceId: data.serviceId,
        serviceName: service.nome,
        serviceType: "service",
        professionalId: data.professionalId,
        professionalName: professional.name,
        date: appointmentDate,
        duration: service.duracao,
        price: service.preco,
        status: data.status,
        paymentMethod: data.paymentMethod,
        notes: data.notes
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

  if (servicesLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Cliente */}
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">Cliente</h3>
          {preselectedClientId ? (
            <p className="text-sm bg-muted p-2 rounded">
              {preselectedClientName}
            </p>
          ) : (
            <p className="text-sm text-red-500">
              Você precisa selecionar um cliente para continuar.
            </p>
          )}
        </div>

        {/* Serviço */}
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">Serviço</h3>
          <select 
            className="w-full p-2 border rounded"
            {...form.register("serviceId")}
          >
            <option value="">Selecione um serviço</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.nome} - {service.duracao}min - R${service.preco.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {/* Profissional */}
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">Profissional</h3>
          <select 
            className="w-full p-2 border rounded"
            {...form.register("professionalId")}
          >
            <option value="">Selecione um profissional</option>
            {professionals.map(professional => (
              <option key={professional.id} value={professional.id}>
                {professional.name}
              </option>
            ))}
          </select>
        </div>

        {/* Data e Hora */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div>
            <h3 className="text-md font-medium mb-2">Data</h3>
            <input 
              type="date"
              className="w-full p-2 border rounded"
              {...form.register("date", { 
                valueAsDate: true
              })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <h3 className="text-md font-medium mb-2">Hora</h3>
            <select 
              className="w-full p-2 border rounded"
              {...form.register("time")}
            >
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
            </select>
          </div>
        </div>

        {/* Status e Pagamento */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div>
            <h3 className="text-md font-medium mb-2">Status</h3>
            <select 
              className="w-full p-2 border rounded"
              {...form.register("status")}
            >
              <option value="agendado">Agendado</option>
              <option value="confirmado">Confirmado</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
          <div>
            <h3 className="text-md font-medium mb-2">Pagamento</h3>
            <select 
              className="w-full p-2 border rounded"
              {...form.register("paymentMethod")}
            >
              <option value="local">No local</option>
              <option value="pix">PIX</option>
              <option value="credit_card">Cartão de crédito</option>
              <option value="debit_card">Cartão de débito</option>
            </select>
          </div>
        </div>

        {/* Observações */}
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Observações</h3>
          <textarea 
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Observações sobre o agendamento..."
            {...form.register("notes")}
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : "Criar Agendamento"}
          </Button>
        </div>
      </form>
    </div>
  );
}
