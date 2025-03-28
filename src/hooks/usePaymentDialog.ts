
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
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess?: () => void;
}

export function usePaymentDialog({
  serviceId,
  serviceName,
  amount,
  appointmentId,
  customerId,
  customerName,
  customerEmail,
  customerPhone,
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
    // Esta função seria chamada quando o pagamento for bem-sucedido
    // e não houver appointmentId (significando que precisamos criar um novo agendamento)
    if (appointmentId) return; // Se já temos um agendamento, não é necessário criar
    
    // Implementação real da criação de agendamento iria aqui
    console.log("Criando agendamento com transactionId:", transactionId);
  };

  const handleSubmit = async (values: PaymentFormValues) => {
    try {
      setStep("processing");
      
      // Processar o pagamento
      const response = await processPayment({
        serviceId,
        appointmentId,
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        amount,
        description: `Pagamento para ${serviceName}`,
        paymentMethod: values.paymentMethod
      });
      
      if (response) {
        // Atualizar o estado com o resultado do pagamento
        setPaymentResult({
          status: response.status as any,
          transactionId: response.transactionId
        });
        
        // Se o pagamento foi aprovado, criar o agendamento (se não existir)
        if (response.status === "approved" && !appointmentId) {
          await createAppointment(response.id);
        }
        
        setStep("result");
        
        // Se o pagamento foi aprovado, chamar o callback de sucesso
        if (response.status === "approved" && onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      setPaymentResult({
        status: "rejected"
      });
      setStep("result");
      toast.error("Não foi possível processar o pagamento. Por favor, tente novamente.");
    }
  };

  const handleClose = (onOpenChange: (open: boolean) => void) => {
    // Se estivermos no passo de resultado e o pagamento foi aprovado
    // e temos um callback de sucesso, executá-lo antes de fechar
    if (
      step === "result" && 
      paymentResult?.status === "approved" && 
      onSuccess
    ) {
      onSuccess();
    }
    
    // Fechar o diálogo
    onOpenChange(false);
  };

  return {
    step,
    paymentResult,
    paymentUrl,
    openPaymentUrl,
    handleSubmit,
    handleClose,
    isLoading,
    error
  };
}
