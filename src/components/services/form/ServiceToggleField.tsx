
import React from "react";
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";
import { ServiceInfoTooltip } from "./ServiceInfoTooltip";
import { ServiceFormValues } from "./formSchema";

interface ServiceToggleFieldProps {
  control: Control<ServiceFormValues>;
  name: "isPopular" | "isFeatured";
  label: string;
  tooltipTitle: string;
  tooltipDescription: string;
}

export function ServiceToggleField({
  control,
  name,
  label,
  tooltipTitle,
  tooltipDescription,
}: ServiceToggleFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0">
          <div className="space-y-0.5 flex items-center">
            <FormLabel className="text-sm mr-2">{label}</FormLabel>
            <ServiceInfoTooltip 
              title={tooltipTitle} 
              description={tooltipDescription} 
            />
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
