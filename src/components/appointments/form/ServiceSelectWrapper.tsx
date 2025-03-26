
import { ServiceSelect } from "./ServiceSelect";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";

interface ServiceSelectWrapperProps {
  form: UseFormReturn<AppointmentFormValues>;
}

const ServiceSelectWrapper = ({ form }: ServiceSelectWrapperProps) => {
  const [selectedService, setSelectedService] = useState<any>(null);
  
  return (
    <ServiceSelect 
      form={form} 
      selectedService={selectedService} 
      setSelectedService={setSelectedService} 
    />
  );
};

export default ServiceSelectWrapper;
