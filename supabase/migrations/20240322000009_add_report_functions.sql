-- Adiciona funções de relatório
BEGIN;

-- Função para gerar relatório financeiro
CREATE OR REPLACE FUNCTION generate_financial_report(
    p_business_id uuid,
    p_start_date timestamp with time zone,
    p_end_date timestamp with time zone
)
RETURNS jsonb AS $$
DECLARE
    v_report jsonb;
BEGIN
    WITH financial_data AS (
        SELECT
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
            COUNT(CASE WHEN type = 'income' THEN 1 END) as income_count,
            COUNT(CASE WHEN type = 'expense' THEN 1 END) as expense_count,
            COUNT(DISTINCT CASE WHEN type = 'income' THEN payment_method END) as income_methods,
            COUNT(DISTINCT CASE WHEN type = 'expense' THEN payment_method END) as expense_methods
        FROM public.financial_transactions
        WHERE business_id = p_business_id
        AND created_at BETWEEN p_start_date AND p_end_date
    ),
    payment_methods AS (
        SELECT
            payment_method,
            type,
            COUNT(*) as count,
            SUM(amount) as total
        FROM public.financial_transactions
        WHERE business_id = p_business_id
        AND created_at BETWEEN p_start_date AND p_end_date
        GROUP BY payment_method, type
    ),
    daily_totals AS (
        SELECT
            DATE_TRUNC('day', created_at) as date,
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
        FROM public.financial_transactions
        WHERE business_id = p_business_id
        AND created_at BETWEEN p_start_date AND p_end_date
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date
    )
    SELECT jsonb_build_object(
        'summary', (
            SELECT jsonb_build_object(
                'total_income', total_income,
                'total_expense', total_expense,
                'net_income', total_income - total_expense,
                'income_count', income_count,
                'expense_count', expense_count,
                'income_methods', income_methods,
                'expense_methods', expense_methods
            )
            FROM financial_data
        ),
        'payment_methods', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'method', payment_method,
                    'type', type,
                    'count', count,
                    'total', total
                )
            )
            FROM payment_methods
        ),
        'daily_totals', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'date', date,
                    'income', income,
                    'expense', expense,
                    'net', income - expense
                )
            )
            FROM daily_totals
        )
    ) INTO v_report;

    RETURN v_report;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar relatório de agendamentos
CREATE OR REPLACE FUNCTION generate_appointment_report(
    p_business_id uuid,
    p_start_date timestamp with time zone,
    p_end_date timestamp with time zone
)
RETURNS jsonb AS $$
DECLARE
    v_report jsonb;
BEGIN
    WITH appointment_data AS (
        SELECT
            COUNT(*) as total_appointments,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_appointments,
            COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_appointments,
            COUNT(CASE WHEN status = 'no_show' THEN 1 END) as no_show_appointments,
            COUNT(DISTINCT client_id) as unique_clients,
            COUNT(DISTINCT professional_id) as unique_professionals
        FROM public.appointments
        WHERE business_id = p_business_id
        AND start_time BETWEEN p_start_date AND p_end_date
    ),
    service_data AS (
        SELECT
            s.id,
            s.name,
            COUNT(*) as appointment_count,
            SUM(s.price) as total_revenue
        FROM public.appointments a
        JOIN public.appointment_services aps ON aps.appointment_id = a.id
        JOIN public.services s ON s.id = aps.service_id
        WHERE a.business_id = p_business_id
        AND a.start_time BETWEEN p_start_date AND p_end_date
        GROUP BY s.id, s.name
    ),
    professional_data AS (
        SELECT
            p.id,
            p.name,
            COUNT(*) as appointment_count,
            COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_count,
            COUNT(CASE WHEN a.status = 'cancelled' THEN 1 END) as cancelled_count,
            COUNT(CASE WHEN a.status = 'no_show' THEN 1 END) as no_show_count
        FROM public.appointments a
        JOIN public.professionals p ON p.id = a.professional_id
        WHERE a.business_id = p_business_id
        AND a.start_time BETWEEN p_start_date AND p_end_date
        GROUP BY p.id, p.name
    ),
    daily_totals AS (
        SELECT
            DATE_TRUNC('day', start_time) as date,
            COUNT(*) as total_appointments,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_appointments,
            COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_appointments,
            COUNT(CASE WHEN status = 'no_show' THEN 1 END) as no_show_appointments
        FROM public.appointments
        WHERE business_id = p_business_id
        AND start_time BETWEEN p_start_date AND p_end_date
        GROUP BY DATE_TRUNC('day', start_time)
        ORDER BY date
    )
    SELECT jsonb_build_object(
        'summary', (
            SELECT jsonb_build_object(
                'total_appointments', total_appointments,
                'completed_appointments', completed_appointments,
                'cancelled_appointments', cancelled_appointments,
                'no_show_appointments', no_show_appointments,
                'unique_clients', unique_clients,
                'unique_professionals', unique_professionals
            )
            FROM appointment_data
        ),
        'services', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'name', name,
                    'appointment_count', appointment_count,
                    'total_revenue', total_revenue
                )
            )
            FROM service_data
        ),
        'professionals', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'name', name,
                    'appointment_count', appointment_count,
                    'completed_count', completed_count,
                    'cancelled_count', cancelled_count,
                    'no_show_count', no_show_count
                )
            )
            FROM professional_data
        ),
        'daily_totals', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'date', date,
                    'total_appointments', total_appointments,
                    'completed_appointments', completed_appointments,
                    'cancelled_appointments', cancelled_appointments,
                    'no_show_appointments', no_show_appointments
                )
            )
            FROM daily_totals
        )
    ) INTO v_report;

    RETURN v_report;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar relatório de clientes
CREATE OR REPLACE FUNCTION generate_client_report(
    p_business_id uuid,
    p_start_date timestamp with time zone,
    p_end_date timestamp with time zone
)
RETURNS jsonb AS $$
DECLARE
    v_report jsonb;
BEGIN
    WITH client_data AS (
        SELECT
            c.id,
            c.name,
            c.email,
            c.phone,
            COUNT(a.id) as total_appointments,
            COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_appointments,
            COUNT(CASE WHEN a.status = 'cancelled' THEN 1 END) as cancelled_appointments,
            COUNT(CASE WHEN a.status = 'no_show' THEN 1 END) as no_show_appointments,
            SUM(s.price) as total_spent,
            MAX(a.start_time) as last_appointment
        FROM public.clients c
        LEFT JOIN public.appointments a ON a.client_id = c.id
        LEFT JOIN public.appointment_services aps ON aps.appointment_id = a.id
        LEFT JOIN public.services s ON s.id = aps.service_id
        WHERE c.business_id = p_business_id
        AND (a.start_time BETWEEN p_start_date AND p_end_date OR a.start_time IS NULL)
        GROUP BY c.id, c.name, c.email, c.phone
    ),
    client_segments AS (
        SELECT
            CASE
                WHEN total_spent >= 1000 THEN 'high_value'
                WHEN total_spent >= 500 THEN 'medium_value'
                ELSE 'low_value'
            END as segment,
            COUNT(*) as client_count,
            SUM(total_spent) as total_revenue
        FROM client_data
        GROUP BY segment
    ),
    new_clients AS (
        SELECT
            DATE_TRUNC('day', created_at) as date,
            COUNT(*) as new_clients
        FROM public.clients
        WHERE business_id = p_business_id
        AND created_at BETWEEN p_start_date AND p_end_date
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date
    )
    SELECT jsonb_build_object(
        'summary', (
            SELECT jsonb_build_object(
                'total_clients', COUNT(*),
                'active_clients', COUNT(CASE WHEN total_appointments > 0 THEN 1 END),
                'new_clients', COUNT(CASE WHEN created_at BETWEEN p_start_date AND p_end_date THEN 1 END),
                'average_spent', AVG(total_spent),
                'total_revenue', SUM(total_spent)
            )
            FROM client_data
        ),
        'clients', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'name', name,
                    'email', email,
                    'phone', phone,
                    'total_appointments', total_appointments,
                    'completed_appointments', completed_appointments,
                    'cancelled_appointments', cancelled_appointments,
                    'no_show_appointments', no_show_appointments,
                    'total_spent', total_spent,
                    'last_appointment', last_appointment
                )
            )
            FROM client_data
        ),
        'segments', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'segment', segment,
                    'client_count', client_count,
                    'total_revenue', total_revenue
                )
            )
            FROM client_segments
        ),
        'new_clients', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'date', date,
                    'new_clients', new_clients
                )
            )
            FROM new_clients
        )
    ) INTO v_report;

    RETURN v_report;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar relatório de estoque
CREATE OR REPLACE FUNCTION generate_inventory_report(
    p_business_id uuid,
    p_start_date timestamp with time zone,
    p_end_date timestamp with time zone
)
RETURNS jsonb AS $$
DECLARE
    v_report jsonb;
BEGIN
    WITH inventory_data AS (
        SELECT
            p.id,
            p.name,
            p.sku,
            p.category_id,
            pc.name as category_name,
            i.quantity,
            i.min_quantity,
            i.max_quantity,
            i.last_restock_date,
            i.last_restock_quantity,
            i.last_restock_cost
        FROM public.products p
        JOIN public.product_categories pc ON pc.id = p.category_id
        JOIN public.inventory i ON i.product_id = p.id
        WHERE p.business_id = p_business_id
    ),
    inventory_movements AS (
        SELECT
            p.id as product_id,
            p.name as product_name,
            COUNT(*) as movement_count,
            SUM(CASE WHEN im.type = 'in' THEN im.quantity ELSE 0 END) as total_in,
            SUM(CASE WHEN im.type = 'out' THEN im.quantity ELSE 0 END) as total_out,
            SUM(CASE WHEN im.type = 'in' THEN im.quantity * im.unit_cost ELSE 0 END) as total_cost
        FROM public.products p
        JOIN public.inventory_movements im ON im.product_id = p.id
        WHERE p.business_id = p_business_id
        AND im.created_at BETWEEN p_start_date AND p_end_date
        GROUP BY p.id, p.name
    ),
    low_stock AS (
        SELECT
            id,
            name,
            sku,
            category_name,
            quantity,
            min_quantity
        FROM inventory_data
        WHERE quantity <= min_quantity
    ),
    category_summary AS (
        SELECT
            category_id,
            category_name,
            COUNT(*) as product_count,
            SUM(quantity) as total_quantity,
            SUM(quantity * last_restock_cost) as total_value
        FROM inventory_data
        GROUP BY category_id, category_name
    )
    SELECT jsonb_build_object(
        'summary', (
            SELECT jsonb_build_object(
                'total_products', COUNT(*),
                'total_quantity', SUM(quantity),
                'total_value', SUM(quantity * last_restock_cost),
                'low_stock_count', COUNT(CASE WHEN quantity <= min_quantity THEN 1 END)
            )
            FROM inventory_data
        ),
        'products', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'name', name,
                    'sku', sku,
                    'category_id', category_id,
                    'category_name', category_name,
                    'quantity', quantity,
                    'min_quantity', min_quantity,
                    'max_quantity', max_quantity,
                    'last_restock_date', last_restock_date,
                    'last_restock_quantity', last_restock_quantity,
                    'last_restock_cost', last_restock_cost
                )
            )
            FROM inventory_data
        ),
        'movements', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'product_id', product_id,
                    'product_name', product_name,
                    'movement_count', movement_count,
                    'total_in', total_in,
                    'total_out', total_out,
                    'total_cost', total_cost
                )
            )
            FROM inventory_movements
        ),
        'low_stock', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'name', name,
                    'sku', sku,
                    'category_name', category_name,
                    'quantity', quantity,
                    'min_quantity', min_quantity
                )
            )
            FROM low_stock
        ),
        'categories', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'category_id', category_id,
                    'category_name', category_name,
                    'product_count', product_count,
                    'total_quantity', total_quantity,
                    'total_value', total_value
                )
            )
            FROM category_summary
        )
    ) INTO v_report;

    RETURN v_report;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT; 