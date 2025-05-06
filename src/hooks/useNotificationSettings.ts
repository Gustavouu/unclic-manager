
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from './useCurrentBusiness';

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  newAppointmentAlert: boolean;
  cancelAppointmentAlert: boolean;
  clientFeedbackAlert: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  messageTemplate: string;
}

const defaultSettings: NotificationSettings = {
  pushEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
  newAppointmentAlert: true,
  cancelAppointmentAlert: true,
  clientFeedbackAlert: true,
  quietHoursStart: '22',
  quietHoursEnd: '8',
  messageTemplate: 'Olá {cliente}, lembramos do seu agendamento em {data} às {hora}. Confirme com antecedência. Atenciosamente, {negócio}.'
};

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { businessId } = useCurrentBusiness();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!businessId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notification_settings')
          .select('*')
          .eq('id_negocio', businessId)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setSettings({
            pushEnabled: data.push_enabled,
            emailEnabled: data.email_enabled,
            smsEnabled: data.sms_enabled,
            newAppointmentAlert: data.new_appointment_alert,
            cancelAppointmentAlert: data.cancel_appointment_alert,
            clientFeedbackAlert: data.client_feedback_alert,
            quietHoursStart: data.quiet_hours_start,
            quietHoursEnd: data.quiet_hours_end,
            messageTemplate: data.message_template
          });
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
        toast.error('Não foi possível carregar as configurações de notificação');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [businessId]);

  const saveSettings = async (newSettings: NotificationSettings) => {
    if (!businessId) return false;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          id_negocio: businessId,
          push_enabled: newSettings.pushEnabled,
          email_enabled: newSettings.emailEnabled,
          sms_enabled: newSettings.smsEnabled,
          new_appointment_alert: newSettings.newAppointmentAlert,
          cancel_appointment_alert: newSettings.cancelAppointmentAlert,
          client_feedback_alert: newSettings.clientFeedbackAlert,
          quiet_hours_start: newSettings.quietHoursStart,
          quiet_hours_end: newSettings.quietHoursEnd,
          message_template: newSettings.messageTemplate,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id_negocio' });

      if (error) throw error;
      
      setSettings(newSettings);
      toast.success('Configurações de notificação salvas com sucesso!');
      return true;
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Não foi possível salvar as configurações de notificação');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    loading,
    saving,
    saveSettings
  };
};
