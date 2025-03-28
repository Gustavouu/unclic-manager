
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TransactionForm } from "../forms/TransactionForm";
import { TransactionFormValues } from "../forms/transactionSchema";

interface TransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  transactionType: "receita" | "despesa" | null;
}

export function TransactionDialog({ 
  isOpen, 
  setIsOpen, 
  transactionType 
}: TransactionDialogProps) {
  if (!transactionType) return null;

  const defaultValues: TransactionFormValues = {
    tipo: transactionType,
    valor: undefined,
    metodo_pagamento: "",
    descricao: "",
    status: "approved"
  };

  const handleSubmit = async (data: TransactionFormValues) => {
    try {
      // Ensure valor is a number
      const valor = typeof data.valor === 'number' ? data.valor : 0;
      
      // Registrar a transação no banco de dados
      const { error } = await supabase
        .from('transacoes')
        .insert({
          tipo: data.tipo,
          valor: valor,
          descricao: data.descricao,
          metodo_pagamento: data.metodo_pagamento,
          id_categoria: data.id_categoria,
          data_pagamento: data.data_pagamento,
          status: data.status,
          id_negocio: "1", // Substituir pelo ID real do negócio
          criado_em: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success(`${data.tipo === "receita" ? "Receita" : "Despesa"} registrada com sucesso!`);
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao registrar transação:", error);
      toast.error("Erro ao registrar transação. Tente novamente.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {transactionType === "receita" ? "Adicionar Receita" : "Adicionar Despesa"}
          </DialogTitle>
        </DialogHeader>
        
        <TransactionForm 
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
          transactionType={transactionType}
        />
      </DialogContent>
    </Dialog>
  );
}
