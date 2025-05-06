
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentFormSchema";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

export type NotificationsOptionsProps = {
  form: UseFormReturn<AppointmentFormValues>;
};

export const NotificationsOptions = ({ form }: NotificationsOptionsProps) => {
  const [notificationsDisabled, setNotificationsDisabled] = useState(false);
  const { businessId } = useCurrentBusiness();

  useEffect(() => {
    const checkNotificationSettings = async () => {
      if (!businessId) return;
      
      try {
        const { data, error } = await supabase
          .from('notification_settings')
          .select('email_enabled, sms_enabled')
          .eq('id_negocio', businessId)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setNotificationsDisabled(!data.email_enabled && !data.sms_enabled);
        }
      } catch (error) {
        console.error('Error checking notification settings:', error);
      }
    };
    
    checkNotificationSettings();
  }, [businessId]);

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        {notificationsDisabled && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              As notificações por email e SMS estão desativadas nas configurações. O cliente não receberá notificações mesmo que estas opções estejam marcadas.
            </AlertDescription>
          </Alert>
        )}
        
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
                  disabled={notificationsDisabled}
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
                  disabled={notificationsDisabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
