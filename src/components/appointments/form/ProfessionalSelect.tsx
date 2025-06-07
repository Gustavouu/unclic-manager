
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormData } from "../schemas/appointmentFormSchema";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";

export type ProfessionalSelectProps = {
  form: UseFormReturn<AppointmentFormData>;
};

export const ProfessionalSelect = ({ form }: ProfessionalSelectProps) => {
  const { professionals, isLoading } = useProfessionals();

  return (
    <FormField
      control={form.control}
      name="professionalId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Profissional</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um profissional"} />
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
