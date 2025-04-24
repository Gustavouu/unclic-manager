
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData } from "../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, CalendarCheck } from "lucide-react";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { toast } from "sonner";
import { AppointmentStatus } from "@/hooks/appointments/types";

interface StepConfirmationProps {
  bookingData: BookingData;
  onComplete: () => void;
}

export function StepConfirmation({ bookingData, onComplete }: StepConfirmationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createAppointment, fetchAppointments } = useAppointments();
  
  const handleCompleteBooking = async () => {
    if (!bookingData.date) {
      toast.error("Data de agendamento inválida");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Combine date and time
      const appointmentDate = new Date(bookingData.date);
      const [hours, minutes] = bookingData.time.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      console.log("Creating website appointment with data:", {
        clientName: bookingData.clientName,
        serviceName: bookingData.serviceName,
        date: appointmentDate,
        serviceId: bookingData.serviceId,
        professionalId: bookingData.professionalId,
        time: bookingData.time
      });
      
      // Create appointment
      await createAppointment({
        clientName: bookingData.clientName || "Cliente não identificado",
        serviceName: bookingData.serviceName,
        date: appointmentDate,
        status: "agendado" as AppointmentStatus,
        price: bookingData.servicePrice,
        serviceType: "servico", 
        duration: bookingData.serviceDuration,
        notes: bookingData.notes,
        serviceId: bookingData.serviceId,
        clientId: bookingData.clientId || "guest-client", // Ensure clientId is provided
        professionalId: bookingData.professionalId,
        paymentMethod: "local", // Default payment method
        notifications: {
          sendConfirmation: true,
          sendReminder: true
        }
      });
      
      // Refresh the appointments list to show the new appointment
      fetchAppointments();
      
      toast.success("Agendamento confirmado com sucesso!");
      onComplete();
      
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Ocorreu um erro ao confirmar o agendamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format date for display
  const formattedDate = bookingData.date 
    ? format(bookingData.date, "EEEE, dd 'de' MMMM", { locale: ptBR })
    : "";
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <CalendarCheck className="h-12 w-12 text-green-500 mb-2" />
      
      <h2 className="text-xl font-semibold text-center">Confirme seu agendamento</h2>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Detalhes do Agendamento</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-gray-500">Serviço:</div>
            <div className="text-sm font-medium">{bookingData.serviceName}</div>
            
            <div className="text-sm text-gray-500">Profissional:</div>
            <div className="text-sm font-medium">{bookingData.professionalName}</div>
            
            <div className="text-sm text-gray-500">Data:</div>
            <div className="text-sm font-medium">{formattedDate}</div>
            
            <div className="text-sm text-gray-500">Horário:</div>
            <div className="text-sm font-medium">{bookingData.time}</div>
            
            <div className="text-sm text-gray-500">Duração:</div>
            <div className="text-sm font-medium">{bookingData.serviceDuration} min</div>
            
            <div className="text-sm text-gray-500">Preço:</div>
            <div className="text-sm font-medium">R$ {bookingData.servicePrice.toFixed(2)}</div>
            
            {bookingData.notes && (
              <>
                <div className="text-sm text-gray-500">Observações:</div>
                <div className="text-sm font-medium">{bookingData.notes}</div>
              </>
            )}
            
            <div className="text-sm text-gray-500">Cliente:</div>
            <div className="text-sm font-medium">{bookingData.clientName}</div>
            
            {bookingData.clientEmail && (
              <>
                <div className="text-sm text-gray-500">Email:</div>
                <div className="text-sm font-medium">{bookingData.clientEmail}</div>
              </>
            )}
            
            {bookingData.clientPhone && (
              <>
                <div className="text-sm text-gray-500">Telefone:</div>
                <div className="text-sm font-medium">{bookingData.clientPhone}</div>
              </>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={handleCompleteBooking}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Confirmar Agendamento"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
