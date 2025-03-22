
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ServiceFormValues } from "./formSchema";

interface ServiceDescriptionFieldProps {
  control: Control<ServiceFormValues>;
}

export function ServiceDescriptionField({ control }: ServiceDescriptionFieldProps) {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrição (opcional)</FormLabel>
          <FormControl>
            <Textarea placeholder="Descreva o serviço..." {...field} className="resize-none" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
