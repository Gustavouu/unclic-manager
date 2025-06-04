
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
import { PRODUCT_CATEGORIES } from './productFormSchema';

export const ProductCategoryPriceFields = () => {
  const form = useFormContext();
  
  const formatCurrency = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.,]/g, '');
    // Convert comma to dot for decimal
    const normalizedValue = numericValue.replace(',', '.');
    return normalizedValue;
  };

  const formatDisplayPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Categoria <span className="text-red-500">*</span>
            </FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
            >
              <FormControl>
                <SelectTrigger 
                  className={form.formState.errors.category ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  aria-describedby={form.formState.errors.category ? 'category-error' : undefined}
                >
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage id="category-error" />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Preço <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="999999"
                  placeholder="0,00"
                  className={`pl-10 ${form.formState.errors.price ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  aria-describedby={form.formState.errors.price ? 'price-error' : 'price-help'}
                  {...field}
                  onChange={(e) => {
                    const value = formatCurrency(e.target.value);
                    field.onChange(value);
                  }}
                />
              </div>
            </FormControl>
            {!form.formState.errors.price && field.value > 0 && (
              <p className="text-sm text-muted-foreground" id="price-help">
                {formatDisplayPrice(Number(field.value))}
              </p>
            )}
            <FormMessage id="price-error" />
          </FormItem>
        )}
      />
    </div>
  );
};
