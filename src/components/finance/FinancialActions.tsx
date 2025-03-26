
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusCircle, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Definindo os schemas para os formulários
const transactionSchema = z.object({
  tipo: z.enum(["receita", "despesa"]),
  valor: z.coerce.number().positive("O valor deve ser maior que zero"),
  metodo_pagamento: z.string().min(1, "Selecione um método de pagamento"),
  descricao: z.string().min(3, "Adicione uma descrição para a transação"),
  id_categoria: z.string().optional(),
  data_pagamento: z.string().optional(),
  status: z.string().default("approved")
});

export function FinancialActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"receita" | "despesa" | null>(null);
  
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      tipo: "receita",
      valor: undefined,
      metodo_pagamento: "",
      descricao: "",
      status: "approved"
    }
  });
  
  const onSubmit = async (data: z.infer<typeof transactionSchema>) => {
    try {
      // Registrar a transação no banco de dados
      const { error } = await supabase
        .from('transacoes')
        .insert({
          ...data,
          id_negocio: "1", // Substituir pelo ID real do negócio
          criado_em: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success(`${data.tipo === "receita" ? "Receita" : "Despesa"} registrada com sucesso!`);
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao registrar transação:", error);
      toast.error("Erro ao registrar transação. Tente novamente.");
    }
  };
  
  const openDialog = (type: "receita" | "despesa") => {
    setTransactionType(type);
    form.reset({
      tipo: type,
      valor: undefined,
      metodo_pagamento: "",
      descricao: "",
      status: "approved"
    });
    setIsOpen(true);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        className="gap-2 text-green-600"
        onClick={() => openDialog("receita")}
      >
        <ArrowUpCircle className="h-4 w-4" />
        Nova Receita
      </Button>
      
      <Button
        variant="outline"
        className="gap-2 text-red-600"
        onClick={() => openDialog("despesa")}
      >
        <ArrowDownCircle className="h-4 w-4" />
        Nova Despesa
      </Button>
      
      <Button variant="default" className="gap-2">
        <PlusCircle className="h-4 w-4" />
        Gerar Relatório
      </Button>
      
      {/* Dialog para adicionar transação */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {transactionType === "receita" ? "Adicionar Receita" : "Adicionar Despesa"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">R$</span>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={`Descreva ${transactionType === "receita" ? "a receita" : "a despesa"}`}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="metodo_pagamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um método" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                        <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="bank_slip">Boleto</SelectItem>
                        <SelectItem value="cash">Dinheiro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecione o método utilizado para esta transação.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="data_pagamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Pagamento</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        defaultValue={new Date().toISOString().slice(0, 10)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Registrar</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
