-- Script de verificação da migração

-- Verificar tabelas renomeadas
DO $$ 
DECLARE
    missing_tables text[] := ARRAY[]::text[];
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        missing_tables := array_append(missing_tables, 'users');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'businesses') THEN
        missing_tables := array_append(missing_tables, 'businesses');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'services') THEN
        missing_tables := array_append(missing_tables, 'services');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'appointments') THEN
        missing_tables := array_append(missing_tables, 'appointments');
    END IF;
    
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE EXCEPTION 'Tabelas ausentes: %', array_to_string(missing_tables, ', ');
    END IF;
END $$;

-- Verificar colunas renomeadas
DO $$ 
DECLARE
    missing_columns text[] := ARRAY[]::text[];
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'tenant_id') THEN
        missing_columns := array_append(missing_columns, 'users.tenant_id');
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'tenant_id') THEN
        missing_columns := array_append(missing_columns, 'services.tenant_id');
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'tenant_id') THEN
        missing_columns := array_append(missing_columns, 'appointments.tenant_id');
    END IF;
    
    IF array_length(missing_columns, 1) > 0 THEN
        RAISE EXCEPTION 'Colunas ausentes: %', array_to_string(missing_columns, ', ');
    END IF;
END $$;

-- Verificar constraints e foreign keys
DO $$ 
DECLARE
    missing_constraints text[] := ARRAY[]::text[];
BEGIN
    IF NOT EXISTS (SELECT FROM pg_constraint WHERE conname = 'users_tenant_id_fkey') THEN
        missing_constraints := array_append(missing_constraints, 'users_tenant_id_fkey');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_constraint WHERE conname = 'services_tenant_id_fkey') THEN
        missing_constraints := array_append(missing_constraints, 'services_tenant_id_fkey');
    END IF;
    
    IF array_length(missing_constraints, 1) > 0 THEN
        RAISE EXCEPTION 'Constraints ausentes: %', array_to_string(missing_constraints, ', ');
    END IF;
END $$;

-- Verificar índices
DO $$ 
DECLARE
    missing_indexes text[] := ARRAY[]::text[];
BEGIN
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_users_tenant_id') THEN
        missing_indexes := array_append(missing_indexes, 'idx_users_tenant_id');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_services_tenant_id') THEN
        missing_indexes := array_append(missing_indexes, 'idx_services_tenant_id');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_appointments_tenant_id') THEN
        missing_indexes := array_append(missing_indexes, 'idx_appointments_tenant_id');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_businesses_created_at') THEN
        missing_indexes := array_append(missing_indexes, 'idx_businesses_created_at');
    END IF;
    
    IF array_length(missing_indexes, 1) > 0 THEN
        RAISE EXCEPTION 'Índices ausentes: %', array_to_string(missing_indexes, ', ');
    END IF;
END $$;

-- Verificar políticas de RLS
DO $$ 
DECLARE
    missing_policies text[] := ARRAY[]::text[];
BEGIN
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view their own data') THEN
        missing_policies := array_append(missing_policies, 'users: Users can view their own data');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'businesses' AND policyname = 'Users can view their business data') THEN
        missing_policies := array_append(missing_policies, 'businesses: Users can view their business data');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'services' AND policyname = 'Users can view their services') THEN
        missing_policies := array_append(missing_policies, 'services: Users can view their services');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Users can view their appointments') THEN
        missing_policies := array_append(missing_policies, 'appointments: Users can view their appointments');
    END IF;
    
    IF array_length(missing_policies, 1) > 0 THEN
        RAISE EXCEPTION 'Políticas de RLS ausentes: %', array_to_string(missing_policies, ', ');
    END IF;
END $$;

-- Verificar triggers
DO $$ 
DECLARE
    missing_triggers text[] := ARRAY[]::text[];
BEGIN
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        missing_triggers := array_append(missing_triggers, 'update_users_updated_at');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'update_services_updated_at') THEN
        missing_triggers := array_append(missing_triggers, 'update_services_updated_at');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_trigger WHERE tgname = 'update_appointments_updated_at') THEN
        missing_triggers := array_append(missing_triggers, 'update_appointments_updated_at');
    END IF;
    
    IF array_length(missing_triggers, 1) > 0 THEN
        RAISE EXCEPTION 'Triggers ausentes: %', array_to_string(missing_triggers, ', ');
    END IF;
END $$;

-- Se chegou até aqui, todas as verificações passaram
DO $$ 
BEGIN
    RAISE NOTICE 'Todas as verificações de migração passaram com sucesso!';
END $$; 