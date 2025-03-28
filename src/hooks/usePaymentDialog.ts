
import { useState } from "react";
import { toast } from "sonner";
import { usePayment } from "@/hooks/usePayment";
import { PaymentFormValues } from "@/components/payment/PaymentForm";
import { supabase } from "@/integrations/supabase/client";

interface UsePaymentDialogProps {
  serviceId: string;
  serviceName: string;
  amount: number;
  appointmentId?: string;
  customerId: string;
  onSuccess?: () => void;
}

export function usePaymentDialog({
  serviceId,
  serviceName,
  amount,
  appointmentId,
  customerId,
  onSuccess
}: UsePaymentDialogProps) {
  const [step, setStep] = useState<"form" | "processing" | "result">("form");
  const [paymentResult, setPaymentResult] = useState<{
    status: "pending" | "approved" | "rejected" | "cancelled" | "processing";
    transactionId?: string;
  } | null>(null);
  
  const { 
    processPayment, 
    isLoading, 
    error, 
    paymentUrl, 
    openPaymentUrl 
  } = usePayment();

  const createAppointment = async (transactionId: string) => {
    // This function would be called when payment is successful
    // and there's no appointmentId yet (meaning we need to create a new appointment)
    if (appointmentId) return; // If we already have an appointment, no need to create
    
    try {
      // We need to adjust this to match our database schema requirements
      const appointmentDate = new Date();
      const currentTime = new Date();
      const hourStart = `${currentTime.getHours()}:${currentTime.getMinutes()}`;
      const hourEnd = `${currentTime.getHours() + 1}:${currentTime.getMinutes()}`;
      
      // Logic to create a new appointment
      const { data, error } = await supabase
        .from('agendamentos')
        .insert({
          id_servico: serviceId,
          id_cliente: customerId,
          valor: amount,
          status: 'confirmado',
          data: appointmentDate.toISOString().split('T')[0],
          hora_inicio: hourStart,
          hora_fim: hourEnd,
          duracao: 60, // Default 1 hour
          id_negocio: "1", // Example business ID
          id_funcionario: "1", // Example professional ID (should be dynamically chosen)
          forma_pagamento: "credit_card" // This will be updated with actual value
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success("Agendamento confirmado com sucesso!");
      
      // Update the transaction with the new appointment ID
      await supabase
        .from('transacoes')
        .update({ id_agendamento: data.id })
        .eq('id', transactionId);
        
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast.error("O pagamento foi aprovado, mas não foi possível finalizar o agendamento. Entre em contato com o suporte.");
    }
  };

  const handleSubmit = async (values: PaymentFormValues) => {
    setStep("processing");
    
    try {
      const result = await processPayment({
        serviceId,
        appointmentId,
        amount,
        customerId,
        paymentMethod: values.paymentMethod,
        description: `Pagamento para ${serviceName}`,
        businessId: "1" // Set default business ID
      });
      
      // Ensure we're only setting a valid status
      setPaymentResult({
        status: result.status as "pending" | "approved" | "rejected" | "cancelled" | "processing",
        transactionId: result.transactionId,
      });
      
      setStep("result");
      
      if (result.status === "approved") {
        toast.success("Pagamento realizado com sucesso!");
        
        // If payment is approved and we don't have an appointmentId,
        // we need to create the appointment
        if (result.transactionId && !appointmentId) {
          await createAppointment(result.id);
        }
        
        if (onSuccess) onSuccess();
      } else if (result.status === "rejected") {
        toast.error("Pagamento recusado. Verifique os dados e tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Erro ao processar o pagamento. Tente novamente mais tarde.");
      setPaymentResult({
        status: "rejected",
      });
      setStep("result");
    }
  };

  const handleClose = (onOpenChange: (open: boolean) => void) => {
    if (step !== "processing") {
      onOpenChange(false);
    }
  };

  return {
    step,
    paymentResult,
    paymentUrl,
    openPaymentUrl,
    isLoading,
    error,
    handleSubmit,
    handleClose
  };
}
