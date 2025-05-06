
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
            pushEnabled: data.push_enabled ?? defaultSettings.pushEnabled,
            emailEnabled: data.email_enabled ?? defaultSettings.emailEnabled,
            smsEnabled: data.sms_enabled ?? defaultSettings.smsEnabled,
            newAppointmentAlert: data.new_appointment_alert ?? defaultSettings.newAppointmentAlert,
            cancelAppointmentAlert: data.cancel_appointment_alert ?? defaultSettings.cancelAppointmentAlert,
            clientFeedbackAlert: data.client_feedback_alert ?? defaultSettings.clientFeedbackAlert,
            quietHoursStart: data.quiet_hours_start ?? defaultSettings.quietHoursStart,
            quietHoursEnd: data.quiet_hours_end ?? defaultSettings.quietHoursEnd,
            messageTemplate: data.message_template ?? defaultSettings.messageTemplate
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

  const saveSettings = async (newSettings: Partial<NotificationSettings>) => {
    if (!businessId) return false;
    
    // Ensure all required properties are present by merging with current settings
    const completeSettings: NotificationSettings = {
      ...settings,
      ...newSettings
    };
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          id_negocio: businessId,
          push_enabled: completeSettings.pushEnabled,
          email_enabled: completeSettings.emailEnabled,
          sms_enabled: completeSettings.smsEnabled,
          new_appointment_alert: completeSettings.newAppointmentAlert,
          cancel_appointment_alert: completeSettings.cancelAppointmentAlert,
          client_feedback_alert: completeSettings.clientFeedbackAlert,
          quiet_hours_start: completeSettings.quietHoursStart,
          quiet_hours_end: completeSettings.quietHoursEnd,
          message_template: completeSettings.messageTemplate,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id_negocio' });

      if (error) throw error;
      
      setSettings(completeSettings);
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
