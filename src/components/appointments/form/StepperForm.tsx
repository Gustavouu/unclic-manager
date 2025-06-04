
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentFormSchema } from "../schemas/appointmentFormSchema";
import { useServices } from "@/hooks/useServices"; 
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { Loader2, CheckCircle, User, Calendar, Clock, Scissors, CreditCard, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { CreateAppointmentData } from "@/hooks/appointments/types";
import { formatCurrency } from "@/lib/format";

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
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);

  const form = useForm({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clientId: preselectedClientId || "",
      date: new Date(),
      time: "09:00",
      serviceId: "",
      professionalId: "",
      status: "agendado",
      notes: "",
      paymentMethod: "local",
      notifications: {
        sendConfirmation: true,
        sendReminder: true
      }
    }
  });

  // Watch for changes in the selected service and professional
  const serviceId = form.watch("serviceId");
  const professionalId = form.watch("professionalId");
  
  useEffect(() => {
    if (serviceId && services) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
      }
    }
  }, [serviceId, services]);

  useEffect(() => {
    if (professionalId && professionals) {
      const professional = professionals.find(p => p.id === professionalId);
      if (professional) {
        setSelectedProfessional(professional);
      }
    }
  }, [professionalId, professionals]);

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
      
      const appointmentData: CreateAppointmentData = {
        clientId: preselectedClientId,
        serviceId: data.serviceId,
        professionalId: data.professionalId,
        date: appointmentDate,
        time: data.time,
        duration: service.duration,
        price: service.price,
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
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  const isUsingSampleData = services.some(s => s.id.startsWith('sample-'));

  return (
    <div className="space-y-6 max-h-[600px] overflow-y-auto">
      {isUsingSampleData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-800">
            Usando dados de exemplo. Configure serviços e profissionais reais.
          </span>
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Cliente */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {preselectedClientId ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">{preselectedClientName}</span>
                <Badge variant="secondary">Selecionado</Badge>
              </div>
            ) : (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Você precisa selecionar um cliente para continuar.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Serviço */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              Serviço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <select 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...form.register("serviceId")}
            >
              <option value="">Selecione um serviço</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.duration}min - {formatCurrency(service.price)}
                </option>
              ))}
            </select>
            
            {selectedService && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{selectedService.name}</h4>
                    {selectedService.description && (
                      <p className="text-sm text-gray-600">{selectedService.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{formatCurrency(selectedService.price)}</div>
                    <div className="text-sm text-gray-600">{selectedService.duration} minutos</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profissional */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Profissional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <select 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...form.register("professionalId")}
            >
              <option value="">Selecione um profissional</option>
              {professionals.map(professional => (
                <option key={professional.id} value={professional.id}>
                  {professional.name} - {professional.position}
                </option>
              ))}
            </select>
            
            {selectedProfessional && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedProfessional.name}</h4>
                    <p className="text-sm text-gray-600">{selectedProfessional.position}</p>
                    {selectedProfessional.specialties && selectedProfessional.specialties.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {selectedProfessional.specialties.slice(0, 2).map((specialty: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">{specialty}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data e Hora */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Data e Hora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Data</label>
                <input 
                  type="date"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...form.register("date", { 
                    valueAsDate: true
                  })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hora</label>
                <select 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          </CardContent>
        </Card>

        {/* Detalhes Adicionais */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Detalhes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...form.register("status")}
                >
                  <option value="agendado">Agendado</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Pagamento</label>
                <select 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...form.register("paymentMethod")}
                >
                  <option value="local">No local</option>
                  <option value="pix">PIX</option>
                  <option value="credit_card">Cartão de crédito</option>
                  <option value="debit_card">Cartão de débito</option>
                  <option value="dinheiro">Dinheiro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Observações</label>
              <textarea 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Observações sobre o agendamento..."
                {...form.register("notes")}
              ></textarea>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Criar Agendamento
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
