
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User2 } from "lucide-react";

const profileSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido").optional(),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos").optional(),
});

const UserProfileTab = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
    },
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("usuarios")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (error) throw error;
        
        setUserData(data);
        
        form.reset({
          nome: data.nome || user.user_metadata?.name || "",
          email: user.email || "",
          telefone: data.telefone || "",
        });
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };
    
    fetchUserData();
  }, [user, form]);
  
  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update user metadata in auth
      const { error: authError } = await supabase.auth.updateUser({
        data: { name: data.nome }
      });
      
      if (authError) throw authError;
      
      // Update user data in database
      const { error: dbError } = await supabase
        .from("usuarios")
        .update({
          nome: data.nome,
          telefone: data.telefone
        })
        .eq("id", user.id);
        
      if (dbError) throw dbError;
      
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error(`Erro ao salvar: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Seu Perfil</h3>
        <p className="text-sm text-muted-foreground">
          Atualize suas informações pessoais.
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={userData?.avatar_url} alt={userData?.nome || "Avatar"} />
          <AvatarFallback className="text-lg">
            {userData?.nome ? getInitials(userData.nome) : <User2 />}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h4 className="font-medium">{userData?.nome || user?.user_metadata?.name || user?.email}</h4>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
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
                  <Input placeholder="seu@email.com" type="email" disabled {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </form>
      </Form>
      
      <div className="pt-6 border-t">
        <h4 className="text-sm font-medium mb-4">Segurança</h4>
        <Button variant="outline">Alterar Senha</Button>
      </div>
    </div>
  );
};

export default UserProfileTab;
