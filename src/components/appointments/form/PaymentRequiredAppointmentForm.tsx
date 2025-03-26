
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentFormSchema, AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { useState } from "react";
import { PaymentDialog } from "@/components/payment/PaymentDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Import form component wrappers that handle the service select props correctly
import ServiceSelectWrapper from "./ServiceSelectWrapper";
import ProfessionalSelectWrapper from "./ProfessionalSelectWrapper";
import ClientSelectWrapper from "./ClientSelectWrapper";
import { DateTimeSelect } from "./DateTimeSelect";
import { NotesField } from "./NotesField";

interface PaymentRequiredAppointmentFormProps {
  onSuccess?: () => void;
  customerId: string;
}

export function PaymentRequiredAppointmentForm({ onSuccess, customerId }: PaymentRequiredAppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [formData, setFormData] = useState<{
    serviceId: string;
    serviceName: string;
    appointmentDate: string;
    amount: number;
  } | null>(null);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      serviceId: "",
      professionalId: "",
      clientId: customerId, // Pre-fill with customer ID
      date: undefined,
      time: "",
      notes: "",
    },
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    setIsSubmitting(true);
    try {
      // Get service details for the payment
      const { data: serviceData, error: serviceError } = await supabase
        .from('servicos')
        .select('id, nome, preco')
        .eq('id', data.serviceId)
        .single();

      if (serviceError) throw serviceError;

      // Format date for display
      const formattedDate = data.date 
        ? format(new Date(data.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
        : "";

      // Store the form data and service details
      setFormData({
        serviceId: serviceData.id,
        serviceName: serviceData.nome,
        appointmentDate: formattedDate,
        amount: serviceData.preco,
      });

      // Show payment dialog
      setShowPaymentDialog(true);
    } catch (error) {
      console.error("Erro ao obter detalhes do serviço:", error);
      toast.error("Erro ao processar o agendamento. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Reset the form after successful payment and appointment creation
    form.reset();
    
    // Close payment dialog
    setShowPaymentDialog(false);
    
    // Call the onSuccess callback if provided
    if (onSuccess) onSuccess();
    
    toast.success("Agendamento confirmado com sucesso!");
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6 space-y-4">
          <div className="grid gap-6 sm:grid-cols-2">
            <ServiceSelectWrapper form={form} />
            <ProfessionalSelectWrapper form={form} serviceId={form.watch("serviceId")} />
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <ClientSelectWrapper form={form} disabled={!!customerId} />
            <DateTimeSelect form={form} />
          </div>
          
          <NotesField form={form} />
          
          <Button 
            type="submit" 
            className="w-full mt-4" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processando..." : "Prosseguir para Pagamento"}
          </Button>
        </Card>
      </form>

      {formData && (
        <PaymentDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          onSuccess={handlePaymentSuccess}
          serviceId={formData.serviceId}
          serviceName={formData.serviceName}
          amount={formData.amount}
          appointmentDate={formData.appointmentDate}
          customerId={customerId}
        />
      )}
    </>
  );
}
