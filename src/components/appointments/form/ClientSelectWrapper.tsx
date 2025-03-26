
import { ClientSelect } from "./ClientSelect";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";

interface ClientSelectWrapperProps {
  form: UseFormReturn<AppointmentFormValues>;
  disabled?: boolean;
}

const ClientSelectWrapper = ({ form, disabled = false }: ClientSelectWrapperProps) => {
  return (
    <ClientSelect form={form} />
  );
};

export default ClientSelectWrapper;
