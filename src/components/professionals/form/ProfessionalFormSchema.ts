
import { z } from "zod";

export const professionalFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("Email inválido").min(1, "O email é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  document: z.string().min(1, "O CPF é obrigatório"),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  specialties: z.array(z.string()).min(1, "Selecione pelo menos uma especialidade"),
  commissionRate: z.number().min(0).max(100),
  active: z.boolean().default(true),
  notes: z.string().optional(),
});

export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;
