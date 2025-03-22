
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { NewProduct } from '@/hooks/inventory/useInventory';
import { ProductForm } from './form/ProductForm';
import { Product } from '@/hooks/inventory/types';

export interface NewProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (product: NewProduct) => void;
  product: Product | null;
}

export const NewProductDialog = ({ open, onOpenChange, onAddProduct, product }: NewProductDialogProps) => {
  const handleSubmit = (data: NewProduct) => {
    onAddProduct(data);
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          <DialogDescription>
            {product 
              ? 'Edite os dados do produto selecionado.' 
              : 'Preencha os dados do produto para adicioná-lo ao inventário.'}
          </DialogDescription>
        </DialogHeader>
        
        <ProductForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialValues={product}
        />
      </DialogContent>
    </Dialog>
  );
};
