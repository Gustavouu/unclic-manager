
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentFormSchema } from "../schemas/appointmentFormSchema";
import { useServices } from "@/hooks/useServices"; 
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { StandardizedAppointmentService } from "@/services/appointments/standardizedAppointmentService";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppointmentCreate } from "@/types/appointment";

interface AppointmentStepperFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  preselectedClientId?: string;
  preselectedClientName?: string;
}

export function AppointmentStepperForm({
  onClose,
  onSuccess,
  preselectedClientId,
  preselectedClientName
}: AppointmentStepperFormProps) {
  const { businessId } = useCurrentBusiness();
  const { services, isLoading: servicesLoading } = useServices();
  const { professionals, isLoading: professionalsLoading } = useProfessionals();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const appointmentService = StandardizedAppointmentService.getInstance();

  const form = useForm({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clientId: preselectedClientId || "",
      date: new Date(),
      time: "09:00",
      serviceId: "",
      professionalId: "",
      status: "scheduled",
      notes: "",
      paymentMethod: "cash",
    }
  });

  // Watch for changes in the selected service
  const serviceId = form.watch("serviceId");
  
  useEffect(() => {
    if (serviceId && services) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        // Calculate end time based on duration
        const startTime = form.getValues("time");
        if (startTime) {
          const [hours, minutes] = startTime.split(':').map(Number);
          const endDate = new Date();
          endDate.setHours(hours, minutes + service.duration, 0, 0);
          const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
          form.setValue("endTime", endTime);
        }
      }
    }
  }, [serviceId, services, form]);

  const handleSubmit = async (data: any) => {
    try {
      if (!businessId) {
        toast.error("Nenhum negócio selecionado");
        return;
      }

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
      
      // Calculate end time
      const [hours, minutes] = data.time.split(':').map(Number);
      const endDate = new Date();
      endDate.setHours(hours, minutes + service.duration, 0, 0);
      const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
      
      const appointmentData: AppointmentCreate = {
        business_id: businessId,
        client_id: preselectedClientId,
        service_id: data.serviceId,
        professional_id: data.professionalId,
        date: data.date.toISOString().split('T')[0],
        start_time: data.time,
        end_time: endTime,
        duration: service.duration,
        price: service.price,
        status: data.status,
        payment_method: data.paymentMethod,
        notes: data.notes
      };
      
      await appointmentService.create(appointmentData);
      
      toast.success("Agendamento criado com sucesso!");
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Erro ao criar agendamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (servicesLoading || professionalsLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Cliente */}
        <div>
          <h3 className="text-md font-medium mb-2">Cliente</h3>
          {preselectedClientId ? (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">{preselectedClientName}</p>
            </div>
          ) : (
            <div className="p-3 bg-destructive/10 rounded-md">
              <p className="text-sm text-destructive">
                Você precisa selecionar um cliente para continuar.
              </p>
            </div>
          )}
        </div>

        {/* Serviço */}
        <div>
          <label htmlFor="serviceId" className="text-sm font-medium mb-2 block">
            Serviço *
          </label>
          <select 
            id="serviceId"
            className="w-full p-3 border border-input rounded-md bg-background"
            {...form.register("serviceId", { required: "Selecione um serviço" })}
          >
            <option value="">Selecione um serviço</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.duration}min - R${service.price.toFixed(2)}
              </option>
            ))}
          </select>
          {form.formState.errors.serviceId && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.serviceId.message}
            </p>
          )}
        </div>

        {/* Profissional */}
        <div>
          <label htmlFor="professionalId" className="text-sm font-medium mb-2 block">
            Profissional *
          </label>
          <select 
            id="professionalId"
            className="w-full p-3 border border-input rounded-md bg-background"
            {...form.register("professionalId", { required: "Selecione um profissional" })}
          >
            <option value="">Selecione um profissional</option>
            {professionals.map(professional => (
              <option key={professional.id} value={professional.id}>
                {professional.name}
              </option>
            ))}
          </select>
          {form.formState.errors.professionalId && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.professionalId.message}
            </p>
          )}
        </div>

        {/* Data e Hora */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="text-sm font-medium mb-2 block">
              Data *
            </label>
            <input 
              id="date"
              type="date"
              className="w-full p-3 border border-input rounded-md bg-background"
              {...form.register("date", { 
                valueAsDate: true,
                required: "Selecione uma data"
              })}
              min={new Date().toISOString().split('T')[0]}
            />
            {form.formState.errors.date && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="time" className="text-sm font-medium mb-2 block">
              Hora *
            </label>
            <select 
              id="time"
              className="w-full p-3 border border-input rounded-md bg-background"
              {...form.register("time", { required: "Selecione um horário" })}
            >
              {Array.from({ length: 22 }, (_, i) => {
                const hour = Math.floor(i / 2) + 8;
                const minute = i % 2 === 0 ? '00' : '30';
                const time = `${hour.toString().padStart(2, '0')}:${minute}`;
                return (
                  <option key={time} value={time}>
                    {time}
                  </option>
                );
              })}
            </select>
            {form.formState.errors.time && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.time.message}
              </p>
            )}
          </div>
        </div>

        {/* Status e Pagamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="text-sm font-medium mb-2 block">
              Status
            </label>
            <select 
              id="status"
              className="w-full p-3 border border-input rounded-md bg-background"
              {...form.register("status")}
            >
              <option value="scheduled">Agendado</option>
              <option value="confirmed">Confirmado</option>
              <option value="completed">Concluído</option>
            </select>
          </div>
          <div>
            <label htmlFor="paymentMethod" className="text-sm font-medium mb-2 block">
              Forma de Pagamento
            </label>
            <select 
              id="paymentMethod"
              className="w-full p-3 border border-input rounded-md bg-background"
              {...form.register("paymentMethod")}
            >
              <option value="cash">Dinheiro</option>
              <option value="pix">PIX</option>
              <option value="credit_card">Cartão de Crédito</option>
              <option value="debit_card">Cartão de Débito</option>
            </select>
          </div>
        </div>

        {/* Observações */}
        <div>
          <label htmlFor="notes" className="text-sm font-medium mb-2 block">
            Observações
          </label>
          <textarea 
            id="notes"
            className="w-full p-3 border border-input rounded-md bg-background"
            rows={3}
            placeholder="Observações sobre o agendamento..."
            {...form.register("notes")}
          />
        </div>

        {/* Summary */}
        {selectedService && (
          <div className="p-4 bg-muted rounded-md">
            <h4 className="font-medium mb-2">Resumo do Agendamento</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Serviço:</span> {selectedService.name}</p>
              <p><span className="font-medium">Duração:</span> {selectedService.duration} minutos</p>
              <p><span className="font-medium">Valor:</span> R$ {selectedService.price.toFixed(2)}</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || !preselectedClientId}
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
