
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

export const ProductDescriptionField = () => {
  const form = useFormContext();
  const description = form.watch('description');
  const maxLength = 500;
  const currentLength = description?.length || 0;
  
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrição</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Descrição detalhada do produto, características, uso recomendado, etc." 
              className="min-h-20 resize-none" 
              maxLength={maxLength}
              aria-describedby="description-help description-count"
              {...field} 
              value={field.value || ''}
            />
          </FormControl>
          <div className="flex justify-between items-start">
            <FormDescription id="description-help">
              Opcional - Informações adicionais sobre o produto
            </FormDescription>
            <span 
              className={`text-xs ${currentLength > maxLength * 0.9 ? 'text-orange-600' : 'text-muted-foreground'}`}
              id="description-count"
            >
              {currentLength}/{maxLength}
            </span>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
