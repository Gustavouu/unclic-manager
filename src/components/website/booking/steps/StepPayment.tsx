
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreditCard, Banknote, Smartphone, AlertTriangle, RefreshCw } from "lucide-react";
import { formatPrice } from "@/components/website/WebsiteUtils";
import { usePayment } from "@/hooks/usePayment";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BookingData } from "../types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { processPayment } = usePayment();

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
    // Reset any previous error when changing payment method
    setPaymentError(null);
  };

  const createAppointment = async (paymentId: string) => {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .insert({
          id_servico: bookingData.serviceId,
          id_cliente: "1",
          valor: bookingData.servicePrice,
          status: 'confirmado',
          data: bookingData.date?.toISOString().split('T')[0],
          hora_inicio: bookingData.time,
          hora_fim: bookingData.time,
          duracao: bookingData.serviceDuration,
          id_negocio: "1",
          id_funcionario: bookingData.professionalId,
          forma_pagamento: paymentMethod,
          observacoes: bookingData.notes
        })
        .select()
        .single();
      
      if (error) throw error;
      
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
    setPaymentError(null);
    
    try {
      const paymentResult = await processPayment({
        serviceId: bookingData.serviceId,
        amount: bookingData.servicePrice,
        customerId: "1",
        paymentMethod: paymentMethod,
        description: `Pagamento para ${bookingData.serviceName} com ${bookingData.professionalName}`,
        businessId: "1"
      });
      
      if (paymentResult.status === 'approved' || paymentResult.status === 'pending') {
        await createAppointment(paymentResult.id);
        toast.success("Agendamento confirmado com sucesso!");
        nextStep();
      } else {
        setPaymentError("Erro no processamento do pagamento. Por favor, tente novamente.");
        toast.error("Erro no processamento do pagamento. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError("Ocorreu um erro ao processar o pagamento. Por favor, tente novamente mais tarde.");
      toast.error("Ocorreu um erro ao processar o pagamento. Por favor, tente novamente mais tarde.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    handlePayment();
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
        {paymentError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro no processamento</AlertTitle>
            <AlertDescription>{paymentError}</AlertDescription>
          </Alert>
        )}
      
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
              className="flex items-center justify-center py-3 gap-2 h-auto"
              onClick={() => handlePaymentMethodSelect("credit_card")}
            >
              <CreditCard className="h-5 w-5" />
              <span>Cartão de Crédito</span>
            </Button>
            
            <Button
              type="button"
              variant={paymentMethod === "pix" ? "default" : "outline"}
              className="flex items-center justify-center py-3 gap-2 h-auto"
              onClick={() => handlePaymentMethodSelect("pix")}
            >
              <Smartphone className="h-5 w-5" />
              <span>PIX</span>
            </Button>
            
            <Button
              type="button"
              variant={paymentMethod === "cash" ? "default" : "outline"}
              className="flex items-center justify-center py-3 gap-2 h-auto"
              onClick={() => handlePaymentMethodSelect("cash")}
            >
              <Banknote className="h-5 w-5" />
              <span>Dinheiro no Local</span>
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        {paymentError ? (
          <Button 
            className="w-full" 
            onClick={handleRetry} 
            disabled={isProcessing}
            variant="outline"
          >
            {isProcessing ? "Processando..." : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </>
            )}
          </Button>
        ) : null}
        
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
