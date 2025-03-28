
import { z } from "zod";

export const transactionSchema = z.object({
  tipo: z.enum(["receita", "despesa"]),
  valor: z.coerce.number().positive("O valor deve ser maior que zero"),
  metodo_pagamento: z.string().min(1, "Selecione um método de pagamento"),
  descricao: z.string().min(3, "Adicione uma descrição para a transação"),
  id_categoria: z.string().optional(),
  data_pagamento: z.string().optional(),
  status: z.string().default("approved")
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
