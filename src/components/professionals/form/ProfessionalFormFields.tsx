
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "../MultiSelect";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalCreateForm } from "@/hooks/professionals/types";
import React from "react";

interface ProfessionalFormFieldsProps {
  form: UseFormReturn<ProfessionalCreateForm>;
  specialties: string[];
}

export const ProfessionalFormFields = ({ form, specialties = [] }: ProfessionalFormFieldsProps) => {
  // Garantir que specialties é sempre um array
  const safeSpecialties = React.useMemo(() => 
    Array.isArray(specialties) ? specialties : [], 
    [specialties]
  );
  
  // Criar opções para o MultiSelect
  const specialtyOptions = React.useMemo(() => 
    safeSpecialties.map(specialty => ({
      label: specialty,
      value: specialty
    })),
    [safeSpecialties]
  );
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo *</FormLabel>
              <FormControl>
                <Input placeholder="Nome do colaborador" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Cabeleireiro, Manicure, etc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(00) 00000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="commissionPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comissão (%)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0" 
                  min="0" 
                  max="100" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Percentual de comissão sobre serviços realizados
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="specialties"
          render={({ field }) => {
            // Garantir que field.value é sempre um array
            const selectedValues = Array.isArray(field.value) ? field.value : [];
            
            // Converter o array de strings para o formato esperado pelo MultiSelect
            const selectedOptions = selectedValues.map(value => ({
              label: value,
              value
            }));
            
            return (
              <FormItem>
                <FormLabel>Especializações *</FormLabel>
                <FormControl>
                  <MultiSelect
                    placeholder="Selecione as especializações"
                    options={specialtyOptions}
                    value={selectedOptions}
                    onChange={(newValue) => {
                      field.onChange(newValue.map(item => item.value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Selecione os serviços que este profissional realiza
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
      
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Biografia</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Conte um pouco sobre o profissional..." 
                className="resize-none h-24"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
