
import { StepWelcome } from "./steps/StepWelcome";
import { StepService } from "./steps/StepService";
import { StepProfessional } from "./steps/StepProfessional";
import { StepDateTime } from "./steps/StepDateTime";
import { StepPayment } from "./steps/StepPayment";
import { StepConfirmation } from "./steps/StepConfirmation";
import { BookingFlowProps, ExtendedServiceData, ExtendedStaffData } from "./types";
import { BookingProgress } from "./flow/BookingProgress";
import { StepNavigator } from "./flow/StepNavigator";
import { StepContent } from "./flow/StepContent";
import { CloseButton } from "./flow/CloseButton";
import { useBookingSteps } from "./hooks/useBookingSteps";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { v4 as uuidv4 } from "uuid";

export function WebsiteBookingFlow({ 
  services, 
  staff, 
  businessName,
  closeFlow 
}: BookingFlowProps) {
  const {
    step,
    bookingData,
    updateBookingData,
    nextStep,
    prevStep,
    getStepTitle
  } = useBookingSteps();

  // Get the appointments hook for use in the payment step
  const { createAppointment } = useAppointments();

  // Cast services and staff to extended types for use in child components
  const extendedServices = services as ExtendedServiceData[];
  const extendedStaff = staff as ExtendedStaffData[];

  const getStepContent = () => {
    switch (step) {
      case 0:
        return (
          <StepWelcome 
            businessName={businessName} 
            nextStep={nextStep} 
          />
        );
      case 1:
        return (
          <StepService 
            services={extendedServices} 
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <StepProfessional 
            staff={extendedStaff.filter(s => 
              !bookingData.serviceId || 
              !s.specialties?.length || 
              s.specialties.includes(bookingData.serviceName)
            )}
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
            nextStep={nextStep}
            createAppointment={createAppointment}
          />
        );
      case 5:
        return (
          <StepConfirmation 
            bookingData={bookingData}
            businessName={businessName}
            closeFlow={closeFlow}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 mb-16 px-4 bg-white rounded-xl shadow-lg p-6 relative">
      <CloseButton onClick={closeFlow} />
      <StepNavigator step={step} prevStep={prevStep} />

      <BookingProgress step={step} getStepTitle={getStepTitle} />
      
      <StepContent step={step}>
        {getStepContent()}
      </StepContent>
    </div>
  );
}
