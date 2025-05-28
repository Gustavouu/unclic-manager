-- Script de rollback para a migração de padronização

-- Bloco 1: Remover índices adicionados
DROP INDEX IF EXISTS idx_users_tenant_id;
DROP INDEX IF EXISTS idx_services_tenant_id;
DROP INDEX IF EXISTS idx_appointments_tenant_id;
DROP INDEX IF EXISTS idx_businesses_created_at;

-- Bloco 2: Restaurar constraints e foreign keys
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_tenant_id_fkey'
    ) THEN
        ALTER TABLE users
            DROP CONSTRAINT IF EXISTS users_tenant_id_fkey,
            ADD CONSTRAINT usuarios_negocio_id_fkey
            FOREIGN KEY (tenant_id)
            REFERENCES negocios(id)
            ON DELETE CASCADE;
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'services_tenant_id_fkey'
    ) THEN
        ALTER TABLE services
            DROP CONSTRAINT IF EXISTS services_tenant_id_fkey,
            ADD CONSTRAINT servicos_negocio_id_fkey
            FOREIGN KEY (tenant_id)
            REFERENCES negocios(id)
            ON DELETE CASCADE;
    END IF;
END $$;

-- Bloco 3: Restaurar políticas de RLS
DO $$ 
BEGIN
    -- Remover novas políticas
    DROP POLICY IF EXISTS "Users can view their own data" ON users;
    DROP POLICY IF EXISTS "Users can view their business data" ON businesses;
    DROP POLICY IF EXISTS "Users can view their services" ON services;
    DROP POLICY IF EXISTS "Users can view their appointments" ON appointments;

    -- Restaurar políticas antigas
    CREATE POLICY "Usuários podem ver seus próprios dados"
        ON users FOR SELECT
        USING (auth.uid() = id OR negocio_id IN (
            SELECT negocio_id FROM usuarios WHERE id = auth.uid()
        ));

    CREATE POLICY "Usuários podem ver dados do seu negócio"
        ON businesses FOR SELECT
        USING (negocio_id IN (
            SELECT negocio_id FROM usuarios WHERE id = auth.uid()
        ));

    CREATE POLICY "Usuários podem ver seus serviços"
        ON services FOR SELECT
        USING (negocio_id IN (
            SELECT negocio_id FROM usuarios WHERE id = auth.uid()
        ));

    CREATE POLICY "Usuários podem ver seus agendamentos"
        ON appointments FOR SELECT
        USING (negocio_id IN (
            SELECT negocio_id FROM usuarios WHERE id = auth.uid()
        ));
END $$;

-- Bloco 4: Restaurar triggers
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
        ', t, t);
    END LOOP;
END $$;

-- Bloco 5: Restaurar nomes das colunas
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'tenant_id') THEN
        ALTER TABLE users RENAME COLUMN tenant_id TO negocio_id;
    END IF;

    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'tenant_id') THEN
        ALTER TABLE services RENAME COLUMN tenant_id TO negocio_id;
    END IF;

    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'tenant_id') THEN
        ALTER TABLE appointments RENAME COLUMN tenant_id TO negocio_id;
    END IF;
END $$;

-- Bloco 6: Restaurar nomes das tabelas
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        ALTER TABLE users RENAME TO usuarios;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'businesses') THEN
        ALTER TABLE businesses RENAME TO negocios;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'services') THEN
        ALTER TABLE services RENAME TO servicos;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'appointments') THEN
        ALTER TABLE appointments RENAME TO agendamentos;
    END IF;
END $$;

-- Bloco 7: Verificar rollback
DO $$ 
BEGIN
    RAISE NOTICE 'Rollback concluído. Verifique se todas as alterações foram revertidas corretamente.';
END $$; 