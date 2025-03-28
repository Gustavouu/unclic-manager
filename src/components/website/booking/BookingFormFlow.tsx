
import { useState, useEffect } from "react";
import { PhoneVerificationStep } from "./steps/PhoneVerificationStep";
import { NewClientForm } from "./steps/NewClientForm";
import { PaymentRequiredAppointmentForm } from "@/components/appointments/form/PaymentRequiredAppointmentForm";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ClientData } from "./types";
import { Loader2 } from "lucide-react";

interface BookingFormFlowProps {
  onComplete?: () => void;
}

export function BookingFormFlow({ onComplete }: BookingFormFlowProps) {
  const [step, setStep] = useState<"phone" | "new-client" | "appointment">("phone");
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  // Fetch services and staff on component mount
  useEffect(() => {
    const fetchServicesAndStaff = async () => {
      setIsLoadingServices(true);
      setIsLoadingStaff(true);
      
      try {
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('servicos')
          .select('id, nome, descricao, duracao, preco, ativo')
          .eq('ativo', true);
        
        if (servicesError) throw servicesError;
        
        setServices(servicesData || []);
        
        // Fetch staff
        const { data: staffData, error: staffError } = await supabase
          .from('funcionarios')
          .select('id, nome, cargo, especializacoes, foto_url, bio')
          .eq('status', 'ativo');
        
        if (staffError) throw staffError;
        
        setStaff(staffData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingServices(false);
        setIsLoadingStaff(false);
      }
    };
    
    fetchServicesAndStaff();
  }, []);

  const handleClientFound = (clientId: string, clientName: string, clientEmail?: string, clientPhone?: string) => {
    setClientData({ 
      id: clientId, 
      name: clientName,
      email: clientEmail,
      phone: clientPhone 
    });
    setStep("appointment");
  };

  const handleNewClient = (phone: string) => {
    setClientData({ id: "", name: "", phone });
    setStep("new-client");
  };

  const handleClientCreated = (clientId: string, clientName: string, clientEmail?: string, clientPhone?: string) => {
    setClientData({ 
      id: clientId, 
      name: clientName,
      email: clientEmail,
      phone: clientPhone
    });
    setStep("appointment");
  };

  const handleBack = () => {
    setStep("phone");
  };

  const handleBookingComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  // Loading state while fetching data
  if (isLoadingServices || isLoadingStaff) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Carregando dados para agendamento...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-6">
        {step === "phone" && (
          <PhoneVerificationStep 
            onClientFound={handleClientFound} 
            onNewClient={handleNewClient} 
          />
        )}
        
        {step === "new-client" && clientData?.phone && (
          <NewClientForm
            phone={clientData.phone}
            onClientCreated={handleClientCreated}
            onBack={handleBack}
          />
        )}
        
        {step === "appointment" && clientData?.id && (
          <PaymentRequiredAppointmentForm
            customerId={clientData.id}
            customerName={clientData.name}
            customerEmail={clientData.email}
            customerPhone={clientData.phone}
            onSuccess={handleBookingComplete}
            availableServices={services}
            availableStaff={staff}
          />
        )}
      </CardContent>
    </Card>
  );
}
