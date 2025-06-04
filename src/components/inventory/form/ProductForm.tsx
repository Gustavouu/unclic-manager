
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
import { toast } from "sonner";

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
      category: "hair",
      price: 0,
      quantity: 1,
      minQuantity: 1,
      supplier: "",
    },
    mode: "onChange", // Enable real-time validation
  });

  // Set form values when initialValues changes
  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name,
        description: initialValues.description || "",
        category: initialValues.category as "hair" | "makeup" | "skincare" | "nail",
        price: initialValues.price,
        quantity: initialValues.quantity,
        minQuantity: initialValues.minQuantity,
        supplier: initialValues.supplier || "",
      });
    } else {
      // Reset to default values for new products
      form.reset({
        name: "",
        description: "",
        category: "hair",
        price: 0,
        quantity: 1,
        minQuantity: 1,
        supplier: "",
      });
    }
  }, [initialValues, form]);

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      const newProduct: NewProduct = {
        name: data.name.trim(),
        description: data.description?.trim(),
        category: data.category,
        price: Number(data.price),
        quantity: Number(data.quantity),
        minQuantity: Number(data.minQuantity),
        supplier: data.supplier?.trim(),
      };
      
      await onSubmit(newProduct);
      
      if (!initialValues) {
        form.reset();
      }
      
      toast.success(initialValues ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar produto. Tente novamente.');
      console.error('Error saving product:', error);
    }
  };

  const isFormValid = form.formState.isValid;
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ProductBasicInfoFields />
        <ProductCategoryPriceFields />
        <ProductQuantityFields />
        <ProductDescriptionField />
        
        <DialogFooter className="gap-3">
          <DialogClose asChild>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            type="submit" 
            disabled={!isFormValid || isSubmitting}
            className="min-w-24"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </div>
            ) : (
              initialValues ? 'Atualizar' : 'Salvar'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
