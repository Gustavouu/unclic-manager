
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { CloseButton } from "./flow/CloseButton";
import { BookingProgress } from "./flow/BookingProgress";
import { StepContent } from "./flow/StepContent";
import { StepNavigator } from "./flow/StepNavigator";
import { StepIntro } from "./steps/StepIntro";
import { StepService } from "./steps/StepService";
import { StepProfessional } from "./steps/StepProfessional";
import { StepDateTime } from "./steps/StepDateTime";
import { StepClientInfo } from "./steps/StepClientInfo";
import { StepConfirmation } from "./steps/StepConfirmation";
import { BookingFlowProps } from "./types";
import { useBookingData } from "./hooks/useBookingData";
import { toast } from "sonner";

export function WebsiteBookingFlow({ 
  businessName,
  closeFlow,
  services = [],
  staff = []
}: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { bookingData, updateBookingData, resetBookingData } = useBookingData();
  
  const handleNextStep = () => {
    if (currentStep === 0 && !bookingData.serviceId) {
      toast.warning("Escolha um serviço para continuar");
      return;
    }
    
    if (currentStep === 1 && !bookingData.professionalId) {
      toast.warning("Escolha um profissional para continuar");
      return;
    }
    
    if (currentStep === 2 && (!bookingData.date || !bookingData.time)) {
      toast.warning("Escolha uma data e horário para continuar");
      return;
    }
    
    if (currentStep === 3 && (!bookingData.clientName || !bookingData.clientEmail)) {
      toast.warning("Preencha seus dados para continuar");
      return;
    }
    
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    window.scrollTo(0, 0);
  };
  
  const completeBooking = () => {
    // Reset booking data when completed
    resetBookingData();
    toast.success("Agendamento realizado com sucesso!");
    closeFlow();
  };
  
  const getStepTitle = () => {
    switch (currentStep) {
      case 0: return "Serviço";
      case 1: return "Profissional";
      case 2: return "Data e Horário";
      case 3: return "Seus dados";
      case 4: return "Confirmação";
      default: return "";
    }
  };
  
  // Safely transform services data for StepService component
  const transformedServices = services.map(service => ({
    id: service.id || "",
    name: service.name || service.nome || "",
    description: service.description || service.descricao || "",
    price: typeof service.price !== 'undefined' ? service.price : 
           typeof service.preco !== 'undefined' ? service.preco : 0,
    duration: typeof service.duration !== 'undefined' ? service.duration : 
              typeof service.duracao !== 'undefined' ? service.duracao : 30,
    category: service.category || "",
    isActive: service.isActive ?? service.ativo ?? true,
    active: service.isActive ?? service.ativo ?? true, // Add required property
  }));
  
  return (
    <div className="py-6 relative">
      <CloseButton onClick={closeFlow} />
      
      <div className="max-w-3xl mx-auto px-4 lg:px-0">
        <BookingProgress 
          currentStep={currentStep} 
          getStepTitle={getStepTitle} 
        />
        
        <StepContent step={currentStep}>
          {currentStep === 0 && (
            <StepService 
              bookingData={bookingData}
              updateBookingData={updateBookingData}
              nextStep={handleNextStep}
              services={transformedServices}
            />
          )}
          
          {currentStep === 1 && (
            <StepProfessional 
              bookingData={bookingData}
              updateBookingData={updateBookingData}
              nextStep={handleNextStep}
              staff={staff}
            />
          )}
          
          {currentStep === 2 && (
            <StepDateTime 
              bookingData={bookingData}
              updateBookingData={updateBookingData}
              nextStep={handleNextStep}
            />
          )}
          
          {currentStep === 3 && (
            <StepClientInfo 
              onNext={handleNextStep}
              onBack={handlePreviousStep}
              bookingData={bookingData}
              onUpdateBookingData={updateBookingData}
            />
          )}
          
          {currentStep === 4 && (
            <StepConfirmation 
              bookingData={bookingData}
              onComplete={completeBooking}
            />
          )}
        </StepContent>
      
        <StepNavigator 
          step={currentStep}
          onPrevious={handlePreviousStep}
          onNext={currentStep < 4 ? handleNextStep : undefined}
          bookingData={bookingData}
        />
      </div>
    </div>
  );
}
