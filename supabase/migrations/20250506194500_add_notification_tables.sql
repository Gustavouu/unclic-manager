
-- Create table for notification settings
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_negocio UUID NOT NULL REFERENCES negocios(id) UNIQUE,
  push_enabled BOOLEAN NOT NULL DEFAULT true,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  sms_enabled BOOLEAN NOT NULL DEFAULT false,
  new_appointment_alert BOOLEAN NOT NULL DEFAULT true,
  cancel_appointment_alert BOOLEAN NOT NULL DEFAULT true,
  client_feedback_alert BOOLEAN NOT NULL DEFAULT true,
  quiet_hours_start TEXT NOT NULL DEFAULT '22',
  quiet_hours_end TEXT NOT NULL DEFAULT '8',
  message_template TEXT NOT NULL DEFAULT 'Olá {cliente}, lembramos do seu agendamento em {data} às {hora}. Confirme com antecedência. Atenciosamente, {negócio}.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notification logs table for audit trail
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_negocio UUID NOT NULL REFERENCES negocios(id),
  tipo TEXT NOT NULL, -- 'email', 'sms', 'push'
  evento TEXT NOT NULL, -- 'appointment_created', 'appointment_reminder', etc.
  destinatario TEXT, -- email or phone number
  mensagem TEXT NOT NULL,
  data_envio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL -- 'enviado', 'falha'
);

-- Add lembrete_enviado field to agendamentos table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'agendamentos' AND column_name = 'lembrete_enviado') THEN
        ALTER TABLE agendamentos ADD COLUMN lembrete_enviado BOOLEAN DEFAULT false;
    END IF;
END$$;

-- Add RLS policies for notification settings
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notification settings for their business"
ON notification_settings FOR SELECT
USING (auth.uid() IN (
    SELECT u.id FROM usuarios u
    WHERE u.id_negocio = notification_settings.id_negocio
));

CREATE POLICY "Admins can update notification settings"
ON notification_settings FOR UPDATE
USING (auth.uid() IN (
    SELECT u.id FROM usuarios u
    JOIN perfis_acesso p ON u.id = p.id_usuario
    WHERE u.id_negocio = notification_settings.id_negocio
    AND (p.e_administrador = true OR p.acesso_configuracoes = true)
));

CREATE POLICY "Admins can insert notification settings"
ON notification_settings FOR INSERT
WITH CHECK (auth.uid() IN (
    SELECT u.id FROM usuarios u
    JOIN perfis_acesso p ON u.id = p.id_usuario
    WHERE u.id_negocio = NEW.id_negocio
    AND (p.e_administrador = true OR p.acesso_configuracoes = true)
));

-- Add RLS policies for notification logs
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notification logs for their business"
ON notification_logs FOR SELECT
USING (auth.uid() IN (
    SELECT u.id FROM usuarios u
    WHERE u.id_negocio = notification_logs.id_negocio
));

CREATE POLICY "System can insert notification logs"
ON notification_logs FOR INSERT
WITH CHECK (true);

-- Create or replace function to update updated_at column
CREATE OR REPLACE FUNCTION update_notification_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at column
CREATE TRIGGER set_notification_settings_updated_at
BEFORE UPDATE ON notification_settings
FOR EACH ROW
EXECUTE FUNCTION update_notification_settings_updated_at();
