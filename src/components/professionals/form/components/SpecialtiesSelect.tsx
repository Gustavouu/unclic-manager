import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect, Option } from "@/components/professionals/MultiSelect";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalCreateForm } from "@/hooks/professionals/types";

interface SpecialtiesSelectProps {
  form: UseFormReturn<ProfessionalCreateForm>;
  specialties: string[];
}

export const SpecialtiesSelect = ({ form, specialties = [] }: SpecialtiesSelectProps) => {
  // Ensure specialties is always an array
  const safeSpecialties = React.useMemo(() => 
    Array.isArray(specialties) ? specialties : [], 
    [specialties]
  );
  
  // Convert string array to Option array for MultiSelect
  const specialtyOptions = React.useMemo(() => 
    safeSpecialties.map(specialty => ({
      label: specialty,
      value: specialty
    })),
    [safeSpecialties]
  );

  // Convert form specialties string[] to Option[]
  const selectedSpecialties = React.useMemo(() => {
    const formSpecialties = form.watch("specialties") || [];
    return Array.isArray(formSpecialties) 
      ? formSpecialties.map(specialty => ({ label: specialty, value: specialty }))
      : [];
  }, [form]);

  // For backward compatibility, keep the single-select version
  const useSingleSelect = false; // Set to true to use single select instead of multi-select

  if (useSingleSelect) {
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
  }

  // Use the improved MultiSelect component
  return (
    <FormField
      control={form.control}
      name="specialties"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Especializações *</FormLabel>
          <FormControl>
            <MultiSelect
              options={specialtyOptions}
              value={selectedSpecialties}
              onChange={(selected) => {
                const values = selected.map(option => option.value);
                field.onChange(values);
              }}
              placeholder="Selecione as especializações"
              emptyMessage="Sem especializações disponíveis"
            />
          </FormControl>
          <FormDescription>
            Selecione uma ou mais especializações deste profissional
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
