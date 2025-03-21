
import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }).optional().or(z.literal("")),
  phone: z.string().min(8, { message: "Telefone deve ter pelo menos 8 dígitos" }).optional().or(z.literal("")),
  gender: z.string().optional(),
  city: z.string().optional(),
  category: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

// This type ensures name is treated as required when passing to the useClientData functions
export type ClientSubmitValues = {
  name: string;
  email?: string;
  phone?: string;
  gender?: string;
  city?: string;
  category?: string;
};
