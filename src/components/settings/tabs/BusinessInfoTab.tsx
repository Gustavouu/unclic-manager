
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useTenant } from "@/contexts/TenantContext";
import { supabase } from "@/integrations/supabase/client";

const businessSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  email: z.string().email("Email inválido"),
  endereco: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  descricao: z.string().optional(),
});

const BusinessInfoTab = () => {
  const { currentBusiness, businessId, refreshBusinessData } = useTenant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof businessSchema>>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      email: "",
      endereco: "",
      descricao: "",
    },
  });
  
  useEffect(() => {
    if (currentBusiness) {
      form.reset({
        nome: currentBusiness.nome || "",
        telefone: currentBusiness.telefone || "",
        email: currentBusiness.email || "",
        endereco: currentBusiness.endereco || "",
        descricao: currentBusiness.descricao || "",
      });
    }
  }, [currentBusiness, form]);
  
  const onSubmit = async (data: z.infer<typeof businessSchema>) => {
    if (!businessId) {
      toast.error("ID do negócio não disponível");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("negocios")
        .update(data)
        .eq("id", businessId);
        
      if (error) throw error;
      
      toast.success("Informações do negócio atualizadas com sucesso!");
      await refreshBusinessData();
    } catch (error: any) {
      console.error("Erro ao atualizar negócio:", error);
      toast.error(`Erro ao salvar: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Informações do Negócio</h3>
        <p className="text-sm text-muted-foreground">
          Atualize as informações básicas do seu estabelecimento.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Estabelecimento</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do seu negócio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="contato@seunegoio.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="endereco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Endereço completo" {...field} />
                </FormControl>
                <FormMessage />
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
                    placeholder="Uma breve descrição do seu negócio" 
                    className="resize-none" 
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BusinessInfoTab;
