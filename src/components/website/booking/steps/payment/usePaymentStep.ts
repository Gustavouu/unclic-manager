
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
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const { processPayment } = usePayment();

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
    // Reset any previous error when changing payment method
    setPaymentError(null);
    setShowPaymentQR(false);
    setPaymentUrl(null);
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
    setPaymentUrl(null);
    setShowPaymentQR(false);
    
    try {
      const paymentResult = await processPayment({
        serviceId: bookingData.serviceId,
        amount: bookingData.servicePrice,
        customerId: "1", // This should be dynamically set to the actual customer ID
        paymentMethod: paymentMethod,
        description: `Pagamento para ${bookingData.serviceName} com ${bookingData.professionalName}`,
        businessId: "1" // This should be dynamically set to the business ID
      });
      
      console.log("Payment result:", paymentResult);
      
      if (paymentMethod === "pix" && paymentResult.paymentUrl) {
        setPaymentUrl(paymentResult.paymentUrl);
        setShowPaymentQR(true);
        toast.success("QR Code Pix gerado com sucesso! Escaneie para pagar.");
        // For Pix, we don't move to the next step immediately as the user needs to pay
        return;
      }
      
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

  const handleConfirmPixPayment = async () => {
    setIsProcessing(true);
    
    try {
      // In a real scenario, we would check the payment status
      // For this demo, we'll just simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await createAppointment("PIX-" + Math.random().toString(36).substring(2, 7));
      toast.success("Pagamento Pix confirmado! Agendamento finalizado.");
      nextStep();
    } catch (error) {
      console.error("Error confirming Pix payment:", error);
      setPaymentError("Erro ao confirmar pagamento Pix. Tente novamente.");
      toast.error("Erro ao confirmar pagamento Pix. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    paymentMethod,
    isProcessing,
    paymentError,
    retryCount,
    paymentUrl,
    showPaymentQR,
    handlePaymentMethodSelect,
    handlePayment,
    handleRetry,
    handleConfirmPixPayment
  };
}
