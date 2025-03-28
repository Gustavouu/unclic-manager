
import { useStepNavigation } from "./useStepNavigation";
import { useBookingData } from "./useBookingData";

export function useBookingSteps() {
  const { step, nextStep, prevStep, getStepTitle } = useStepNavigation();
  const { bookingData, updateBookingData } = useBookingData();

  return {
    step,
    bookingData,
    updateBookingData,
    nextStep,
    prevStep,
    getStepTitle
  };
}
