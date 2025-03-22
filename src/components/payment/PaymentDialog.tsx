
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { PaymentMethodSelect } from "./PaymentMethodSelect";
import { PaymentSummary } from "./PaymentSummary";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { toast } from "sonner";
import { Loader2, ExternalLink } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";

const paymentSchema = z.object({
  paymentMethod: z.string({ required_error: "Selecione uma forma de pagamento" }),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

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
        <DialogHeader>
          <DialogTitle>
            {step === "form" && "Realizar Pagamento"}
            {step === "processing" && "Processando Pagamento"}
            {step === "result" && "Resultado do Pagamento"}
          </DialogTitle>
          <DialogDescription>
            {step === "form" && "Preencha os dados para concluir o pagamento do serviço."}
            {step === "processing" && "Aguarde enquanto processamos seu pagamento..."}
            {step === "result" && "Confira o resultado do seu pagamento abaixo."}
          </DialogDescription>
        </DialogHeader>

        {step === "form" && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PaymentMethodSelect form={form} />
              
              <PaymentSummary
                amount={amount}
                serviceName={serviceName}
                appointmentDate={appointmentDate}
                paymentMethod={form.watch("paymentMethod")}
                className="mt-6"
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Pagar Agora
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">
              Estamos processando seu pagamento. Por favor, não feche esta janela.
            </p>
          </div>
        )}

        {step === "result" && paymentResult && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-4">
              <PaymentStatusBadge 
                status={paymentResult.status} 
                className="text-base px-3 py-1 mb-4"
              />
              
              {paymentResult.status === "approved" && (
                <div className="text-center">
                  <p className="text-green-600 font-medium mb-2">
                    Pagamento aprovado com sucesso!
                  </p>
                  {paymentResult.transactionId && (
                    <p className="text-sm text-muted-foreground">
                      Código da transação: {paymentResult.transactionId}
                    </p>
                  )}
                </div>
              )}
              
              {paymentResult.status === "rejected" && (
                <p className="text-center text-red-600">
                  Não foi possível processar seu pagamento. Verifique os dados e tente novamente.
                </p>
              )}
              
              {paymentResult.status === "pending" && (
                <p className="text-center text-amber-600">
                  Seu pagamento está em análise. Acompanhe o status na área de pagamentos.
                </p>
              )}
              
              {paymentResult.status === "processing" && (
                <p className="text-center text-blue-600">
                  Seu pagamento está sendo processado pelo Efi Bank. Aguarde a confirmação.
                </p>
              )}
              
              {paymentUrl && (
                <Button 
                  variant="outline" 
                  onClick={openPaymentUrl}
                  className="mt-4 flex items-center"
                >
                  Abrir Página de Pagamento <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
            
            <PaymentSummary
              amount={amount}
              serviceName={serviceName}
              appointmentDate={appointmentDate}
              paymentMethod={form.watch("paymentMethod")}
            />
            
            <DialogFooter>
              <Button onClick={handleClose}>
                {paymentResult.status === "approved" ? "Concluir" : "Fechar"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
