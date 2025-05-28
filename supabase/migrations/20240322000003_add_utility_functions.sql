-- Adiciona funções de utilidade importantes para o sistema
BEGIN;

-- Função para gerar slug único
CREATE OR REPLACE FUNCTION generate_unique_slug(name text, table_name text)
RETURNS text AS $$
DECLARE
    base_slug text;
    slug text;
    counter integer := 1;
BEGIN
    -- Converter nome para slug
    base_slug := lower(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := trim(both '-' from base_slug);
    
    slug := base_slug;
    
    -- Verificar se slug já existe
    WHILE EXISTS (
        SELECT 1 
        FROM public.businesses 
        WHERE slug = slug
    ) LOOP
        slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular disponibilidade
CREATE OR REPLACE FUNCTION calculate_availability(
    p_professional_id uuid,
    p_date date,
    p_service_id uuid
)
RETURNS TABLE (
    start_time time,
    end_time time
) AS $$
DECLARE
    service_duration integer;
    v_availability record;
BEGIN
    -- Obter duração do serviço
    SELECT duration INTO service_duration
    FROM public.services
    WHERE id = p_service_id;

    -- Verificar disponibilidade regular
    FOR v_availability IN
        SELECT start_time, end_time
        FROM public.availabilities
        WHERE professional_id = p_professional_id
        AND (
            (custom_date = p_date)
            OR
            (day_of_week = EXTRACT(DOW FROM p_date))
        )
        AND is_off_day = false
    LOOP
        -- Calcular slots disponíveis
        RETURN QUERY
        WITH RECURSIVE time_slots AS (
            SELECT 
                v_availability.start_time as slot_start,
                v_availability.start_time + (service_duration || ' minutes')::interval as slot_end
            UNION ALL
            SELECT 
                slot_end,
                slot_end + (service_duration || ' minutes')::interval
            FROM time_slots
            WHERE slot_end + (service_duration || ' minutes')::interval <= v_availability.end_time
        )
        SELECT 
            slot_start::time,
            slot_end::time
        FROM time_slots
        WHERE NOT EXISTS (
            SELECT 1
            FROM public.appointments a
            WHERE a.professional_id = p_professional_id
            AND a.date = p_date
            AND (
                (a.start_time, a.end_time) OVERLAPS (slot_start::time, slot_end::time)
            )
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular relatórios financeiros
CREATE OR REPLACE FUNCTION calculate_financial_report(
    p_business_id uuid,
    p_start_date date,
    p_end_date date
)
RETURNS TABLE (
    total_revenue decimal,
    total_expenses decimal,
    total_profit decimal,
    total_commissions decimal,
    service_revenue decimal,
    product_revenue decimal
) AS $$
BEGIN
    RETURN QUERY
    WITH financial_data AS (
        SELECT
            SUM(CASE WHEN type = 'revenue' THEN amount ELSE 0 END) as total_revenue,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
            SUM(CASE WHEN type = 'commission' THEN amount ELSE 0 END) as total_commissions,
            SUM(CASE WHEN type = 'revenue' AND source = 'service' THEN amount ELSE 0 END) as service_revenue,
            SUM(CASE WHEN type = 'revenue' AND source = 'product' THEN amount ELSE 0 END) as product_revenue
        FROM public.financial_transactions
        WHERE business_id = p_business_id
        AND date BETWEEN p_start_date AND p_end_date
    )
    SELECT
        total_revenue,
        total_expenses,
        total_revenue - total_expenses - total_commissions as total_profit,
        total_commissions,
        service_revenue,
        product_revenue
    FROM financial_data;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular métricas de negócio
CREATE OR REPLACE FUNCTION calculate_business_metrics(
    p_business_id uuid,
    p_start_date date,
    p_end_date date
)
RETURNS TABLE (
    total_appointments integer,
    completed_appointments integer,
    cancelled_appointments integer,
    no_show_appointments integer,
    average_rating decimal,
    total_revenue decimal,
    total_clients integer,
    new_clients integer,
    returning_clients integer
) AS $$
BEGIN
    RETURN QUERY
    WITH appointment_metrics AS (
        SELECT
            COUNT(*) as total_appointments,
            COUNT(*) FILTER (WHERE status = 'completed') as completed_appointments,
            COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_appointments,
            COUNT(*) FILTER (WHERE status = 'no_show') as no_show_appointments,
            AVG(rating) as average_rating
        FROM public.appointments
        WHERE business_id = p_business_id
        AND date BETWEEN p_start_date AND p_end_date
    ),
    client_metrics AS (
        SELECT
            COUNT(DISTINCT client_id) as total_clients,
            COUNT(DISTINCT client_id) FILTER (
                WHERE date BETWEEN p_start_date AND p_end_date
            ) as new_clients,
            COUNT(DISTINCT client_id) FILTER (
                WHERE date < p_start_date
            ) as returning_clients
        FROM public.appointments
        WHERE business_id = p_business_id
    ),
    revenue_metrics AS (
        SELECT
            SUM(amount) as total_revenue
        FROM public.financial_transactions
        WHERE business_id = p_business_id
        AND type = 'revenue'
        AND date BETWEEN p_start_date AND p_end_date
    )
    SELECT
        am.total_appointments,
        am.completed_appointments,
        am.cancelled_appointments,
        am.no_show_appointments,
        am.average_rating,
        rm.total_revenue,
        cm.total_clients,
        cm.new_clients,
        cm.returning_clients
    FROM appointment_metrics am
    CROSS JOIN client_metrics cm
    CROSS JOIN revenue_metrics rm;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar conflitos de horário
CREATE OR REPLACE FUNCTION check_schedule_conflicts(
    p_professional_id uuid,
    p_date date,
    p_start_time time,
    p_end_time time,
    p_appointment_id uuid DEFAULT NULL
)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.appointments
        WHERE professional_id = p_professional_id
        AND date = p_date
        AND id != COALESCE(p_appointment_id, '00000000-0000-0000-0000-000000000000'::uuid)
        AND (
            (start_time, end_time) OVERLAPS (p_start_time, p_end_time)
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Função para verificar estoque baixo
CREATE OR REPLACE FUNCTION check_low_stock(
    p_business_id uuid
)
RETURNS TABLE (
    product_id uuid,
    product_name text,
    current_quantity decimal,
    min_stock decimal
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        i.product_id,
        p.name as product_name,
        i.quantity as current_quantity,
        i.min_stock
    FROM public.inventory i
    JOIN public.products p ON p.id = i.product_id
    WHERE i.business_id = p_business_id
    AND i.quantity <= i.min_stock;
END;
$$ LANGUAGE plpgsql;

COMMIT; 