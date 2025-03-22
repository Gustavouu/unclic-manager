
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { 
  DialogClose, 
  DialogFooter 
} from "@/components/ui/dialog";
import { NewProduct } from '@/hooks/inventory/useInventory';
import { productFormSchema, ProductFormValues } from './productFormSchema';
import { ProductBasicInfoFields } from './ProductBasicInfoFields';
import { ProductCategoryPriceFields } from './ProductCategoryPriceFields';
import { ProductQuantityFields } from './ProductQuantityFields';
import { ProductDescriptionField } from './ProductDescriptionField';
import { Product } from '@/hooks/inventory/types';

interface ProductFormProps {
  onSubmit: (product: NewProduct) => void;
  onCancel: () => void;
  initialValues?: Product | null;
}

export const ProductForm = ({ onSubmit, onCancel, initialValues }: ProductFormProps) => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: 0,
      quantity: 0,
      minQuantity: 5,
      supplier: "",
    },
  });

  // Set form values when initialValues changes
  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name,
        description: initialValues.description || "",
        category: initialValues.category,
        price: initialValues.price,
        quantity: initialValues.quantity,
        minQuantity: initialValues.minQuantity,
        supplier: initialValues.supplier || "",
      });
    }
  }, [initialValues, form]);

  const handleSubmit = (data: ProductFormValues) => {
    const newProduct: NewProduct = {
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      quantity: data.quantity,
      minQuantity: data.minQuantity,
      supplier: data.supplier,
    };
    
    onSubmit(newProduct);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <ProductBasicInfoFields />
        <ProductCategoryPriceFields />
        <ProductQuantityFields />
        <ProductDescriptionField />
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          </DialogClose>
          <Button type="submit">{initialValues ? 'Atualizar' : 'Salvar'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
