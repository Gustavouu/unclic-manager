
import { z } from 'zod';
import { ProfessionalStatus } from '@/hooks/professionals/types';

// Update the schema to match our ProfessionalStatus type
export const professionalFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  email: z.string().email('Email inválido').optional().nullable(),
  phone: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  status: z.enum([ProfessionalStatus.ACTIVE, ProfessionalStatus.INACTIVE, ProfessionalStatus.ON_LEAVE])
    .default(ProfessionalStatus.ACTIVE),
  establishmentId: z.string().optional(),
  isActive: z.boolean().default(true),
  position: z.string().optional().nullable(),
  specialties: z.array(z.string()).optional(),
  commission_percentage: z.number().min(0).max(100).optional().nullable(),
  photo_url: z.string().optional().nullable(),
  hire_date: z.string().optional(),
  
  // For backward compatibility
  role: z.string().optional().nullable(),
  commissionPercentage: z.number().min(0).max(100).optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  services: z.array(z.string()).optional(),
  avatar: z.string().optional().nullable()
});

export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;

// For backward compatibility, also export as professionalSchema
export const professionalSchema = professionalFormSchema;
