
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
  role: z.string().optional().nullable(),
  position: z.string().optional().nullable(), // Added to match database field
  specialties: z.array(z.string()).optional(),
  commission_percentage: z.number().min(0).max(100).optional().nullable(),
  commissionPercentage: z.number().min(0).max(100).optional().nullable(), // For backward compatibility
  photo_url: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(), // For backward compatibility
  avatar: z.string().optional().nullable(),
  services: z.array(z.string()).optional(),
  hire_date: z.string().optional()
});

export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;

// For backward compatibility, also export as professionalSchema
export const professionalSchema = professionalFormSchema;
