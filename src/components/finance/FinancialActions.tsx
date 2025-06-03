
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
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
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

// Definindo os schemas para os formulários
const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.coerce.number().positive("O valor deve ser maior que zero"),
  paymentMethod: z.string().min(1, "Selecione um método de pagamento"),
  description: z.string().min(3, "Adicione uma descrição para a transação"),
  categoryId: z.string().optional(),
  paymentDate: z.string().optional(),
  status: z.string().default("PAID")
});

export function FinancialActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE" | null>(null);
  const { businessId } = useCurrentBusiness();
  
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "INCOME",
      amount: undefined,
      paymentMethod: "",
      description: "",
      status: "PAID"
    }
  });
  
  const onSubmit = async (data: z.infer<typeof transactionSchema>) => {
    try {
      // Get a default financial account
      const { data: accounts } = await supabase
        .from('financial_accounts')
        .select('id')
        .eq('tenantId', businessId)
        .eq('isActive', true)
        .limit(1);
      
      if (!accounts || accounts.length === 0) {
        toast.error("Nenhuma conta financeira configurada");
        return;
      }
      
      // Register the transaction in the database
      const { error } = await supabase
        .from('financial_transactions')
        .insert({
          id: crypto.randomUUID(),
          type: data.type,
          amount: data.amount,
          description: data.description,
          paymentMethod: data.paymentMethod as any,
          categoryId: data.categoryId,
          paymentDate: data.paymentDate,
          status: data.status as any,
          tenantId: businessId,
          accountId: accounts[0].id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success(`${data.type === "INCOME" ? "Receita" : "Despesa"} registrada com sucesso!`);
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao registrar transação:", error);
      toast.error("Erro ao registrar transação. Tente novamente.");
    }
  };
  
  const openDialog = (type: "INCOME" | "EXPENSE") => {
    setTransactionType(type);
    form.reset({
      type: type,
      amount: undefined,
      paymentMethod: "",
      description: "",
      status: "PAID"
    });
    setIsOpen(true);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        className="gap-2 text-green-600"
        onClick={() => openDialog("INCOME")}
      >
        <ArrowUpCircle className="h-4 w-4" />
        Nova Receita
      </Button>
      
      <Button
        variant="outline"
        className="gap-2 text-red-600"
        onClick={() => openDialog("EXPENSE")}
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
              {transactionType === "INCOME" ? "Adicionar Receita" : "Adicionar Despesa"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={`Descreva ${transactionType === "INCOME" ? "a receita" : "a despesa"}`}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paymentMethod"
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
                        <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                        <SelectItem value="DEBIT_CARD">Cartão de Débito</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="BANK_SLIP">Boleto</SelectItem>
                        <SelectItem value="CASH">Dinheiro</SelectItem>
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
                name="paymentDate"
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
