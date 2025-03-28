
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData } from "../WebsiteBookingFlow";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreditCard, Banknote, Smartphone } from "lucide-react";
import { formatPrice } from "@/components/website/WebsiteUtils";
import { usePayment } from "@/hooks/usePayment";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface StepPaymentProps {
  bookingData: BookingData;
  nextStep: () => void;
}

export function StepPayment({
  bookingData,
  nextStep
}: StepPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const { processPayment } = usePayment();

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
  };

  const createAppointment = async (paymentId: string) => {
    try {
      // Create appointment in the database
      const { data, error } = await supabase
        .from('agendamentos')
        .insert({
          id_servico: bookingData.serviceId,
          id_cliente: "1", // Assuming a default client ID for now
          valor: bookingData.servicePrice,
          status: 'confirmado',
          data: bookingData.date?.toISOString().split('T')[0],
          hora_inicio: bookingData.time,
          hora_fim: bookingData.time, // This should be calculated based on duration
          duracao: bookingData.serviceDuration,
          id_negocio: "1", // Example business ID
          id_funcionario: bookingData.professionalId,
          forma_pagamento: paymentMethod,
          observacoes: bookingData.notes
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the transaction with the new appointment ID
      await supabase
        .from('transacoes')
        .update({ id_agendamento: data.id })
        .eq('id', paymentId);
      
      return data.id;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Process payment using the usePayment hook
      const paymentResult = await processPayment({
        serviceId: bookingData.serviceId,
        amount: bookingData.servicePrice,
        customerId: "1", // Assuming a default customer ID for now
        paymentMethod: paymentMethod,
        description: `Pagamento para ${bookingData.serviceName} com ${bookingData.professionalName}`
      });
      
      if (paymentResult.status === 'approved' || paymentResult.status === 'pending') {
        // Create the appointment in the database
        await createAppointment(paymentResult.id);
        toast.success("Agendamento confirmado com sucesso!");
        nextStep();
      } else {
        toast.error("Erro no processamento do pagamento. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Ocorreu um erro ao processar o pagamento. Por favor, tente novamente mais tarde.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Pagamento</CardTitle>
        <p className="text-muted-foreground mt-2">
          Confirme os detalhes e escolha seu método de pagamento
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
          <h3 className="font-medium">Resumo do agendamento</h3>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Serviço:</div>
            <div className="font-medium">{bookingData.serviceName}</div>
            
            <div className="text-muted-foreground">Profissional:</div>
            <div className="font-medium">{bookingData.professionalName}</div>
            
            <div className="text-muted-foreground">Data:</div>
            <div className="font-medium">
              {bookingData.date 
                ? format(bookingData.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                : ""}
            </div>
            
            <div className="text-muted-foreground">Hora:</div>
            <div className="font-medium">{bookingData.time}</div>
            
            <div className="text-muted-foreground">Valor:</div>
            <div className="font-medium">{formatPrice(bookingData.servicePrice)}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Escolha a forma de pagamento</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              type="button"
              variant={paymentMethod === "credit_card" ? "default" : "outline"}
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => handlePaymentMethodSelect("credit_card")}
            >
              <CreditCard className="h-6 w-6" />
              <span>Cartão de Crédito</span>
            </Button>
            
            <Button
              type="button"
              variant={paymentMethod === "pix" ? "default" : "outline"}
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => handlePaymentMethodSelect("pix")}
            >
              <Smartphone className="h-6 w-6" />
              <span>PIX</span>
            </Button>
            
            <Button
              type="button"
              variant={paymentMethod === "cash" ? "default" : "outline"}
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => handlePaymentMethodSelect("cash")}
            >
              <Banknote className="h-6 w-6" />
              <span>Dinheiro no Local</span>
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handlePayment} 
          disabled={isProcessing}
        >
          {isProcessing ? "Processando..." : "Finalizar Agendamento"}
        </Button>
      </CardFooter>
    </Card>
  );
}
