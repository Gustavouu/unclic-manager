import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";

export type NotesFieldProps = {
  form: UseFormReturn<AppointmentFormValues>;
};

export const NotesField = ({ form }: NotesFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Observações</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Adicione detalhes ou instruções especiais para o agendamento..."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
