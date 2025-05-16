-- Script de Migração e Padronização do Banco de Dados
BEGIN;

-- 1. Criar tabelas temporárias para backup
CREATE TABLE IF NOT EXISTS temp_users AS SELECT * FROM usuarios;
CREATE TABLE IF NOT EXISTS temp_businesses AS SELECT * FROM negocios;
CREATE TABLE IF NOT EXISTS temp_business_users AS SELECT * FROM usuarios;
CREATE TABLE IF NOT EXISTS temp_clients AS SELECT * FROM clientes;
CREATE TABLE IF NOT EXISTS temp_services AS SELECT * FROM servicos;
CREATE TABLE IF NOT EXISTS temp_professionals AS SELECT * FROM profissionais;
CREATE TABLE IF NOT EXISTS temp_schedules AS SELECT * FROM horarios_profissionais;
CREATE TABLE IF NOT EXISTS temp_appointments AS SELECT * FROM agendamentos;
CREATE TABLE IF NOT EXISTS temp_business_settings AS SELECT * FROM configuracoes_negocio;

-- 2. Dropar tabelas duplicadas
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS negocios CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS servicos CASCADE;
DROP TABLE IF EXISTS profissionais CASCADE;
DROP TABLE IF EXISTS horarios_profissionais CASCADE;
DROP TABLE IF EXISTS agendamentos CASCADE;
DROP TABLE IF EXISTS configuracoes_negocio CASCADE;

-- 3. Recriar tabelas com estrutura padronizada
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'professional', 'receptionist')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    cnpj TEXT UNIQUE,
    email TEXT,
    phone TEXT,
    address JSONB,
    settings JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~* '^\+?[0-9]{10,15}$')
);

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    birth_date DATE,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~* '^\+?[0-9]{10,15}$')
);

CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id),
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL CHECK (duration > 0), -- em minutos
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id),
    user_id UUID REFERENCES users(id),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    specialties TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~* '^\+?[0-9]{10,15}$')
);

CREATE TABLE IF NOT EXISTS professional_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID NOT NULL REFERENCES professionals(id),
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    professional_id UUID NOT NULL REFERENCES professionals(id),
    service_id UUID NOT NULL REFERENCES services(id),
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0), -- em minutos
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS business_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id),
    company_name TEXT NOT NULL,
    business_hours JSONB NOT NULL,
    appointment_interval INTEGER NOT NULL DEFAULT 30 CHECK (appointment_interval > 0), -- em minutos
    min_advance_time INTEGER NOT NULL DEFAULT 30 CHECK (min_advance_time >= 0), -- em minutos
    max_advance_time INTEGER NOT NULL DEFAULT 30 CHECK (max_advance_time > 0), -- em dias
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Migrar dados das tabelas temporárias
INSERT INTO businesses (
    id, name, cnpj, email, phone, address, settings, is_active, created_at, updated_at
)
SELECT 
    id, name, cnpj, email, telefone, endereco, configuracoes, ativo, created_at, updated_at
FROM temp_businesses;

INSERT INTO users (
    id, business_id, email, name, role, is_active, created_at, updated_at
)
SELECT 
    id, id_negocio, email, nome, 
    CASE 
        WHEN cargo = 'admin' THEN 'admin'
        WHEN cargo = 'profissional' THEN 'professional'
        WHEN cargo = 'recepcionista' THEN 'receptionist'
    END,
    ativo, created_at, updated_at
FROM temp_users;

INSERT INTO clients (
    id, business_id, name, email, phone, birth_date, notes, is_active, created_at, updated_at
)
SELECT 
    id, 
    (SELECT business_id FROM users WHERE id = temp_clients.id),
    nome, email, telefone, data_nascimento, observacoes, ativo, created_at, updated_at
FROM temp_clients;

INSERT INTO services (
    id, business_id, name, description, duration, price, is_active, created_at, updated_at
)
SELECT 
    id,
    (SELECT business_id FROM users WHERE id = temp_services.id),
    nome, descricao, duracao, preco, ativo, created_at, updated_at
FROM temp_services;

INSERT INTO professionals (
    id, business_id, user_id, name, email, phone, specialties, is_active, created_at, updated_at
)
SELECT 
    id,
    (SELECT business_id FROM users WHERE id = temp_professionals.id),
    usuario_id, nome, email, telefone, especialidades, ativo, created_at, updated_at
FROM temp_professionals;

INSERT INTO professional_schedules (
    id, professional_id, day_of_week, start_time, end_time, is_active, created_at, updated_at
)
SELECT 
    id, profissional_id,
    CASE 
        WHEN dia_semana = 'domingo' THEN 'sunday'
        WHEN dia_semana = 'segunda' THEN 'monday'
        WHEN dia_semana = 'terca' THEN 'tuesday'
        WHEN dia_semana = 'quarta' THEN 'wednesday'
        WHEN dia_semana = 'quinta' THEN 'thursday'
        WHEN dia_semana = 'sexta' THEN 'friday'
        WHEN dia_semana = 'sabado' THEN 'saturday'
    END,
    hora_inicio, hora_fim, ativo, created_at, updated_at
FROM temp_schedules;

INSERT INTO appointments (
    id, business_id, client_id, professional_id, service_id, date_time, duration, status, notes, price, payment_method, created_at, updated_at
)
SELECT 
    id,
    (SELECT business_id FROM users WHERE id = temp_appointments.id),
    cliente_id, profissional_id, servico_id, data_hora, duracao,
    CASE 
        WHEN status = 'agendado' THEN 'scheduled'
        WHEN status = 'confirmado' THEN 'confirmed'
        WHEN status = 'cancelado' THEN 'cancelled'
        WHEN status = 'concluido' THEN 'completed'
    END,
    observacoes, valor, forma_pagamento, created_at, updated_at
FROM temp_appointments;

INSERT INTO business_settings (
    id, business_id, company_name, business_hours, appointment_interval, min_advance_time, max_advance_time, created_at, updated_at
)
SELECT 
    id,
    (SELECT business_id FROM users WHERE id = temp_business_settings.id),
    nome_empresa, horario_funcionamento, intervalo_agendamento, antecedencia_minima, antecedencia_maxima, created_at, updated_at
FROM temp_business_settings;

-- 5. Implementar políticas RLS
-- Políticas para users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Políticas para businesses
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their business"
    ON businesses FOR SELECT
    USING (id = (SELECT business_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage their business"
    ON businesses FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'admin'
            AND business_id = businesses.id
        )
    );

-- Políticas para clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view clients from their business"
    ON clients FOR SELECT
    USING (business_id = (SELECT business_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can manage clients in their business"
    ON clients FOR ALL
    USING (business_id = (SELECT business_id FROM users WHERE id = auth.uid()));

-- Políticas para services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view services from their business"
    ON services FOR SELECT
    USING (business_id = (SELECT business_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can manage services in their business"
    ON services FOR ALL
    USING (business_id = (SELECT business_id FROM users WHERE id = auth.uid()));

-- Políticas para professionals
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view professionals from their business"
    ON professionals FOR SELECT
    USING (business_id = (SELECT business_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can manage professionals in their business"
    ON professionals FOR ALL
    USING (business_id = (SELECT business_id FROM users WHERE id = auth.uid()));

-- Políticas para professional_schedules
ALTER TABLE professional_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view schedules from their business"
    ON professional_schedules FOR SELECT
    USING (
        professional_id IN (
            SELECT id FROM professionals
            WHERE business_id = (SELECT business_id FROM users WHERE id = auth.uid())
        )
    );

CREATE POLICY "Users can manage schedules in their business"
    ON professional_schedules FOR ALL
    USING (
        professional_id IN (
            SELECT id FROM professionals
            WHERE business_id = (SELECT business_id FROM users WHERE id = auth.uid())
        )
    );

-- Políticas para appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view appointments from their business"
    ON appointments FOR SELECT
    USING (business_id = (SELECT business_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can manage appointments in their business"
    ON appointments FOR ALL
    USING (business_id = (SELECT business_id FROM users WHERE id = auth.uid()));

-- Políticas para business_settings
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view settings from their business"
    ON business_settings FOR SELECT
    USING (business_id = (SELECT business_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage settings in their business"
    ON business_settings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'admin'
            AND business_id = business_settings.business_id
        )
    );

-- 6. Criar índices
CREATE INDEX IF NOT EXISTS idx_users_business ON users(business_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_clients_business ON clients(business_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_services_business ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_professionals_business ON professionals(business_id);
CREATE INDEX IF NOT EXISTS idx_professionals_user ON professionals(user_id);
CREATE INDEX IF NOT EXISTS idx_professional_schedules_professional ON professional_schedules(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_business ON appointments(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_professional ON appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(date_time);
CREATE INDEX IF NOT EXISTS idx_business_settings_business ON business_settings(business_id);

-- 7. Criar funções auxiliares
CREATE OR REPLACE FUNCTION set_business_status(
    business_id UUID,
    new_status TEXT
) RETURNS VOID AS $$
BEGIN
    -- Verificar se o usuário é admin do negócio
    IF NOT EXISTS (
        SELECT 1 FROM users
        WHERE business_id = set_business_status.business_id
        AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'User is not an admin of this business';
    END IF;

    -- Atualizar status
    UPDATE businesses
    SET 
        status = new_status,
        updated_at = NOW()
    WHERE id = business_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Limpar tabelas temporárias
DROP TABLE IF EXISTS temp_users;
DROP TABLE IF EXISTS temp_businesses;
DROP TABLE IF EXISTS temp_business_users;
DROP TABLE IF EXISTS temp_clients;
DROP TABLE IF EXISTS temp_services;
DROP TABLE IF EXISTS temp_professionals;
DROP TABLE IF EXISTS temp_schedules;
DROP TABLE IF EXISTS temp_appointments;
DROP TABLE IF EXISTS temp_business_settings;

COMMIT; 