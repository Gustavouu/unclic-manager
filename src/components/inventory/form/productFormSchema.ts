
import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
  category: z.string().min(1, "A categoria é obrigatória"),
  price: z.coerce.number().positive("O preço deve ser maior que zero"),
  quantity: z.coerce.number().int().nonnegative("A quantidade não pode ser negativa"),
  minQuantity: z.coerce.number().int().nonnegative("A quantidade mínima não pode ser negativa"),
  supplier: z.string().optional(),
  lastRestock: z.date().optional(),
  location: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
