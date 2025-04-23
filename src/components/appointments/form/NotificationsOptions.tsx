import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";

export type NotificationsOptionsProps = {
  form: UseFormReturn<AppointmentFormValues>;
};

export const NotificationsOptions = ({ form }: NotificationsOptionsProps) => {
  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name="notifications.sendConfirmation"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md shadow-sm">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Enviar confirmação</FormLabel>
              <FormDescription>
                Envia uma confirmação por e-mail/SMS para o cliente após o agendamento.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="notifications.sendReminder"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md shadow-sm">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Enviar lembrete</FormLabel>
              <FormDescription>
                Envia um lembrete para o cliente algumas horas antes do agendamento.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}; 