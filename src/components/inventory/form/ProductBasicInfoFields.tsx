
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

export const ProductBasicInfoFields = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nome do Produto <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: Shampoo Hidratante 500ml" 
                maxLength={100}
                className={form.formState.errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                aria-describedby={form.formState.errors.name ? 'name-error' : 'name-help'}
                {...field} 
              />
            </FormControl>
            {!form.formState.errors.name && (
              <p className="text-sm text-muted-foreground" id="name-help">
                Digite um nome descritivo para o produto
              </p>
            )}
            <FormMessage id="name-error" />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="supplier"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fornecedor</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: Distribuidora ABC" 
                aria-describedby="supplier-help"
                {...field} 
              />
            </FormControl>
            <p className="text-sm text-muted-foreground" id="supplier-help">
              Opcional - Nome do fornecedor do produto
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
