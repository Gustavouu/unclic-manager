
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BookingData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Calendar, Clock, User, Scissors, Pencil } from "lucide-react";

interface StepConfirmationProps {
  bookingData: BookingData;
  onComplete: () => void;
}

export function StepConfirmation({ bookingData, onComplete }: StepConfirmationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      if (!bookingData.date || !bookingData.time) {
        toast.error("Data ou horário não selecionados");
        return;
      }
      
      // Combine date and time
      const bookingDate = new Date(bookingData.date);
      const [hours, minutes] = bookingData.time.split(':').map(Number);
      bookingDate.setHours(hours, minutes, 0, 0);
      
      // Calculate end time
      const endDate = new Date(bookingDate.getTime() + bookingData.serviceDuration * 60000);
      
      // Format dates for database
      const dateStr = format(bookingDate, 'yyyy-MM-dd');
      const startTimeStr = format(bookingDate, 'HH:mm:ss');
      const endTimeStr = format(endDate, 'HH:mm:ss');
      
      // Get business ID
      const { data: business } = await supabase
        .from('negocios')
        .select('id')
        .limit(1)
        .single();
        
      const businessId = business?.id;
      
      if (!businessId) {
        toast.error("Erro ao identificar o estabelecimento");
        return;
      }
      
      // Check if the slot is still available
      const { data: existingAppointments } = await supabase
        .from('agendamentos')
        .select('id')
        .eq('data', dateStr)
        .eq('id_funcionario', bookingData.professionalId)
        .or(`hora_inicio.lte.${endTimeStr},hora_fim.gte.${startTimeStr}`);
      
      if (existingAppointments && existingAppointments.length > 0) {
        toast.error("Este horário não está mais disponível. Por favor, escolha outro.");
        return;
      }
      
      // Create the appointment
      const { data, error } = await supabase
        .from('agendamentos')
        .insert({
          data: dateStr,
          hora_inicio: startTimeStr,
          hora_fim: endTimeStr,
          duracao: bookingData.serviceDuration,
          valor: bookingData.servicePrice,
          status: 'agendado',
          forma_pagamento: 'local', // Default payment method
          observacoes: bookingData.notes,
          id_servico: bookingData.serviceId,
          id_cliente: bookingData.clientId,
          id_funcionario: bookingData.professionalId,
          id_negocio: businessId
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating appointment:', error);
        toast.error("Erro ao criar agendamento");
        return;
      }
      
      toast.success("Agendamento criado com sucesso!");
      
      // Complete the booking process
      onComplete();
    } catch (error) {
      console.error('Error submitting appointment:', error);
      toast.error("Erro ao processar agendamento");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!bookingData.date || !bookingData.clientName) {
    return (
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Informações incompletas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Algumas informações necessárias estão faltando. Por favor, volte e preencha todas as informações.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={onComplete}>
            Voltar para o início
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Confirmar agendamento</CardTitle>
        <p className="text-muted-foreground mt-2">
          Verifique os detalhes do seu agendamento antes de confirmar
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 bg-gray-50 p-4 rounded-md">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Data</h3>
              <p>{format(bookingData.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Horário</h3>
              <p>{bookingData.time}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Scissors className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Serviço</h3>
              <p>{bookingData.serviceName}</p>
              <p className="text-sm text-muted-foreground">
                Duração: {bookingData.serviceDuration} minutos • 
                Valor: R$ {bookingData.servicePrice.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Profissional</h3>
              <p>{bookingData.professionalName}</p>
            </div>
          </div>
          
          {bookingData.notes && (
            <div className="flex items-start gap-3">
              <Pencil className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Observações</h3>
                <p className="text-sm text-muted-foreground">{bookingData.notes}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Dados do cliente</h3>
          <p><strong>Nome:</strong> {bookingData.clientName}</p>
          <p><strong>Email:</strong> {bookingData.clientEmail}</p>
          {bookingData.clientPhone && <p><strong>Telefone:</strong> {bookingData.clientPhone}</p>}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubmit}
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
