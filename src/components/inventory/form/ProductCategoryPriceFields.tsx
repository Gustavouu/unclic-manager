
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ProductCategoryPriceFields = () => {
  const form = useFormContext();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value || "hair"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="hair">Cabelo</SelectItem>
                <SelectItem value="makeup">Maquiagem</SelectItem>
                <SelectItem value="skincare">Cuidados com a pele</SelectItem>
                <SelectItem value="nail">Unhas</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preço (R$)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
