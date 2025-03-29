
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

export function WebsiteBookingFlow({ 
  businessName,
  closeFlow,
  services = [],
  staff = []
}: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { bookingData, updateBookingData } = useBookingData();
  
  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    window.scrollTo(0, 0);
  };
  
  const completeBooking = () => {
    closeFlow();
  };
  
  const getStepTitle = () => {
    switch (currentStep) {
      case 0: return "Bem-vindo";
      case 1: return "Escolha o serviço";
      case 2: return "Escolha o profissional";
      case 3: return "Escolha data e horário";
      case 4: return "Seus dados";
      case 5: return "Confirmação";
      default: return "";
    }
  };
  
  return (
    <div className="py-6 relative">
      <CloseButton onClick={closeFlow} />
      
      <div className="max-w-3xl mx-auto px-4 lg:px-0">
        <BookingProgress 
          currentStep={currentStep} 
          getStepTitle={() => getStepTitle()} 
        />
        
        <StepContent step={currentStep}>
          {currentStep === 0 && (
            <StepIntro 
              businessName={businessName}
              nextStep={handleNextStep}
            />
          )}
          
          {currentStep === 1 && (
            <StepService 
              bookingData={bookingData}
              updateBookingData={updateBookingData}
              nextStep={handleNextStep}
              services={services}
            />
          )}
          
          {currentStep === 2 && (
            <StepProfessional 
              bookingData={bookingData}
              updateBookingData={updateBookingData}
              nextStep={handleNextStep}
              staff={staff}
            />
          )}
          
          {currentStep === 3 && (
            <StepDateTime 
              bookingData={bookingData}
              updateBookingData={updateBookingData}
              nextStep={handleNextStep}
            />
          )}
          
          {currentStep === 4 && (
            <StepClientInfo 
              bookingData={bookingData}
              updateBookingData={updateBookingData}
              nextStep={handleNextStep}
            />
          )}
          
          {currentStep === 5 && (
            <StepConfirmation 
              bookingData={bookingData}
              onComplete={completeBooking}
            />
          )}
        </StepContent>
      
        <StepNavigator 
          step={currentStep}
          onPrevious={handlePreviousStep}
        />
      </div>
    </div>
  );
}
