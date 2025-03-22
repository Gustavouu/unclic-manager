
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ServiceFormValues } from "./formSchema";

interface ServiceNameFieldProps {
  control: Control<ServiceFormValues>;
}

export function ServiceNameField({ control }: ServiceNameFieldProps) {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome do serviço</FormLabel>
          <FormControl>
            <Input placeholder="Ex: Corte Degradê, Barba Completa, etc." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
