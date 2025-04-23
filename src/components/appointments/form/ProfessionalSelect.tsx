import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { professionals } from "../data/appointmentMockData";

export type ProfessionalSelectProps = {
  form: UseFormReturn<AppointmentFormValues>;
  serviceId?: string;
  disabled?: boolean;
  defaultValue?: string;
  readOnly?: boolean;
};

export const ProfessionalSelect = ({ 
  form, 
  serviceId, 
  disabled = false,
  defaultValue,
  readOnly = false
}: ProfessionalSelectProps) => {
  // Filtra profissionais baseado no serviço selecionado se necessário
  // (por exemplo, apenas profissionais qualificados para o serviço)
  const filteredProfessionals = professionals;
  
  return (
    <FormField
      control={form.control}
      name="professionalId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Profissional</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={defaultValue || field.value}
            disabled={disabled || readOnly}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um profissional" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {filteredProfessionals.map((professional) => (
                <SelectItem 
                  key={professional.id} 
                  value={professional.id}
                  disabled={readOnly && professional.id !== defaultValue}
                >
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
