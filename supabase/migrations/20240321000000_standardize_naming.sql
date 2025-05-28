-- Bloco 1: Renomear tabelas
DO $$ 
BEGIN
    -- Renomear tabelas mantendo a consistência
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'usuarios') THEN
        ALTER TABLE usuarios RENAME TO users;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'negocios') THEN
        ALTER TABLE negocios RENAME TO businesses;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'servicos') THEN
        ALTER TABLE servicos RENAME TO services;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'agendamentos') THEN
        ALTER TABLE agendamentos RENAME TO appointments;
    END IF;
END $$;

-- Bloco 2: Renomear colunas
DO $$ 
BEGIN
    -- Renomear colunas para manter consistência com tenant_id
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'negocio_id') THEN
        ALTER TABLE users RENAME COLUMN negocio_id TO tenant_id;
    END IF;

    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'negocio_id') THEN
        ALTER TABLE services RENAME COLUMN negocio_id TO tenant_id;
    END IF;

    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'negocio_id') THEN
        ALTER TABLE appointments RENAME COLUMN negocio_id TO tenant_id;
    END IF;
END $$;

-- Bloco 3: Renomear constraints, índices e foreign keys
DO $$ 
BEGIN
    -- Renomear constraints
    IF EXISTS (SELECT FROM pg_constraint WHERE conname = 'usuarios_negocio_id_fkey') THEN
        ALTER TABLE users RENAME CONSTRAINT usuarios_negocio_id_fkey TO users_tenant_id_fkey;
    END IF;

    IF EXISTS (SELECT FROM pg_constraint WHERE conname = 'servicos_negocio_id_fkey') THEN
        ALTER TABLE services RENAME CONSTRAINT servicos_negocio_id_fkey TO services_tenant_id_fkey;
    END IF;

    -- Renomear índices
    IF EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_usuarios_negocio_id') THEN
        ALTER INDEX idx_usuarios_negocio_id RENAME TO idx_users_tenant_id;
    END IF;

    IF EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_servicos_negocio_id') THEN
        ALTER INDEX idx_servicos_negocio_id RENAME TO idx_services_tenant_id;
    END IF;
END $$;

-- Bloco 4: Atualizar triggers e funções
CREATE OR REPLACE FUNCTION update_tenant_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas relevantes
DO $$ 
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'businesses', 'services', 'appointments')
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
            CREATE TRIGGER update_%I_updated_at
                BEFORE UPDATE ON %I
                FOR EACH ROW
                EXECUTE FUNCTION update_tenant_updated_at();
        ', t, t, t, t);
    END LOOP;
END $$;

-- Bloco 5: Atualizar políticas de RLS
DO $$ 
BEGIN
    -- Atualizar políticas para usar tenant_id
    DROP POLICY IF EXISTS "Users can view their own data" ON users;
    CREATE POLICY "Users can view their own data"
        ON users FOR SELECT
        USING (auth.uid() = id OR tenant_id IN (
            SELECT tenant_id FROM users WHERE id = auth.uid()
        ));

    DROP POLICY IF EXISTS "Users can view their business data" ON businesses;
    CREATE POLICY "Users can view their business data"
        ON businesses FOR SELECT
        USING (tenant_id IN (
            SELECT tenant_id FROM users WHERE id = auth.uid()
        ));

    DROP POLICY IF EXISTS "Users can view their services" ON services;
    CREATE POLICY "Users can view their services"
        ON services FOR SELECT
        USING (tenant_id IN (
            SELECT tenant_id FROM users WHERE id = auth.uid()
        ));

    DROP POLICY IF EXISTS "Users can view their appointments" ON appointments;
    CREATE POLICY "Users can view their appointments"
        ON appointments FOR SELECT
        USING (tenant_id IN (
            SELECT tenant_id FROM users WHERE id = auth.uid()
        ));
END $$;

-- Bloco 6: Verificar e corrigir dependências cruzadas
DO $$ 
BEGIN
    -- Verificar e corrigir foreign keys
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_tenant_id_fkey'
    ) THEN
        ALTER TABLE users
            DROP CONSTRAINT IF EXISTS users_tenant_id_fkey,
            ADD CONSTRAINT users_tenant_id_fkey
            FOREIGN KEY (tenant_id)
            REFERENCES businesses(id)
            ON DELETE CASCADE;
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'services_tenant_id_fkey'
    ) THEN
        ALTER TABLE services
            DROP CONSTRAINT IF EXISTS services_tenant_id_fkey,
            ADD CONSTRAINT services_tenant_id_fkey
            FOREIGN KEY (tenant_id)
            REFERENCES businesses(id)
            ON DELETE CASCADE;
    END IF;
END $$;

-- Bloco 7: Adicionar índices para otimização
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_services_tenant_id ON services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_id ON appointments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON businesses(created_at); 