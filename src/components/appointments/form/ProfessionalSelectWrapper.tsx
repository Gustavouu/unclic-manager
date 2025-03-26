
import { ProfessionalSelect } from "./ProfessionalSelect";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";

interface ProfessionalSelectWrapperProps {
  form: UseFormReturn<AppointmentFormValues>;
  serviceId: string;
}

const ProfessionalSelectWrapper = ({ form }: ProfessionalSelectWrapperProps) => {
  return (
    <ProfessionalSelect form={form} />
  );
};

export default ProfessionalSelectWrapper;
