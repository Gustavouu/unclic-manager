
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useServiceOperations } from "@/hooks/services/useServiceOperations";
import type { Service, ServiceFormData } from "@/types/service";

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  onServiceSaved?: () => void;
}

export const ServiceFormDialog: React.FC<ServiceFormDialogProps> = ({
  open,
  onOpenChange,
  service,
  onServiceSaved
}) => {
  const { createService, updateService, isSubmitting } = useServiceOperations();
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    duration: 30,
    price: 0,
    category: "Geral"
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.nome || service.name || "",
        description: service.descricao || service.description || "",
        duration: service.duracao || service.duration || 30,
        price: service.preco || service.price || 0,
        category: service.categoria || service.category || "Geral"
      });
    } else {
      setFormData({
        name: "",
        description: "",
        duration: 30,
        price: 0,
        category: "Geral"
      });
    }
  }, [service, open]);

  const handleInputChange = (field: keyof ServiceFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    try {
      if (service) {
        await updateService(service.id, formData);
      } else {
        await createService(formData);
      }
      
      onServiceSaved?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {service ? "Editar Serviço" : "Novo Serviço"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Serviço</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Corte de Cabelo"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                min="5"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Geral">Geral</SelectItem>
                <SelectItem value="Cabelo">Cabelo</SelectItem>
                <SelectItem value="Barba">Barba</SelectItem>
                <SelectItem value="Unhas">Unhas</SelectItem>
                <SelectItem value="Estética">Estética</SelectItem>
                <SelectItem value="Massagem">Massagem</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva o serviço..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : service ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
