-- Adiciona índices de performance
BEGIN;

-- Índices para tabela de negócios
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON public.businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON public.businesses(created_at);

-- Índices para tabela de profissionais
CREATE INDEX IF NOT EXISTS idx_professionals_business_id ON public.professionals(business_id);
CREATE INDEX IF NOT EXISTS idx_professionals_user_id ON public.professionals(user_id);
CREATE INDEX IF NOT EXISTS idx_professionals_status ON public.professionals(status);
CREATE INDEX IF NOT EXISTS idx_professionals_created_at ON public.professionals(created_at);

-- Índices para tabela de clientes
CREATE INDEX IF NOT EXISTS idx_clients_business_id ON public.clients(business_id);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON public.clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at);

-- Índices para tabela de agendamentos
CREATE INDEX IF NOT EXISTS idx_appointments_business_id ON public.appointments(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON public.appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_professional_id ON public.appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_end_time ON public.appointments(end_time);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public.appointments(created_at);

-- Índices para tabela de serviços
CREATE INDEX IF NOT EXISTS idx_services_business_id ON public.services(business_id);
CREATE INDEX IF NOT EXISTS idx_services_category_id ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON public.services(created_at);

-- Índices para tabela de produtos
CREATE INDEX IF NOT EXISTS idx_products_business_id ON public.products(business_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);

-- Índices para tabela de estoque
CREATE INDEX IF NOT EXISTS idx_inventory_business_id ON public.inventory(business_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON public.inventory(status);
CREATE INDEX IF NOT EXISTS idx_inventory_created_at ON public.inventory(created_at);

-- Índices para tabela de transações financeiras
CREATE INDEX IF NOT EXISTS idx_financial_transactions_business_id ON public.financial_transactions(business_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON public.financial_transactions(type);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_status ON public.financial_transactions(status);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_created_at ON public.financial_transactions(created_at);

-- Índices para tabela de logs de auditoria
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON public.audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_business_id ON public.audit_logs(business_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Índices para tabela de logs de backup
CREATE INDEX IF NOT EXISTS idx_backup_logs_table_name ON public.backup_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_backup_logs_created_at ON public.backup_logs(created_at);

-- Índices para tabela de disponibilidade
CREATE INDEX IF NOT EXISTS idx_availabilities_professional_id ON public.availabilities(professional_id);
CREATE INDEX IF NOT EXISTS idx_availabilities_day_of_week ON public.availabilities(day_of_week);
CREATE INDEX IF NOT EXISTS idx_availabilities_start_time ON public.availabilities(start_time);
CREATE INDEX IF NOT EXISTS idx_availabilities_end_time ON public.availabilities(end_time);

-- Índices para tabela de serviços de agendamento
CREATE INDEX IF NOT EXISTS idx_appointment_services_appointment_id ON public.appointment_services(appointment_id);
CREATE INDEX IF NOT EXISTS idx_appointment_services_service_id ON public.appointment_services(service_id);

-- Índices para tabela de categorias de serviço
CREATE INDEX IF NOT EXISTS idx_service_categories_business_id ON public.service_categories(business_id);
CREATE INDEX IF NOT EXISTS idx_service_categories_created_at ON public.service_categories(created_at);

-- Índices para tabela de categorias de produto
CREATE INDEX IF NOT EXISTS idx_product_categories_business_id ON public.product_categories(business_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_created_at ON public.product_categories(created_at);

-- Índices para tabela de configurações
CREATE INDEX IF NOT EXISTS idx_settings_business_id ON public.settings(business_id);
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(key);

-- Índices para tabela de notificações
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_business_id ON public.notifications(business_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

COMMIT; 