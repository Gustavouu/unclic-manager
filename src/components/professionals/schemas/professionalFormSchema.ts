
import { z } from 'zod';
import { ProfessionalStatus } from '@/hooks/professionals/types';

// Update the schema to match our ProfessionalStatus type
export const professionalFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  email: z.string().email('Email inválido').optional().nullable(),
  phone: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE'] as [ProfessionalStatus, ...ProfessionalStatus[]]).default('ACTIVE' as ProfessionalStatus),
  establishmentId: z.string().optional(),
  isActive: z.boolean().default(true),
  role: z.string().optional().nullable(),
  specialties: z.array(z.string()).optional(),
  commissionPercentage: z.number().min(0).max(100).optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  services: z.array(z.string()).optional(),
  hireDate: z.string().optional()
});

export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;
