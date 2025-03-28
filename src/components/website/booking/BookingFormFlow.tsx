
import { useState } from "react";
import { PhoneVerificationStep } from "./steps/PhoneVerificationStep";
import { NewClientForm } from "./steps/NewClientForm";
import { PaymentRequiredAppointmentForm } from "@/components/appointments/form/PaymentRequiredAppointmentForm";
import { Card, CardContent } from "@/components/ui/card";

interface BookingFormFlowProps {
  onComplete?: () => void;
}

export function BookingFormFlow({ onComplete }: BookingFormFlowProps) {
  const [step, setStep] = useState<"phone" | "new-client" | "appointment">("phone");
  const [clientData, setClientData] = useState<{
    id: string;
    name: string;
    phone?: string;
  } | null>(null);

  const handleClientFound = (clientId: string, clientName: string) => {
    setClientData({ id: clientId, name: clientName });
    setStep("appointment");
  };

  const handleNewClient = (phone: string) => {
    setClientData({ id: "", name: "", phone });
    setStep("new-client");
  };

  const handleClientCreated = (clientId: string, clientName: string) => {
    setClientData({ id: clientId, name: clientName });
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
            onClientCreated={handleClientCreated}
            onBack={handleBack}
          />
        )}
        
        {step === "appointment" && clientData?.id && (
          <PaymentRequiredAppointmentForm
            customerId={clientData.id}
            onSuccess={handleBookingComplete}
          />
        )}
      </CardContent>
    </Card>
  );
}
