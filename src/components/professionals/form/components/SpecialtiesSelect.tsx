
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalCreateForm } from "@/hooks/professionals/types";

interface SpecialtiesSelectProps {
  form: UseFormReturn<ProfessionalCreateForm>;
  specialties: string[];
}

export const SpecialtiesSelect = ({ form, specialties = [] }: SpecialtiesSelectProps) => {
  // Garantir que specialties é sempre um array
  const safeSpecialties = React.useMemo(() => 
    Array.isArray(specialties) ? specialties : [], 
    [specialties]
  );
  
  return (
    <FormField
      control={form.control}
      name="specialties"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Especialização *</FormLabel>
          <Select 
            onValueChange={(value) => field.onChange([value])}
            value={Array.isArray(field.value) && field.value.length > 0 ? field.value[0] : ""}
            defaultValue=""
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma especialização" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {safeSpecialties.length > 0 ? (
                safeSpecialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Sem especializações disponíveis
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormDescription>
            Selecione a especialização principal deste profissional
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
