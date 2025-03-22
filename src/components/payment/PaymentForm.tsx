
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { PaymentMethodSelect } from "./PaymentMethodSelect";
import { PaymentSummary } from "./PaymentSummary";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const paymentSchema = z.object({
  paymentMethod: z.string({ required_error: "Selecione uma forma de pagamento" }),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  form: UseFormReturn<PaymentFormValues>;
  onSubmit: (values: PaymentFormValues) => void;
  onCancel: () => void;
  serviceName: string;
  amount: number;
  appointmentDate?: string;
}

export const PaymentForm = ({
  form,
  onSubmit,
  onCancel,
  serviceName,
  amount,
  appointmentDate,
}: PaymentFormProps) => {
  return (
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Pagar Agora
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
