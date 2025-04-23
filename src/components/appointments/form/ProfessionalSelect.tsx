
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";

export interface ProfessionalSelectProps {
  form: UseFormReturn<AppointmentFormValues>;
  options?: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
  onProfessionalSelect?: (professional: any) => void;
  serviceId?: string;
  disabled?: boolean;
  defaultValue?: string;
  readOnly?: boolean;
}

export const ProfessionalSelect = ({ 
  form, 
  options = [], 
  onProfessionalSelect,
  serviceId,
  disabled = false,
  defaultValue,
  readOnly = false
}: ProfessionalSelectProps) => {
  // This could come from API or context
  const professionals = options.length > 0 ? options : [
    { value: "p1", label: "João Silva", description: "Cabelereiro" },
    { value: "p2", label: "Maria Oliveira", description: "Barbeira" },
    { value: "p3", label: "Carlos Pereira", description: "Estilista" },
    { value: "p4", label: "Ana Santos", description: "Manicure" }
  ];

  const handleSelectProfessional = (professionalId: string) => {
    const professional = professionals.find(p => p.value === professionalId);
    
    if (professional && onProfessionalSelect) {
      onProfessionalSelect({
        id: professional.value,
        nome: professional.label,
        cargo: professional.description
      });
    }
  };

  return (
    <FormField
      control={form.control}
      name="professionalId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Profissional</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              handleSelectProfessional(value);
            }}
            defaultValue={defaultValue || field.value}
            disabled={disabled || readOnly}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um profissional" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {professionals.map((professional) => (
                <SelectItem key={professional.value} value={professional.value}>
                  {professional.label} {professional.description ? `- ${professional.description}` : ''}
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
