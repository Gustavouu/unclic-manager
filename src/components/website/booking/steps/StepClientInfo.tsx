
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useClients } from "@/hooks/useClients";
import { BookingData } from "../types";
import { toast } from "sonner";

const clientFormSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um e-mail válido"),
  telefone: z.string().min(10, "Digite um telefone válido"),
});

type ClientFormData = z.infer<typeof clientFormSchema>;

interface StepClientInfoProps {
  bookingData: BookingData;
  onUpdateBookingData: (data: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepClientInfo({ bookingData, onUpdateBookingData, onNext, onBack }: StepClientInfoProps) {
  const { findClientByEmail, createClient } = useClients();
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
    },
  });

  const handleSearchClient = async (email: string) => {
    if (!email) return;
    
    try {
      setIsSearching(true);
      const client = await findClientByEmail(email);
      
      if (client) {
        // Found client, auto-fill the form
        form.setValue("nome", client.nome);
        form.setValue("telefone", client.telefone || "");
        
        // Update booking data
        onUpdateBookingData({
          clientId: client.id,
          clientName: client.nome,
          clientEmail: client.email,
          clientPhone: client.telefone,
        });
        
        toast.success("Cliente encontrado!");
      } else {
        toast.info("Cliente não encontrado, preencha os dados para cadastro");
      }
    } catch (error) {
      console.error("Error searching client:", error);
      toast.error("Erro ao buscar cliente");
    } finally {
      setIsSearching(false);
    }
  };

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (!bookingData.clientId) {
        // Create new client if not found
        setIsCreating(true);
        const newClient = await createClient({
          nome: data.nome,
          email: data.email,
          telefone: data.telefone
        });

        if (newClient) {
          onUpdateBookingData({
            clientId: newClient.id,
            clientName: newClient.nome,
            clientEmail: newClient.email,
            clientPhone: newClient.telefone,
          });
        }
        setIsCreating(false);
      }
      
      // Move to next step
      onNext();
    } catch (error) {
      console.error("Error in client step:", error);
      toast.error("Erro ao salvar informações do cliente");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Informações do Cliente</h2>
        <p className="text-sm text-muted-foreground">
          Informe seus dados para continuar com o agendamento
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="seu.email@exemplo.com"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      onBlur={(e) => {
                        field.onBlur();
                        handleSearchClient(e.target.value);
                      }}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSearchClient(form.getValues("email"))}
                    disabled={isSearching || !form.getValues("email")}
                  >
                    {isSearching ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
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

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Voltar
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Salvando..." : "Continuar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
