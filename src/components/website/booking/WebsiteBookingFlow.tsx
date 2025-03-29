
import { useState } from "react";
import { BookingFlowProps } from "./types";
import { useStepNavigation } from "./hooks/useStepNavigation";
import { useBookingData } from "./hooks/useBookingData";
import { StepContent } from "./flow/StepContent";
import { BookingProgress } from "./flow/BookingProgress";
import { StepNavigator } from "./flow/StepNavigator";
import { CloseButton } from "./flow/CloseButton";
import { StepService } from "./steps/StepService";
import { StepProfessional } from "./steps/StepProfessional";
import { StepDateTime } from "./steps/StepDateTime";
import { StepPayment } from "./steps/StepPayment";
import { StepConfirmation } from "./steps/StepConfirmation";
import { StepWelcome } from "./steps/StepWelcome";

export function WebsiteBookingFlow({ businessName, closeFlow, services = [], staff = [] }: BookingFlowProps) {
  const { step, nextStep, prevStep, setStep, getStepTitle } = useStepNavigation();
  const { bookingData, updateBookingData } = useBookingData();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => {
      closeFlow();
    }, 5000); // Close after 5 seconds
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <StepWelcome nextStep={nextStep} />;
      case 1:
        return (
          <StepService
            services={services}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <StepProfessional
            staff={staff}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            nextStep={nextStep}
          />
        );
      case 3:
        return (
          <StepDateTime
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            nextStep={nextStep}
          />
        );
      case 4:
        return (
          <StepPayment
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            nextStep={nextStep}
          />
        );
      case 5:
        return (
          <StepConfirmation
            bookingData={bookingData}
            businessName={businessName}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col min-h-[calc(100vh-2rem)] md:min-h-[600px]">
      <div className="relative h-16 bg-primary flex items-center justify-center text-white">
        <h2 className="text-xl font-semibold">{getStepTitle() || businessName}</h2>
        <CloseButton onClick={closeFlow} />
      </div>

      <div className="flex-1 flex flex-col">
        {step > 0 && !isCompleted && (
          <BookingProgress currentStep={step} getStepTitle={getStepTitle} />
        )}

        <div className="flex-1 p-6 overflow-y-auto">
          <StepContent
            step={step}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            services={services}
            staff={staff}
            onComplete={handleComplete}
            businessName={businessName}
          >
            {renderStepContent()}
          </StepContent>
        </div>

        {!isCompleted && step > 0 && step < 5 && (
          <StepNavigator 
            step={step}
            onNext={nextStep}
            onPrevious={prevStep}
            bookingData={bookingData}
          />
        )}
      </div>
    </div>
  );
}
