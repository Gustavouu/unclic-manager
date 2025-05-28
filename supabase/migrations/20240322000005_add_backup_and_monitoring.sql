-- Adiciona funções de backup e monitoramento
BEGIN;

-- Função para registrar logs de auditoria
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        table_name,
        record_id,
        action,
        old_data,
        new_data,
        user_id,
        business_id
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE
            WHEN TG_OP = 'UPDATE' OR TG_OP = 'DELETE'
            THEN row_to_json(OLD)
            ELSE NULL
        END,
        CASE
            WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE'
            THEN row_to_json(NEW)
            ELSE NULL
        END,
        auth.uid(),
        COALESCE(NEW.business_id, OLD.business_id)
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Função para verificar integridade dos dados
CREATE OR REPLACE FUNCTION check_data_integrity()
RETURNS TABLE (
    table_name text,
    record_id uuid,
    issue text,
    severity text
) AS $$
BEGIN
    RETURN QUERY
    -- Verificar agendamentos sem serviços
    SELECT
        'appointments'::text as table_name,
        a.id as record_id,
        'Agendamento sem serviços'::text as issue,
        'high'::text as severity
    FROM public.appointments a
    LEFT JOIN public.appointment_services aps ON aps.appointment_id = a.id
    WHERE aps.id IS NULL
    UNION ALL
    -- Verificar profissionais sem disponibilidade
    SELECT
        'professionals'::text as table_name,
        p.id as record_id,
        'Profissional sem disponibilidade'::text as issue,
        'medium'::text as severity
    FROM public.professionals p
    LEFT JOIN public.availabilities a ON a.professional_id = p.id
    WHERE a.id IS NULL
    UNION ALL
    -- Verificar serviços sem categoria
    SELECT
        'services'::text as table_name,
        s.id as record_id,
        'Serviço sem categoria'::text as issue,
        'low'::text as severity
    FROM public.services s
    LEFT JOIN public.service_categories sc ON sc.id = s.category_id
    WHERE sc.id IS NULL
    UNION ALL
    -- Verificar produtos sem estoque
    SELECT
        'products'::text as table_name,
        p.id as record_id,
        'Produto sem registro de estoque'::text as issue,
        'medium'::text as severity
    FROM public.products p
    LEFT JOIN public.inventory i ON i.product_id = p.id
    WHERE i.id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Função para gerar relatório de backup
CREATE OR REPLACE FUNCTION generate_backup_report()
RETURNS TABLE (
    table_name text,
    record_count bigint,
    last_backup timestamp with time zone,
    backup_size bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.table_name,
        t.record_count,
        b.last_backup,
        b.backup_size
    FROM (
        SELECT
            table_name,
            COUNT(*) as record_count
        FROM information_schema.tables
        WHERE table_schema = 'public'
        GROUP BY table_name
    ) t
    LEFT JOIN public.backup_logs b ON b.table_name = t.table_name
    ORDER BY t.table_name;
END;
$$ LANGUAGE plpgsql;

-- Função para monitorar performance
CREATE OR REPLACE FUNCTION monitor_performance()
RETURNS TABLE (
    query text,
    avg_time numeric,
    total_calls bigint,
    last_executed timestamp with time zone
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        query,
        avg_time,
        calls as total_calls,
        last_executed
    FROM pg_stat_statements
    ORDER BY avg_time DESC
    LIMIT 100;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar saúde do sistema
CREATE OR REPLACE FUNCTION check_system_health()
RETURNS TABLE (
    metric text,
    value numeric,
    status text
) AS $$
BEGIN
    RETURN QUERY
    -- Verificar uso de disco
    SELECT
        'disk_usage'::text as metric,
        pg_database_size(current_database()) as value,
        CASE
            WHEN pg_database_size(current_database()) > 1000000000 THEN 'warning'
            ELSE 'ok'
        END as status
    UNION ALL
    -- Verificar conexões ativas
    SELECT
        'active_connections'::text as metric,
        COUNT(*)::numeric as value,
        CASE
            WHEN COUNT(*) > 100 THEN 'warning'
            ELSE 'ok'
        END as status
    FROM pg_stat_activity
    UNION ALL
    -- Verificar locks
    SELECT
        'active_locks'::text as metric,
        COUNT(*)::numeric as value,
        CASE
            WHEN COUNT(*) > 10 THEN 'warning'
            ELSE 'ok'
        END as status
    FROM pg_locks
    WHERE granted = false;
END;
$$ LANGUAGE plpgsql;

-- Triggers para auditoria
CREATE TRIGGER audit_businesses
    AFTER INSERT OR UPDATE OR DELETE ON public.businesses
    FOR EACH ROW
    EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_professionals
    AFTER INSERT OR UPDATE OR DELETE ON public.professionals
    FOR EACH ROW
    EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_clients
    AFTER INSERT OR UPDATE OR DELETE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_appointments
    AFTER INSERT OR UPDATE OR DELETE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_services
    AFTER INSERT OR UPDATE OR DELETE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_products
    AFTER INSERT OR UPDATE OR DELETE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_inventory
    AFTER INSERT OR UPDATE OR DELETE ON public.inventory
    FOR EACH ROW
    EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_financial_transactions
    AFTER INSERT OR UPDATE OR DELETE ON public.financial_transactions
    FOR EACH ROW
    EXECUTE FUNCTION log_audit();

COMMIT; 