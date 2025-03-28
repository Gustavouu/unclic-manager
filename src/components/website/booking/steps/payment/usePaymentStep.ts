
import { useState } from "react";
import { BookingData } from "../../types";
import { usePayment } from "@/hooks/usePayment";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UsePaymentStepProps {
  bookingData: BookingData;
  nextStep: () => void;
}

export function usePaymentStep({ bookingData, nextStep }: UsePaymentStepProps) {
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

  return {
    paymentMethod,
    isProcessing,
    paymentError,
    retryCount,
    handlePaymentMethodSelect,
    handlePayment,
    handleRetry
  };
}
