
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

type NotificationOptionsProps = {
  businessId: string;
};

type NotificationSettings = {
  email_enabled: boolean;
  sms_enabled: boolean;
};

const NotificationOptions = ({ businessId }: NotificationOptionsProps) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    email_enabled: true,
    sms_enabled: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!businessId) return;
      
      setLoading(true);
      try {
        // Try to get from notification_settings table first
        let { data, error } = await supabase
          .from('business_settings')
          .select('*')
          .eq('business_id', businessId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching notification settings:', error);
          return;
        }

        if (data) {
          // If we have business settings, check for notification settings in notes
          try {
            if (data.notes) {
              const notesObj = typeof data.notes === 'string' 
                ? JSON.parse(data.notes) 
                : data.notes;
              
              if (notesObj && notesObj.notification_settings) {
                setSettings({
                  email_enabled: notesObj.notification_settings.email_enabled ?? true,
                  sms_enabled: notesObj.notification_settings.sms_enabled ?? false
                });
                return;
              }
            }
          } catch (parseError) {
            console.error('Error parsing notification settings:', parseError);
          }
        }

        // If we get here, we didn't find settings, try fallback table
        ({ data, error } = await supabase
          .from('notification_settings')
          .select('*')
          .eq('id_negocio', businessId)
          .maybeSingle());

        if (error) {
          console.error('Error fetching legacy notification settings:', error);
          return;
        }

        if (data) {
          setSettings({
            email_enabled: data.email_enabled,
            sms_enabled: data.sms_enabled
          });
        }
      } catch (err) {
        console.error('Error in notification settings fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [businessId]);

  const handleChange = async (setting: 'email_enabled' | 'sms_enabled', value: boolean) => {
    // Update UI first for faster response
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));

    try {
      // First try to update notification_settings table
      const { error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('business_id', businessId)
        .maybeSingle();
      
      if (error) {
        // If business_settings doesn't exist, try updating the legacy table
        const { error: legacyError } = await supabase
          .from('notification_settings')
          .upsert({
            id_negocio: businessId,
            [setting]: value
          }, { onConflict: 'id_negocio' });
          
        if (legacyError) {
          console.error('Failed to update notification settings:', legacyError);
          // Revert UI change on error
          setSettings(prev => ({
            ...prev,
            [setting]: !value
          }));
        }
      } else {
        // Business settings exists, update the notes field
        const notificationSettings = {
          notification_settings: {
            ...settings,
            [setting]: value
          }
        };
        
        const { error: updateError } = await supabase
          .from('business_settings')
          .update({
            notes: JSON.stringify(notificationSettings)
          })
          .eq('business_id', businessId);
          
        if (updateError) {
          console.error('Failed to update notification settings:', updateError);
          // Revert UI change on error
          setSettings(prev => ({
            ...prev,
            [setting]: !value
          }));
        }
      }
    } catch (err) {
      console.error('Error updating notification settings:', err);
      // Revert UI change on error
      setSettings(prev => ({
        ...prev,
        [setting]: !value
      }));
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="email-notifications"
            checked={settings.email_enabled}
            onCheckedChange={(checked) => handleChange('email_enabled', checked as boolean)}
            disabled={loading}
          />
          <Label htmlFor="email-notifications">Notificações por Email</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sms-notifications"
            checked={settings.sms_enabled}
            onCheckedChange={(checked) => handleChange('sms_enabled', checked as boolean)}
            disabled={loading}
          />
          <Label htmlFor="sms-notifications">Notificações por SMS</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationOptions;
