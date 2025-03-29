
import { useState, useEffect } from "react";
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
  
  // Format phone as user types
  const formatPhoneInput = (value: string) => {
    // Remove all non-numeric characters
    const numbersOnly = value.replace(/\D/g, '');
    
    // Apply mask as user types
    if (numbersOnly.length <= 2) {
      return `(${numbersOnly}`;
    } else if (numbersOnly.length <= 6) {
      return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2)}`;
    } else if (numbersOnly.length <= 10) {
      return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2, 6)}-${numbersOnly.slice(6)}`;
    } else {
      return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2, 7)}-${numbersOnly.slice(7, 11)}`;
    }
  };
  
  // Handle phone input changes with formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    form.setValue('phone', formatted);
  };
  
  useEffect(() => {
    // Update form with booking data if available
    if (bookingData.clientName) {
      form.setValue('name', bookingData.clientName);
    }
    if (bookingData.clientEmail) {
      form.setValue('email', bookingData.clientEmail);
    }
    if (bookingData.clientPhone) {
      form.setValue('phone', bookingData.clientPhone);
    }
    if (bookingData.notes) {
      form.setValue('notes', bookingData.notes);
    }
  }, [bookingData, form]);
  
  const handleEmailBlur = async () => {
    const email = form.getValues("email");
    
    if (email && !clientChecked && email.includes('@')) {
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
        try {
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
              notes: data.notes || ""
            });
          } else {
            // If client creation fails, just store the data without client ID
            updateBookingData({
              clientName: data.name,
              clientEmail: data.email,
              clientPhone: data.phone,
              notes: data.notes || ""
            });
          }
        } catch (error) {
          console.error("Error creating client:", error);
          // In case of error, just store the data without creating client
          updateBookingData({
            clientName: data.name,
            clientEmail: data.email,
            clientPhone: data.phone,
            notes: data.notes || ""
          });
        }
      } else {
        // Just update the booking data with form values
        updateBookingData({
          clientName: data.name,
          clientEmail: data.email,
          clientPhone: data.phone,
          notes: data.notes || ""
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
                    <Input 
                      {...field} 
                      placeholder="(00) 00000-0000" 
                      onChange={handlePhoneChange}
                    />
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
