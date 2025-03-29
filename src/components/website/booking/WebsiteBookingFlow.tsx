
import { useState } from "react";
import { BookingFlowProps } from "./types";
import { useStepNavigation } from "./hooks/useStepNavigation";
import { useBookingData } from "./hooks/useBookingData";
import { StepContent } from "./flow/StepContent";
import { BookingProgress } from "./flow/BookingProgress";
import { StepNavigator } from "./flow/StepNavigator";
import { CloseButton } from "./flow/CloseButton";

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

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col min-h-[calc(100vh-2rem)] md:min-h-[600px]">
      <div className="relative h-16 bg-primary flex items-center justify-center text-white">
        <h2 className="text-xl font-semibold">{getStepTitle() || businessName}</h2>
        <CloseButton onClose={closeFlow} />
      </div>

      <div className="flex-1 flex flex-col">
        {step > 0 && !isCompleted && (
          <BookingProgress currentStep={step} />
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
          />
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
