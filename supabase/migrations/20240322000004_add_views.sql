-- Adiciona views importantes para o sistema
BEGIN;

-- View para agendamentos do dia
CREATE OR REPLACE VIEW public.daily_appointments AS
SELECT
    a.id,
    a.business_id,
    a.client_id,
    a.professional_id,
    a.date,
    a.start_time,
    a.end_time,
    a.status,
    a.total_price,
    c.name as client_name,
    c.phone as client_phone,
    p.name as professional_name,
    json_agg(
        json_build_object(
            'service_id', s.id,
            'service_name', s.name,
            'duration', s.duration,
            'price', s.price
        )
    ) as services
FROM public.appointments a
JOIN public.clients c ON c.id = a.client_id
JOIN public.professionals p ON p.id = a.professional_id
JOIN public.appointment_services aps ON aps.appointment_id = a.id
JOIN public.services s ON s.id = aps.service_id
GROUP BY a.id, c.name, c.phone, p.name;

-- View para disponibilidade de profissionais
CREATE OR REPLACE VIEW public.professional_availability AS
SELECT
    p.id as professional_id,
    p.name as professional_name,
    a.day_of_week,
    a.start_time,
    a.end_time,
    a.custom_date,
    a.is_off_day,
    json_agg(
        json_build_object(
            'service_id', s.id,
            'service_name', s.name,
            'duration', s.duration
        )
    ) as services
FROM public.professionals p
JOIN public.availabilities a ON a.professional_id = p.id
JOIN public.professional_services ps ON ps.professional_id = p.id
JOIN public.services s ON s.id = ps.service_id
WHERE ps.is_active = true
GROUP BY p.id, p.name, a.day_of_week, a.start_time, a.end_time, a.custom_date, a.is_off_day;

-- View para relatório financeiro
CREATE OR REPLACE VIEW public.financial_report AS
SELECT
    ft.business_id,
    ft.date,
    ft.type,
    ft.amount,
    ft.description,
    ft.payment_method,
    ft.status,
    CASE
        WHEN ft.type = 'revenue' THEN ft.amount
        ELSE 0
    END as revenue,
    CASE
        WHEN ft.type = 'expense' THEN ft.amount
        ELSE 0
    END as expense,
    CASE
        WHEN ft.type = 'commission' THEN ft.amount
        ELSE 0
    END as commission,
    b.name as business_name,
    p.name as professional_name,
    c.name as client_name
FROM public.financial_transactions ft
LEFT JOIN public.businesses b ON b.id = ft.business_id
LEFT JOIN public.professionals p ON p.id = ft.professional_id
LEFT JOIN public.clients c ON c.id = ft.client_id;

-- View para estoque
CREATE OR REPLACE VIEW public.inventory_status AS
SELECT
    i.business_id,
    i.product_id,
    p.name as product_name,
    p.sku,
    i.quantity,
    i.min_stock,
    i.max_stock,
    CASE
        WHEN i.quantity <= i.min_stock THEN 'low'
        WHEN i.quantity >= i.max_stock THEN 'high'
        ELSE 'normal'
    END as stock_status,
    p.cost_price,
    p.sale_price,
    (p.sale_price - p.cost_price) as profit_margin,
    (i.quantity * p.cost_price) as total_cost,
    (i.quantity * p.sale_price) as total_value
FROM public.inventory i
JOIN public.products p ON p.id = i.product_id;

-- View para métricas de negócio
CREATE OR REPLACE VIEW public.business_metrics AS
SELECT
    b.id as business_id,
    b.name as business_name,
    COUNT(DISTINCT a.id) as total_appointments,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'completed') as completed_appointments,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'cancelled') as cancelled_appointments,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'no_show') as no_show_appointments,
    AVG(a.rating) as average_rating,
    COUNT(DISTINCT c.id) as total_clients,
    COUNT(DISTINCT c.id) FILTER (
        WHERE c.created_at >= CURRENT_DATE - INTERVAL '30 days'
    ) as new_clients,
    SUM(ft.amount) FILTER (WHERE ft.type = 'revenue') as total_revenue,
    SUM(ft.amount) FILTER (WHERE ft.type = 'expense') as total_expenses,
    SUM(ft.amount) FILTER (WHERE ft.type = 'commission') as total_commissions
FROM public.businesses b
LEFT JOIN public.appointments a ON a.business_id = b.id
LEFT JOIN public.clients c ON c.business_id = b.id
LEFT JOIN public.financial_transactions ft ON ft.business_id = b.id
GROUP BY b.id, b.name;

-- View para histórico de clientes
CREATE OR REPLACE VIEW public.client_history AS
SELECT
    c.id as client_id,
    c.name as client_name,
    c.business_id,
    COUNT(DISTINCT a.id) as total_appointments,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'completed') as completed_appointments,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'cancelled') as cancelled_appointments,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'no_show') as no_show_appointments,
    SUM(a.total_price) as total_spent,
    AVG(a.rating) as average_rating,
    MAX(a.date) as last_visit,
    json_agg(
        DISTINCT jsonb_build_object(
            'service_id', s.id,
            'service_name', s.name,
            'count', COUNT(*)
        )
    ) as service_history
FROM public.clients c
LEFT JOIN public.appointments a ON a.client_id = c.id
LEFT JOIN public.appointment_services aps ON aps.appointment_id = a.id
LEFT JOIN public.services s ON s.id = aps.service_id
GROUP BY c.id, c.name, c.business_id;

-- View para performance de profissionais
CREATE OR REPLACE VIEW public.professional_performance AS
SELECT
    p.id as professional_id,
    p.name as professional_name,
    p.business_id,
    COUNT(DISTINCT a.id) as total_appointments,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'completed') as completed_appointments,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'cancelled') as cancelled_appointments,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'no_show') as no_show_appointments,
    AVG(a.rating) as average_rating,
    SUM(a.total_price) as total_revenue,
    SUM(ft.amount) FILTER (WHERE ft.type = 'commission') as total_commissions,
    json_agg(
        DISTINCT jsonb_build_object(
            'service_id', s.id,
            'service_name', s.name,
            'count', COUNT(*),
            'revenue', SUM(s.price)
        )
    ) as service_performance
FROM public.professionals p
LEFT JOIN public.appointments a ON a.professional_id = p.id
LEFT JOIN public.appointment_services aps ON aps.appointment_id = a.id
LEFT JOIN public.services s ON s.id = aps.service_id
LEFT JOIN public.financial_transactions ft ON ft.professional_id = p.id
GROUP BY p.id, p.name, p.business_id;

COMMIT; 