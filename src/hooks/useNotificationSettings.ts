
import { useState, useEffect } from 'react';
import { useTenant } from '@/contexts/TenantContext';

interface NotificationSettings {
  push_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  new_appointment_alert: boolean;
  cancel_appointment_alert: boolean;
  client_feedback_alert: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  message_template: string;
}

const defaultSettings: NotificationSettings = {
  push_enabled: true,
  email_enabled: true,
  sms_enabled: false,
  new_appointment_alert: true,
  cancel_appointment_alert: true,
  client_feedback_alert: true,
  quiet_hours_start: '22:00',
  quiet_hours_end: '08:00',
  message_template: 'Olá {cliente}, seu agendamento está confirmado para {data} às {hora}.'
};

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useTenant();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!businessId) return;
      
      setLoading(true);
      try {
        // Since notification_settings table doesn't exist in the schema,
        // we'll use default settings for now
        setSettings(defaultSettings);
      } catch (err: any) {
        console.error('Error fetching notification settings:', err);
        setError(err.message || 'Failed to fetch notification settings');
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [businessId]);

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    setLoading(true);
    try {
      // Since notification_settings table doesn't exist in the schema,
      // we'll just update local state for now
      setSettings(prev => ({ ...prev, ...newSettings }));
      console.log('Notification settings updated:', newSettings);
    } catch (err: any) {
      console.error('Error updating notification settings:', err);
      setError(err.message || 'Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    updateSettings,
    loading,
    error
  };
};
