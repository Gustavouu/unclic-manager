import { Dialog, DialogContent } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { usePayment } from "@/hooks/usePayment";
import { PaymentForm, PaymentFormValues } from "./PaymentForm";
import PaymentProcessing from "./PaymentProcessing";
import { PaymentResult } from "./PaymentResult";
import PaymentDialogHeader from "./PaymentDialogHeader";

const paymentSchema = z.object({
  paymentMethod: z.string({ required_error: "Selecione uma forma de pagamento" }),
});

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  serviceId: string;
  serviceName: string;
  amount: number;
  appointmentId?: string;
  appointmentDate?: string;
  customerId: string;
}

export const PaymentDialog = ({
  open,
  onOpenChange,
  onSuccess,
  serviceId,
  serviceName,
  amount,
  appointmentId,
  appointmentDate,
  customerId,
}: PaymentDialogProps) => {
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
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "",
    },
  });

  const handleClose = () => {
    if (step !== "processing") {
      onOpenChange(false);
      // Reset form after dialog is closed
      setTimeout(() => {
        form.reset();
        setStep("form");
        setPaymentResult(null);
      }, 300);
    }
  };

  const onSubmit = async (values: PaymentFormValues) => {
    setStep("processing");
    
    try {
      const result = await processPayment({
        serviceId,
        appointmentId,
        amount,
        customerId,
        paymentMethod: values.paymentMethod,
        description: `Pagamento para ${serviceName}`
      });
      
      setPaymentResult({
        status: result.status,
        transactionId: result.transactionId,
      });
      
      setStep("result");
      
      if (result.status === "approved") {
        toast.success("Pagamento realizado com sucesso!");
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <PaymentDialogHeader step={step} />

        {step === "form" && (
          <PaymentForm
            form={form}
            onSubmit={onSubmit}
            onCancel={handleClose}
            serviceName={serviceName}
            amount={amount}
            appointmentDate={appointmentDate}
          />
        )}

        {step === "processing" && <PaymentProcessing />}

        {step === "result" && paymentResult && (
          <PaymentResult
            paymentResult={paymentResult}
            paymentUrl={paymentUrl}
            openPaymentUrl={openPaymentUrl}
            onClose={handleClose}
            amount={amount}
            serviceName={serviceName}
            appointmentDate={appointmentDate}
            paymentMethod={form.watch("paymentMethod")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
