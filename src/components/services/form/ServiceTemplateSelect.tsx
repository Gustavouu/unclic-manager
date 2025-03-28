
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { ServiceFormValues } from "./formSchema";
import { barberServiceTemplates } from "../barberServiceTemplates";

interface ServiceTemplateSelectProps {
  control: Control<ServiceFormValues>;
  onTemplateSelect: (templateId: string) => void;
}

export function ServiceTemplateSelect({ control, onTemplateSelect }: ServiceTemplateSelectProps) {
  return (
    <FormField
      control={control}
      name="template"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Serviço</FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onTemplateSelect(value);
              }}
              value={field.value || "custom"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Personalizado</SelectItem>
                {barberServiceTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
