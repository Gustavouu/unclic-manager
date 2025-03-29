
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData } from "../types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, CalendarCheck } from "lucide-react";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { toast } from "sonner";

interface StepConfirmationProps {
  bookingData: BookingData;
  onComplete: () => void;
}

export function StepConfirmation({ bookingData, onComplete }: StepConfirmationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createAppointment } = useAppointments();
  
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
      
      // Create appointment
      await createAppointment({
        clientName: bookingData.clientName || "Cliente não identificado",
        serviceName: bookingData.serviceName,
        date: appointmentDate,
        status: "agendado",
        price: bookingData.servicePrice,
        serviceType: "servico", 
        duration: bookingData.serviceDuration,
        notes: bookingData.notes,
        serviceId: bookingData.serviceId,
        clientId: bookingData.clientId,
        professionalId: bookingData.professionalId,
        paymentMethod: "local" // Default payment method
      });
      
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
    ? format(bookingData.date, "EEEE, d 'de' MMMM", { locale: ptBR })
    : "";
  
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <div className="flex flex-col items-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <CalendarCheck className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Confirme seu agendamento</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid gap-2 border-b pb-4">
          <div className="text-lg font-medium">{bookingData.serviceName}</div>
          <div className="text-sm text-muted-foreground">
            {formattedDate}, às {bookingData.time}
          </div>
          <div className="text-sm text-muted-foreground">
            com {bookingData.professionalName}
          </div>
          <div className="text-sm font-medium mt-2">
            Valor: R$ {bookingData.servicePrice.toFixed(2).replace('.', ',')}
          </div>
        </div>
        
        <div className="grid gap-2">
          <div className="text-md font-medium">Seus dados</div>
          <div className="text-sm">
            {bookingData.clientName}
          </div>
          <div className="text-sm text-muted-foreground">
            {bookingData.clientEmail}
            {bookingData.clientPhone && ` • ${bookingData.clientPhone}`}
          </div>
        </div>
        
        {bookingData.notes && (
          <div className="grid gap-2">
            <div className="text-md font-medium">Observações</div>
            <div className="text-sm text-muted-foreground">
              {bookingData.notes}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleCompleteBooking} 
          className="w-full"
          disabled={isSubmitting}
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
  );
}
