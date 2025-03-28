
import { useState } from "react";
import { BookingData } from "../../types";
import { usePayment } from "@/hooks/usePayment";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

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
      // Format the date and time for storage
      const appointmentDate = bookingData.date 
        ? format(bookingData.date, 'yyyy-MM-dd') 
        : new Date().toISOString().split('T')[0];
        
      const timeStart = bookingData.time;
      
      // Calculate end time based on duration
      const [hours, minutes] = timeStart.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0);
      
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + bookingData.serviceDuration);
      
      const timeEnd = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
      
      const { data, error } = await supabase
        .from('agendamentos')
        .insert({
          id_servico: bookingData.serviceId,
          id_cliente: "1", // This should be dynamically set to the actual customer ID
          valor: bookingData.servicePrice,
          status: 'confirmado',
          data: appointmentDate,
          hora_inicio: timeStart,
          hora_fim: timeEnd,
          duracao: bookingData.serviceDuration,
          id_negocio: "1", // This should be dynamically set to the business ID
          id_funcionario: bookingData.professionalId,
          forma_pagamento: paymentMethod,
          observacoes: bookingData.notes
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Link transaction to appointment
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
        customerId: "1", // This should be dynamically set to the actual customer ID
        paymentMethod: paymentMethod,
        description: `Pagamento para ${bookingData.serviceName} com ${bookingData.professionalName}`,
        businessId: "1" // This should be dynamically set to the business ID
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
