
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { professionalFormSchema } from '../schemas/professionalFormSchema';
import { ProfessionalFormFields } from './ProfessionalFormFields';
import { Professional, ProfessionalFormData } from '@/hooks/professionals/types';

interface ProfessionalFormProps {
  onClose: () => void;
  onSubmit: (data: ProfessionalFormData) => Promise<void>;
  professional?: Professional;
  editMode?: boolean;
  isSubmitting?: boolean;
}

export const ProfessionalForm = ({ 
  onClose, 
  onSubmit, 
  professional, 
  editMode = false, 
  isSubmitting = false 
}: ProfessionalFormProps) => {
  const form = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: {
      name: professional?.name || '',
      email: professional?.email || '',
      phone: professional?.phone || '',
      position: professional?.position || '',
      bio: professional?.bio || '',
      photo_url: professional?.photo_url || '',
      specialties: professional?.specialties || [],
      status: professional?.status || 'active',
      commission_percentage: professional?.commission_percentage || 0,
      hire_date: professional?.hire_date || '',
    },
  });

  const handleSubmit = async (data: ProfessionalFormData) => {
    await onSubmit(data);
  };

  // Mock specialties data - this should come from a service in a real app
  const specialties = [
    'Corte',
    'Coloração',
    'Manicure',
    'Pedicure',
    'Depilação',
    'Massagem',
    'Maquiagem',
    'Barba',
    'Tratamentos'
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ProfessionalFormFields 
          form={form} 
          specialties={specialties}
          editMode={editMode}
          initialPhotoUrl={professional?.photo_url || ''}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (editMode ? 'Atualizando...' : 'Criando...') 
              : (editMode ? 'Atualizar' : 'Criar')
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};
