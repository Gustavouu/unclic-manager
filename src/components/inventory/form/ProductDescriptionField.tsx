
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

export const ProductDescriptionField = () => {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrição</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Descrição detalhada do produto" 
              className="min-h-24 resize-none" 
              {...field} 
              value={field.value || ''}
            />
          </FormControl>
          <FormDescription>
            Inclua informações relevantes sobre o produto como características, uso recomendado, etc.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
