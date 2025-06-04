
import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório").max(100, "O nome deve ter no máximo 100 caracteres"),
  description: z.string().optional(),
  category: z.enum(["hair", "makeup", "skincare", "nail"], {
    errorMap: () => ({ message: "Selecione uma categoria válida" })
  }),
  price: z.coerce.number().positive("O preço deve ser maior que zero").max(999999, "Preço muito alto"),
  quantity: z.coerce.number().int().nonnegative("A quantidade não pode ser negativa").max(999999, "Quantidade muito alta"),
  minQuantity: z.coerce.number().int().nonnegative("A quantidade mínima não pode ser negativa").max(999999, "Quantidade muito alta"),
  supplier: z.string().optional(),
  lastRestock: z.date().optional(),
  location: z.string().optional(),
}).refine((data) => data.minQuantity <= data.quantity, {
  message: "A quantidade mínima não pode ser maior que a quantidade atual",
  path: ["minQuantity"],
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const PRODUCT_CATEGORIES = [
  { value: "hair", label: "Cabelo" },
  { value: "makeup", label: "Maquiagem" },
  { value: "skincare", label: "Cuidados com a pele" },
  { value: "nail", label: "Unhas" },
] as const;
