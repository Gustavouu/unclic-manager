
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StepNavigatorProps } from "../types";

export function StepNavigator({ step, onPrevious, onNext, bookingData }: StepNavigatorProps) {
  const isFirstStep = step === 0;
  const isLastStep = step === 4;
  
  const isStepComplete = () => {
    switch (step) {
      case 0: 
        return !!bookingData.serviceId;
      case 1:
        return !!bookingData.professionalId;
      case 2:
        return !!bookingData.date && !!bookingData.time;
      case 3:
        return !!bookingData.clientName && !!bookingData.clientEmail;
      default:
        return true;
    }
  };
  
  return (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className={isFirstStep ? "invisible" : ""}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      
      {!isLastStep && onNext && (
        <Button 
          onClick={onNext}
          disabled={!isStepComplete()}
        >
          Avançar
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
