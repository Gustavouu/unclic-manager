
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";

export type PaymentMethodSelectProps = {
  form: UseFormReturn<AppointmentFormValues>;
};

export const PaymentMethodSelect = ({ form }: PaymentMethodSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="paymentMethod"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Forma de Pagamento</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value || "local"}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="local">No local</SelectItem>
              <SelectItem value="pix">Pix</SelectItem>
              <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
              <SelectItem value="debit_card">Cartão de Débito</SelectItem>
              <SelectItem value="transfer">Transferência Bancária</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
