
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { professionals } from "../data/appointmentMockData";

type ProfessionalSelectProps = {
  form: UseFormReturn<AppointmentFormValues>;
};

export const ProfessionalSelect = ({ form }: ProfessionalSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="professionalId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Profissional</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um profissional" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {professionals.map((professional) => (
                <SelectItem key={professional.id} value={professional.id}>
                  {professional.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
