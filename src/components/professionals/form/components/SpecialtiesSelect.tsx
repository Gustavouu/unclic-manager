
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { MultiSelect } from "@/components/professionals/multiselect/ProfessionalsMultiSelect";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormData } from "@/hooks/professionals/types";
import { Option } from "@/components/professionals/multiselect/types";

interface SpecialtiesSelectProps {
  form: UseFormReturn<ProfessionalFormData>;
  specialties: string[];
}

export const SpecialtiesSelect = ({ form, specialties = [] }: SpecialtiesSelectProps) => {
  // Convert flat specialties array to Option[] format for MultiSelect
  const specialtyOptions = React.useMemo(() => {
    return specialties.map(specialty => ({
      label: specialty,
      value: specialty
    }));
  }, [specialties]);
  
  // Add common specialties if the provided list is empty
  const finalOptions = React.useMemo(() => {
    if (specialtyOptions.length === 0) {
      return [
        { label: "Corte", value: "Corte" },
        { label: "Coloração", value: "Coloração" },
        { label: "Manicure", value: "Manicure" },
        { label: "Pedicure", value: "Pedicure" },
        { label: "Depilação", value: "Depilação" },
        { label: "Massagem", value: "Massagem" },
        { label: "Maquiagem", value: "Maquiagem" }
      ];
    }
    return specialtyOptions;
  }, [specialtyOptions]);
  
  // Get currently selected specialties from form
  const selectedSpecialties = React.useMemo(() => {
    const formSpecialties = form.watch("specialties") || [];
    return Array.isArray(formSpecialties) 
      ? formSpecialties
      : [];
  }, [form]);
  
  return (
    <FormField
      control={form.control}
      name="specialties"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Especializações</FormLabel>
          <FormControl>
            <MultiSelect
              options={finalOptions}
              selectedValues={selectedSpecialties}
              onChange={(values) => {
                field.onChange(values);
              }}
              placeholder="Selecione as especializações"
            />
          </FormControl>
          <FormDescription>
            Selecione as especialidades deste profissional.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
