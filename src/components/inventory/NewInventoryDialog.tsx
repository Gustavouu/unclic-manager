
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InventoryForm } from "./form/InventoryForm";
import { getEmptyInventoryForm } from "./form/inventoryFormValidation";

export const NewInventoryDialog = ({ categories, onAddItem }) => {
  const [open, setOpen] = useState(false);

  const handleAddItem = (formData) => {
    onAddItem({
      ...formData,
      quantity: parseInt(formData.quantity),
      minimumQuantity: parseInt(formData.minimumQuantity),
      costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
      sellingPrice: formData.sellingPrice ? parseFloat(formData.sellingPrice) : undefined,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          id="new-inventory-trigger" 
          className="hidden"
        >
          Novo Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Item ao Estoque</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo item. Campos com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <InventoryForm
          initialData={getEmptyInventoryForm()}
          categories={categories}
          onSubmit={handleAddItem}
          onCancel={() => setOpen(false)}
          submitLabel="Adicionar Item"
        />
      </DialogContent>
    </Dialog>
  );
};
