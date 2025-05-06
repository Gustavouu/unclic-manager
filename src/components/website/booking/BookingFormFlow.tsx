import { useState } from "react";
import { PhoneVerificationStep } from "./steps/PhoneVerificationStep";
import { NewClientForm } from "./steps/NewClientForm";
import { PaymentRequiredAppointmentForm } from "@/components/appointments/form/PaymentRequiredAppointmentForm";
import { Card, CardContent } from "@/components/ui/card";
import { ClientData } from "./types";
import { supabase } from "@/integrations/supabase/client"; // Updated import path

interface BookingFormFlowProps {
  onComplete?: () => void;
}

export function BookingFormFlow({ onComplete }: BookingFormFlowProps) {
  const [step, setStep] = useState<"phone" | "new-client" | "appointment">("phone");
  const [clientData, setClientData] = useState<ClientData | null>(null);
  
  // Mock data for the demo
  const mockServices = [
    {
      id: "1",
      nome: "Corte de Cabelo",
      descricao: "Corte moderno com finalização",
      duracao: 60,
      preco: 80,
      ativo: true
    },
    {
      id: "2",
      nome: "Manicure",
      descricao: "Cuidados completos para unhas",
      duracao: 45,
      preco: 50,
      ativo: true
    }
  ];
  
  const mockStaff = [
    {
      id: "1",
      nome: "Ana Silva",
      cargo: "Cabeleireira",
      especializacoes: ["Cortes femininos", "Coloração"],
      foto_url: "https://i.pravatar.cc/150?img=5",
      bio: "Especialista em cortes modernos"
    },
    {
      id: "2",
      nome: "João Santos",
      cargo: "Manicure",
      especializacoes: ["Unhas em gel", "Nail art"],
      foto_url: "https://i.pravatar.cc/150?img=12",
      bio: "5 anos de experiência em nail art"
    }
  ];

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

  const handleClientCreated = (clientData: any) => {
    // In a real app, we would create the client in the database here
    // and get back the client ID
    const mockClientId = "new-client-" + Date.now();
    
    setClientData({ 
      id: mockClientId, 
      name: `${clientData.firstName} ${clientData.lastName}`,
      email: clientData.email,
      phone: clientData.phone
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
            onComplete={handleClientCreated}
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
            availableServices={mockServices}
            availableStaff={mockStaff}
          />
        )}
      </CardContent>
    </Card>
  );
}
