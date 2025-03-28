
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { PaymentForm, PaymentFormValues } from "./PaymentForm";
import PaymentProcessing from "./PaymentProcessing";
import { PaymentResult } from "./PaymentResult";
import PaymentDialogHeader from "./PaymentDialogHeader";
import { usePaymentDialog } from "@/hooks/usePaymentDialog";

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
  const {
    step,
    paymentResult,
    paymentUrl,
    openPaymentUrl,
    handleSubmit,
    handleClose
  } = usePaymentDialog({
    serviceId,
    serviceName,
    amount,
    appointmentId,
    customerId,
    onSuccess
  });
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "",
    },
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        form.reset();
      }, 300);
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={(value) => handleClose(onOpenChange)}>
      <DialogContent className="sm:max-w-[500px]">
        <PaymentDialogHeader step={step} />

        {step === "form" && (
          <PaymentForm
            form={form}
            onSubmit={(values) => handleSubmit(values)}
            onCancel={() => onOpenChange(false)}
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
            onClose={() => onOpenChange(false)}
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
