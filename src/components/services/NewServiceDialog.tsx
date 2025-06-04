
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useServices } from "@/hooks/services/useServices";
import { toast } from "sonner";

interface ServiceFormData {
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  image_url?: string;
}

interface NewServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onServiceCreated?: (service: any) => void;
}

export const NewServiceDialog: React.FC<NewServiceDialogProps> = ({
  open,
  onOpenChange,
  onServiceCreated
}) => {
  const { createService, isSubmitting } = useServices();
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    duration: 30,
    price: 0,
    category: "",
    image_url: ""
  });

  const handleInputChange = (field: keyof ServiceFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (formData.duration <= 0) {
      toast.error("Duração deve ser maior que zero");
      return;
    }

    if (formData.price < 0) {
      toast.error("Preço não pode ser negativo");
      return;
    }

    try {
      const newService = await createService({
        ...formData,
        category: formData.category || "Geral"
      });
      
      toast.success("Serviço criado com sucesso!");
      
      if (onServiceCreated) {
        onServiceCreated(newService);
      }
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        duration: 30,
        price: 0,
        category: "",
        image_url: ""
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Erro ao criar serviço");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Serviço</DialogTitle>
          <DialogDescription>
            Adicione um novo serviço ao seu negócio.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Nome do serviço"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descrição do serviço..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (min) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", parseInt(e.target.value) || 0)}
                placeholder="30"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Geral">Geral</SelectItem>
                <SelectItem value="Cabelo">Cabelo</SelectItem>
                <SelectItem value="Barba">Barba</SelectItem>
                <SelectItem value="Estética">Estética</SelectItem>
                <SelectItem value="Massagem">Massagem</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Serviço"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
