-- Criar tabelas
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  working_hours JSONB NOT NULL DEFAULT '{
    "monday": {"start": "09:00", "end": "18:00", "is_working_day": true},
    "tuesday": {"start": "09:00", "end": "18:00", "is_working_day": true},
    "wednesday": {"start": "09:00", "end": "18:00", "is_working_day": true},
    "thursday": {"start": "09:00", "end": "18:00", "is_working_day": true},
    "friday": {"start": "09:00", "end": "18:00", "is_working_day": true},
    "saturday": {"start": "09:00", "end": "13:00", "is_working_day": false},
    "sunday": {"start": "09:00", "end": "13:00", "is_working_day": false}
  }',
  appointment_duration INTEGER NOT NULL DEFAULT 60,
  break_duration INTEGER NOT NULL DEFAULT 15,
  max_appointments_per_day INTEGER NOT NULL DEFAULT 8,
  allow_same_day_appointments BOOLEAN NOT NULL DEFAULT true,
  allow_weekend_appointments BOOLEAN NOT NULL DEFAULT false,
  notification_settings JSONB NOT NULL DEFAULT '{
    "email_notifications": true,
    "sms_notifications": false,
    "reminder_before": 60
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'professional', 'receptionist')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  birth_date DATE,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  color TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialties TEXT[],
  bio TEXT,
  photo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS professional_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_working_day BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_businesses_email ON businesses(email);
CREATE INDEX IF NOT EXISTS idx_business_settings_business_id ON business_settings(business_id);
CREATE INDEX IF NOT EXISTS idx_users_business_id ON users(business_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_clients_business_id ON clients(business_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_services_business_id ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_professionals_business_id ON professionals(business_id);
CREATE INDEX IF NOT EXISTS idx_professionals_user_id ON professionals(user_id);
CREATE INDEX IF NOT EXISTS idx_professional_schedules_professional_id ON professional_schedules(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_business_id ON appointments(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_professional_id ON appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Criar funções
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_business_settings_updated_at
  BEFORE UPDATE ON business_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_professionals_updated_at
  BEFORE UPDATE ON professionals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_professional_schedules_updated_at
  BEFORE UPDATE ON professional_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Criar políticas RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Políticas para businesses
CREATE POLICY "Businesses are viewable by authenticated users"
  ON businesses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Businesses are insertable by authenticated users"
  ON businesses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Businesses are updatable by business owners"
  ON businesses FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = id AND role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM users WHERE business_id = id AND role = 'admin'));

CREATE POLICY "Businesses are deletable by business owners"
  ON businesses FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = id AND role = 'admin'));

-- Políticas para business_settings
CREATE POLICY "Business settings are viewable by business users"
  ON business_settings FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = business_settings.business_id));

CREATE POLICY "Business settings are insertable by business owners"
  ON business_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT user_id FROM users WHERE business_id = business_settings.business_id AND role = 'admin'));

CREATE POLICY "Business settings are updatable by business owners"
  ON business_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = business_settings.business_id AND role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM users WHERE business_id = business_settings.business_id AND role = 'admin'));

CREATE POLICY "Business settings are deletable by business owners"
  ON business_settings FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = business_settings.business_id AND role = 'admin'));

-- Políticas para users
CREATE POLICY "Users are viewable by business users"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = users.business_id));

CREATE POLICY "Users are insertable by business owners"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT user_id FROM users WHERE business_id = users.business_id AND role = 'admin'));

CREATE POLICY "Users are updatable by business owners"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = users.business_id AND role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM users WHERE business_id = users.business_id AND role = 'admin'));

CREATE POLICY "Users are deletable by business owners"
  ON users FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = users.business_id AND role = 'admin'));

-- Políticas para clients
CREATE POLICY "Clients are viewable by business users"
  ON clients FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = clients.business_id));

CREATE POLICY "Clients are insertable by business users"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT user_id FROM users WHERE business_id = clients.business_id));

CREATE POLICY "Clients are updatable by business users"
  ON clients FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = clients.business_id))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM users WHERE business_id = clients.business_id));

CREATE POLICY "Clients are deletable by business users"
  ON clients FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = clients.business_id));

-- Políticas para services
CREATE POLICY "Services are viewable by business users"
  ON services FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = services.business_id));

CREATE POLICY "Services are insertable by business users"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT user_id FROM users WHERE business_id = services.business_id));

CREATE POLICY "Services are updatable by business users"
  ON services FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = services.business_id))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM users WHERE business_id = services.business_id));

CREATE POLICY "Services are deletable by business users"
  ON services FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = services.business_id));

-- Políticas para professionals
CREATE POLICY "Professionals are viewable by business users"
  ON professionals FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = professionals.business_id));

CREATE POLICY "Professionals are insertable by business users"
  ON professionals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT user_id FROM users WHERE business_id = professionals.business_id));

CREATE POLICY "Professionals are updatable by business users"
  ON professionals FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = professionals.business_id))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM users WHERE business_id = professionals.business_id));

CREATE POLICY "Professionals are deletable by business users"
  ON professionals FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = professionals.business_id));

-- Políticas para professional_schedules
CREATE POLICY "Professional schedules are viewable by business users"
  ON professional_schedules FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM users
    WHERE business_id IN (
      SELECT business_id FROM professionals
      WHERE id = professional_schedules.professional_id
    )
  ));

CREATE POLICY "Professional schedules are insertable by business users"
  ON professional_schedules FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM users
    WHERE business_id IN (
      SELECT business_id FROM professionals
      WHERE id = professional_schedules.professional_id
    )
  ));

CREATE POLICY "Professional schedules are updatable by business users"
  ON professional_schedules FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM users
    WHERE business_id IN (
      SELECT business_id FROM professionals
      WHERE id = professional_schedules.professional_id
    )
  ))
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM users
    WHERE business_id IN (
      SELECT business_id FROM professionals
      WHERE id = professional_schedules.professional_id
    )
  ));

CREATE POLICY "Professional schedules are deletable by business users"
  ON professional_schedules FOR DELETE
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM users
    WHERE business_id IN (
      SELECT business_id FROM professionals
      WHERE id = professional_schedules.professional_id
    )
  ));

-- Políticas para appointments
CREATE POLICY "Appointments are viewable by business users"
  ON appointments FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = appointments.business_id));

CREATE POLICY "Appointments are insertable by business users"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT user_id FROM users WHERE business_id = appointments.business_id));

CREATE POLICY "Appointments are updatable by business users"
  ON appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = appointments.business_id))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM users WHERE business_id = appointments.business_id));

CREATE POLICY "Appointments are deletable by business users"
  ON appointments FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM users WHERE business_id = appointments.business_id)); 