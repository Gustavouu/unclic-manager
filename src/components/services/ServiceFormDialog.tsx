
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit } from 'lucide-react';
import { useServiceOperations } from '@/hooks/services/useServiceOperations';
import { ServiceService } from '@/services/service/serviceService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Service, ServiceFormData } from '@/types/service';

interface ServiceFormDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  service?: Service | null;
  onServiceSaved?: () => void;
  trigger?: React.ReactNode;
}

export const ServiceFormDialog: React.FC<ServiceFormDialogProps> = ({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  service,
  onServiceSaved,
  trigger
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Geral']);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    duration: 30,
    price: 0,
    category: 'Geral',
  });

  const { createService, updateService, isSubmitting } = useServiceOperations();
  const { businessId } = useCurrentBusiness();
  const serviceService = ServiceService.getInstance();

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const isEditing = !!service;

  useEffect(() => {
    const loadCategories = async () => {
      if (businessId) {
        try {
          const cats = await serviceService.getCategories(businessId);
          setCategories(cats);
        } catch (error) {
          console.error('Error loading categories:', error);
        }
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, businessId]);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || service.nome || '',
        description: service.description || service.descricao || '',
        duration: service.duration || service.duracao || 30,
        price: service.price || service.preco || 0,
        category: service.category || service.categoria || 'Geral',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        duration: 30,
        price: 0,
        category: 'Geral',
      });
    }
  }, [service, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    try {
      let result;
      if (isEditing && service) {
        result = await updateService(service.id, formData);
      } else {
        result = await createService(formData);
      }

      if (result) {
        setOpen(false);
        onServiceSaved?.();
      }
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleInputChange = (field: keyof ServiceFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const defaultTrigger = (
    <Button className="flex items-center gap-2">
      {isEditing ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {isEditing ? 'Editar' : 'Novo Serviço'}
    </Button>
  );

  const content = (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Serviço *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Ex: Corte Masculino"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Descreva o serviço..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duração (minutos) *</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="480"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 30)}
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
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );

  if (trigger || controlledOpen !== undefined) {
    return (
      <Dialog open={isOpen} onOpenChange={setOpen}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        {content}
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {defaultTrigger}
      </DialogTrigger>
      {content}
    </Dialog>
  );
};
