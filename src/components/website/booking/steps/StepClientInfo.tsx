
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookingData } from "../types";
import { useClients } from "@/hooks/useClients";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

interface StepClientInfoProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  nextStep: () => void;
}

const clientFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos" }).optional(),
  notes: z.string().optional()
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

export function StepClientInfo({ bookingData, updateBookingData, nextStep }: StepClientInfoProps) {
  const { findClientByEmail, createClient, isLoading } = useClients();
  const [clientChecked, setClientChecked] = useState(false);
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: bookingData.clientName || "",
      email: bookingData.clientEmail || "",
      phone: bookingData.clientPhone || "",
      notes: bookingData.notes || ""
    }
  });
  
  const handleEmailBlur = async () => {
    const email = form.getValues("email");
    
    if (email && !clientChecked) {
      try {
        const client = await findClientByEmail(email);
        if (client) {
          form.setValue("name", client.name);
          if (client.phone) form.setValue("phone", client.phone);
          
          updateBookingData({
            clientId: client.id,
            clientName: client.name,
            clientEmail: client.email,
            clientPhone: client.phone
          });
        }
        setClientChecked(true);
      } catch (error) {
        console.error("Error checking for existing client:", error);
      }
    }
  };
  
  const onSubmit = async (data: ClientFormValues) => {
    try {
      if (!bookingData.clientId) {
        // Create new client
        const newClient = await createClient({
          name: data.name,
          email: data.email,
          phone: data.phone
        });
        
        if (newClient) {
          updateBookingData({
            clientId: newClient.id,
            clientName: newClient.name,
            clientEmail: newClient.email,
            clientPhone: newClient.phone,
            notes: data.notes
          });
        }
      } else {
        // Just update the booking data with form values
        updateBookingData({
          clientName: data.name,
          clientEmail: data.email,
          clientPhone: data.phone,
          notes: data.notes
        });
      }
      
      nextStep();
    } catch (error) {
      console.error("Error processing client information:", error);
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Seus dados</CardTitle>
        <p className="text-muted-foreground mt-2">
          Preencha seus dados para confirmar o agendamento
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Seu nome completo" />
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
                    <Input 
                      {...field} 
                      placeholder="seu.email@exemplo.com" 
                      type="email"
                      onBlur={handleEmailBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="(00) 00000-0000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Alguma informação adicional que gostaria de compartilhar?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CardFooter className="px-0 pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || form.formState.isSubmitting}
              >
                {isLoading || form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Finalizar Agendamento"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
