
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
import { useProfessionalsOperations } from '@/hooks/professionals/useProfessionalsOperations';
import type { Professional, ProfessionalFormData } from '@/types/professional';

const professionalSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  position: z.string().optional(),
  bio: z.string().optional(),
  photo_url: z.string().optional(),
  status: z.string().optional(),
});

type ProfessionalFormValues = z.infer<typeof professionalSchema>;

interface ProfessionalFormDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  professional?: Professional | null;
  onProfessionalSaved?: () => void;
  trigger?: React.ReactNode;
}

export const ProfessionalFormDialog: React.FC<ProfessionalFormDialogProps> = ({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  professional,
  onProfessionalSaved,
  trigger
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const { createProfessional, updateProfessional, isSubmitting } = useProfessionalsOperations();

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;
  const isEditing = !!professional;

  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      position: '',
      bio: '',
      photo_url: '',
      status: 'active',
    }
  });

  useEffect(() => {
    if (professional && isOpen) {
      const professionalData = {
        name: professional.name || professional.nome || '',
        email: professional.email || '',
        phone: professional.phone || professional.telefone || '',
        position: professional.position || professional.cargo || '',
        bio: professional.bio || '',
        photo_url: professional.photo_url || professional.foto_url || '',
        status: professional.status || 'active',
      };
      
      form.reset(professionalData);
    } else if (!professional && isOpen) {
      form.reset({
        name: '',
        email: '',
        phone: '',
        position: '',
        bio: '',
        photo_url: '',
        status: 'active',
      });
    }
  }, [professional, isOpen, form]);

  const handleSubmit = async (data: ProfessionalFormValues) => {
    try {
      const professionalData: ProfessionalFormData = {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        position: data.position || undefined,
        bio: data.bio || undefined,
        photo_url: data.photo_url || undefined,
        status: data.status || 'active',
      };

      let result;
      if (isEditing && professional) {
        result = await updateProfessional(professional.id, professionalData);
      } else {
        result = await createProfessional(professionalData);
      }

      if (result) {
        setOpen(false);
        onProfessionalSaved?.();
      }
    } catch (error) {
      console.error('Error saving professional:', error);
    }
  };

  const defaultTrigger = (
    <Button className="flex items-center gap-2">
      {isEditing ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {isEditing ? 'Editar' : 'Novo Profissional'}
    </Button>
  );

  const content = (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? 'Editar Profissional' : 'Novo Profissional'}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="Nome do profissional"
            disabled={isSubmitting}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            placeholder="email@exemplo.com"
            disabled={isSubmitting}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              {...form.register('phone')}
              placeholder="(11) 99999-9999"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Cargo</Label>
            <Input
              id="position"
              {...form.register('position')}
              placeholder="Ex: Cabeleireiro"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Biografia</Label>
          <Textarea
            id="bio"
            {...form.register('bio')}
            placeholder="Breve descrição sobre o profissional..."
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={form.watch('status') || 'active'}
            onValueChange={(value) => form.setValue('status', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
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
