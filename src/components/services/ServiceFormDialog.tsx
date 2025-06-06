
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { ServiceImageUpload } from './ServiceImageUpload';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { toast } from 'sonner';
import type { Service, ServiceFormData } from '@/types/service';

const serviceSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  duration: z.coerce.number().min(1, 'Duração deve ser pelo menos 1 minuto').max(480, 'Duração máxima de 8 horas'),
  price: z.coerce.number().min(0, 'Preço não pode ser negativo'),
  category: z.string().optional(),
  image_url: z.string().optional(),
  commission_percentage: z.coerce.number().min(0, 'Comissão não pode ser negativa').max(100, 'Comissão não pode ser maior que 100%').optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

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
  const [imageUrl, setImageUrl] = useState<string>('');

  const { createService, updateService, isSubmitting } = useServiceOperations();
  const { businessId } = useCurrentBusiness();
  const serviceService = ServiceService.getInstance();

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;
  const isEditing = !!service;

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      duration: 30,
      price: 0,
      category: 'Geral',
      image_url: '',
      commission_percentage: 0,
    }
  });

  useEffect(() => {
    const loadCategories = async () => {
      if (businessId && isOpen) {
        try {
          const cats = await serviceService.getCategories(businessId);
          setCategories(cats.length > 0 ? cats : ['Geral']);
        } catch (error) {
          console.error('Error loading categories:', error);
          setCategories(['Geral']);
        }
      }
    };
    loadCategories();
  }, [isOpen, businessId]);

  useEffect(() => {
    if (service && isOpen) {
      const serviceData = {
        name: service.name || service.nome || '',
        description: service.description || service.descricao || '',
        duration: service.duration || service.duracao || 30,
        price: service.price || service.preco || 0,
        category: service.category || service.categoria || 'Geral',
        image_url: service.image_url || '',
        commission_percentage: service.commission_percentage || 0,
      };
      
      form.reset(serviceData);
      setImageUrl(serviceData.image_url);
    } else if (!service && isOpen) {
      form.reset({
        name: '',
        description: '',
        duration: 30,
        price: 0,
        category: 'Geral',
        image_url: '',
        commission_percentage: 0,
      });
      setImageUrl('');
    }
  }, [service, isOpen, form]);

  const handleImageChange = (newImageUrl: string | null) => {
    const url = newImageUrl || '';
    setImageUrl(url);
    form.setValue('image_url', url);
  };

  const handleSubmit = async (data: ServiceFormValues) => {
    try {
      const serviceData: ServiceFormData & { image_url?: string; commission_percentage?: number } = {
        ...data,
        image_url: imageUrl,
      };

      let result;
      if (isEditing && service) {
        result = await updateService(service.id, serviceData);
      } else {
        result = await createService(serviceData);
      }

      if (result) {
        setOpen(false);
        onServiceSaved?.();
        toast.success(isEditing ? 'Serviço atualizado com sucesso!' : 'Serviço criado com sucesso!');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Erro ao salvar serviço');
    }
  };

  const defaultTrigger = (
    <Button className="flex items-center gap-2">
      {isEditing ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {isEditing ? 'Editar' : 'Novo Serviço'}
    </Button>
  );

  const content = (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ServiceImageUpload
          currentImageUrl={imageUrl}
          onImageChange={handleImageChange}
          serviceId={service?.id}
          disabled={isSubmitting}
        />

        <div className="space-y-2">
          <Label htmlFor="name">Nome do Serviço *</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="Ex: Corte Masculino"
            disabled={isSubmitting}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            {...form.register('description')}
            placeholder="Descreva o serviço..."
            rows={3}
            disabled={isSubmitting}
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
              {...form.register('duration')}
              disabled={isSubmitting}
            />
            {form.formState.errors.duration && (
              <p className="text-sm text-red-600">{form.formState.errors.duration.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              {...form.register('price')}
              disabled={isSubmitting}
            />
            {form.formState.errors.price && (
              <p className="text-sm text-red-600">{form.formState.errors.price.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={form.watch('category') || 'Geral'}
              onValueChange={(value) => form.setValue('category', value)}
              disabled={isSubmitting}
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

          <div className="space-y-2">
            <Label htmlFor="commission">Comissão (%)</Label>
            <Input
              id="commission"
              type="number"
              min="0"
              max="100"
              step="0.1"
              {...form.register('commission_percentage')}
              placeholder="0"
              disabled={isSubmitting}
            />
            {form.formState.errors.commission_percentage && (
              <p className="text-sm text-red-600">{form.formState.errors.commission_percentage.message}</p>
            )}
          </div>
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
