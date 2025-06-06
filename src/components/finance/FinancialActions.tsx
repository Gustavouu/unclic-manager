
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
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("O valor deve ser maior que zero"),
  paymentMethod: z.string().min(1, "Selecione um método de pagamento"),
  description: z.string().min(3, "Adicione uma descrição para a transação"),
  categoryId: z.string().optional(),
  paymentDate: z.string().optional(),
  status: z.string().default("paid")
});

export function FinancialActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"income" | "expense" | null>(null);
  const { businessId } = useCurrentBusiness();
  
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "income",
      amount: undefined,
      paymentMethod: "",
      description: "",
      status: "paid"
    }
  });
  
  const onSubmit = async (data: z.infer<typeof transactionSchema>) => {
    try {
      // Register the payment in the payments table
      const { error } = await supabase
        .from('payments')
        .insert({
          id: crypto.randomUUID(),
          amount: data.amount,
          payment_method: data.paymentMethod,
          status: data.status,
          business_id: businessId,
          payment_date: data.paymentDate ? new Date(data.paymentDate).toISOString() : new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success(`${data.type === "income" ? "Receita" : "Despesa"} registrada com sucesso!`);
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao registrar transação:", error);
      toast.error("Erro ao registrar transação. Tente novamente.");
    }
  };
  
  const openDialog = (type: "income" | "expense") => {
    setTransactionType(type);
    form.reset({
      type: type,
      amount: undefined,
      paymentMethod: "",
      description: "",
      status: "paid"
    });
    setIsOpen(true);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        className="gap-2 text-green-600"
        onClick={() => openDialog("income")}
      >
        <ArrowUpCircle className="h-4 w-4" />
        Nova Receita
      </Button>
      
      <Button
        variant="outline"
        className="gap-2 text-red-600"
        onClick={() => openDialog("expense")}
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
              {transactionType === "income" ? "Adicionar Receita" : "Adicionar Despesa"}
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
                        placeholder={`Descreva ${transactionType === "income" ? "a receita" : "a despesa"}`}
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
