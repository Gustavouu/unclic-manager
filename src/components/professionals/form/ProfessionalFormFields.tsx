
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "../MultiSelect";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalCreateForm } from "@/hooks/professionals/types";

interface ProfessionalFormFieldsProps {
  form: UseFormReturn<ProfessionalCreateForm>;
  specialties: string[];
}

export const ProfessionalFormFields = ({ form, specialties = [] }: ProfessionalFormFieldsProps) => {
  // Garantir que specialties é sempre um array
  const safeSpecialties = Array.isArray(specialties) ? specialties : [];
  
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
                <Input placeholder="email@exemplo.com" {...field} />
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
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="specialties"
          render={({ field }) => {
            // Garantir que field.value é sempre um array
            const safeValue = Array.isArray(field.value) ? field.value : [];
            
            return (
              <FormItem>
                <FormLabel>Especializações *</FormLabel>
                <FormControl>
                  <MultiSelect
                    placeholder="Selecione as especializações"
                    options={safeSpecialties.map(specialty => ({ 
                      label: specialty, 
                      value: specialty 
                    }))}
                    value={safeValue.map(value => ({ 
                      label: value, 
                      value 
                    }))}
                    onChange={(newValue) => {
                      field.onChange(newValue.map(item => item.value));
                    }}
                  />
                </FormControl>
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
