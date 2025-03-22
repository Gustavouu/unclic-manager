
import * as z from "zod";

export const professionalSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  role: z.string().min(2, "Cargo deve ter pelo menos 2 caracteres"),
  bio: z.string().optional().or(z.literal("")),
  specialties: z.array(z.string()).min(1, "Selecione uma especialização"),
  commissionPercentage: z.coerce.number().min(0).max(100).optional(),
  photoUrl: z.string().optional().or(z.literal("")),
});

export type ProfessionalFormValues = z.infer<typeof professionalSchema>;
