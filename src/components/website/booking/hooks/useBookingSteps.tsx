
import { useState } from "react";
import { BookingData } from "../types";

export function useBookingSteps() {
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
  const prevStep = () => setStep(prev => Math.max(0, prev - 1));

  const getStepTitle = () => {
    switch (step) {
      case 0: return "";
      case 1: return "Escolha do Serviço";
      case 2: return "Escolha do Profissional";
      case 3: return "Data e Hora";
      case 4: return "Pagamento";
      case 5: return "Confirmação";
      default: return "";
    }
  };

  return {
    step,
    bookingData,
    updateBookingData,
    nextStep,
    prevStep,
    getStepTitle
  };
}
