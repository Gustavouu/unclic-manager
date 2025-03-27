
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StepWelcome } from "./steps/StepWelcome";
import { StepService } from "./steps/StepService";
import { StepProfessional } from "./steps/StepProfessional";
import { StepDateTime } from "./steps/StepDateTime";
import { StepPayment } from "./steps/StepPayment";
import { StepConfirmation } from "./steps/StepConfirmation";
import { ServiceData, StaffData } from "@/contexts/onboarding/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export type BookingData = {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  professionalId: string;
  professionalName: string;
  date: Date | undefined;
  time: string;
  notes: string;
}

interface WebsiteBookingFlowProps {
  services: ServiceData[];
  staff: StaffData[];
  businessName: string;
  closeFlow: () => void;
}

export function WebsiteBookingFlow({ 
  services, 
  staff, 
  businessName,
  closeFlow 
}: WebsiteBookingFlowProps) {
  const [step, setStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId: "",
    serviceName: "",
    servicePrice: 0,
    serviceDuration: 0,
    professionalId: "",
    professionalName: "",
    date: undefined,
    time: "",
    notes: ""
  });

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // Animation variants
  const variants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

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
            services={services} 
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <StepProfessional 
            staff={staff.filter(s => 
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

  const renderProgressBar = () => {
    const totalSteps = 5;
    const progress = (step / totalSteps) * 100;
    
    return (
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-6">
        <div 
          className="bg-primary h-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 mb-16 px-4">
      {step > 0 && (
        <div className="mb-6">
          {renderProgressBar()}
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={prevStep}
              className="flex items-center gap-2 text-muted-foreground"
              type="button"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <span className="text-sm text-muted-foreground">
              Passo {step} de 5
            </span>
          </div>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial="enter"
          animate="center"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.3 }}
          className="min-h-[400px]"
        >
          {getStepContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
