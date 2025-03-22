
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

interface NewProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (product: NewProduct) => void;
}

export const NewProductDialog = ({ open, onOpenChange, onAddProduct }: NewProductDialogProps) => {
  const handleSubmit = (product: NewProduct) => {
    onAddProduct(product);
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os dados do produto para adicioná-lo ao inventário.
          </DialogDescription>
        </DialogHeader>
        
        <ProductForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
