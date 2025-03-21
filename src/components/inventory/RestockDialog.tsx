
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const RestockDialog = ({ item, onClose, onRestock }) => {
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState("");

  if (!item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError("Quantidade deve ser um número positivo");
      return;
    }
    
    onRestock(item.id, quantityNum);
  };

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Repor Estoque</DialogTitle>
            <DialogDescription>
              Adicionar unidades ao estoque de <strong>{item.name}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="current-quantity" className="w-32">Quantidade Atual:</Label>
              <div className="font-medium">{item.quantity}</div>
            </div>
            
            <div className="flex items-center gap-4">
              <Label htmlFor="restock-quantity" className="w-32">Adicionar:</Label>
              <div className="flex-1">
                <Input
                  id="restock-quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setError("");
                  }}
                  className="flex-1"
                />
                {error && <p className="text-sm text-destructive mt-1">{error}</p>}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Label htmlFor="new-quantity" className="w-32">Nova Quantidade:</Label>
              <div className="font-medium">
                {!isNaN(parseInt(quantity)) ? item.quantity + parseInt(quantity) : item.quantity}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Confirmar Reposição
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
