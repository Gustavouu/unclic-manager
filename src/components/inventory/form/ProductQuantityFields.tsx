
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { AlertTriangle } from 'lucide-react';

export const ProductQuantityFields = () => {
  const form = useFormContext();
  const quantity = form.watch('quantity');
  const minQuantity = form.watch('minQuantity');
  
  const isLowStock = quantity <= minQuantity && quantity > 0 && minQuantity > 0;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Quantidade Atual <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0"
                  max="999999"
                  placeholder="1"
                  className={form.formState.errors.quantity ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  aria-describedby={form.formState.errors.quantity ? 'quantity-error' : 'quantity-help'}
                  {...field} 
                />
              </FormControl>
              {!form.formState.errors.quantity && (
                <p className="text-sm text-muted-foreground" id="quantity-help">
                  Quantidade disponível em estoque
                </p>
              )}
              <FormMessage id="quantity-error" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="minQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Estoque Mínimo <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0"
                  max="999999"
                  placeholder="1"
                  className={form.formState.errors.minQuantity ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  aria-describedby={form.formState.errors.minQuantity ? 'min-quantity-error' : 'min-quantity-help'}
                  {...field} 
                />
              </FormControl>
              {!form.formState.errors.minQuantity && (
                <p className="text-sm text-muted-foreground" id="min-quantity-help">
                  Alerta quando atingir este valor
                </p>
              )}
              <FormMessage id="min-quantity-error" />
            </FormItem>
          )}
        />
      </div>
      
      {isLowStock && (
        <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <p className="text-sm text-orange-800">
            <strong>Atenção:</strong> A quantidade atual está igual ou abaixo do estoque mínimo
          </p>
        </div>
      )}
    </div>
  );
};
