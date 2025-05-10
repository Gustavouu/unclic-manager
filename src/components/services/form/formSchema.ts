
import { z } from "zod";

export const serviceFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  duration: z.coerce.number().min(5, { message: "Duração mínima de 5 minutos" }),
  price: z.union([
    z.coerce.number().min(0, { message: "Preço não pode ser negativo" }),
    z.string().refine((val) => !isNaN(parseFloat(val)), { 
      message: "Preço deve ser um número válido" 
    })
  ]).transform(val => {
    // Ensure we always have a number
    if (typeof val === 'string') {
      return parseFloat(val);
    }
    return val;
  }),
  isPopular: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  description: z.string().optional(),
  template: z.string().default("custom"),
  category: z.string().optional(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
