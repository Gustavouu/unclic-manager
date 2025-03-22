
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>
        
        <ProductForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
