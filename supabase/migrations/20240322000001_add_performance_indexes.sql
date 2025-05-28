-- Adiciona índices de performance para otimização de queries
BEGIN;

-- Índices para appointments
CREATE INDEX idx_appointments_date ON public.appointments(date);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_professional ON public.appointments(professional_id);
CREATE INDEX idx_appointments_client ON public.appointments(client_id);
CREATE INDEX idx_appointments_business ON public.appointments(business_id);
CREATE INDEX idx_appointments_date_status ON public.appointments(date, status);

-- Índices para clients
CREATE INDEX idx_clients_business ON public.clients(business_id);
CREATE INDEX idx_clients_email ON public.clients(email);
CREATE INDEX idx_clients_phone ON public.clients(phone);
CREATE INDEX idx_clients_name ON public.clients(name);

-- Índices para professionals
CREATE INDEX idx_professionals_business ON public.professionals(business_id);
CREATE INDEX idx_professionals_email ON public.professionals(email);
CREATE INDEX idx_professionals_status ON public.professionals(status);

-- Índices para services
CREATE INDEX idx_services_business ON public.services(business_id);
CREATE INDEX idx_services_category ON public.services(category_id);
CREATE INDEX idx_services_active ON public.services(is_active);

-- Índices para products
CREATE INDEX idx_products_business ON public.products(business_id);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_active ON public.products(is_active);

-- Índices para inventory
CREATE INDEX idx_inventory_business ON public.inventory(business_id);
CREATE INDEX idx_inventory_product ON public.inventory(product_id);
CREATE INDEX idx_inventory_low_stock ON public.inventory(business_id, product_id) WHERE quantity <= min_stock;

-- Índices para financial_transactions
CREATE INDEX idx_transactions_business ON public.financial_transactions(business_id);
CREATE INDEX idx_transactions_date ON public.financial_transactions(date);
CREATE INDEX idx_transactions_type ON public.financial_transactions(type);
CREATE INDEX idx_transactions_status ON public.financial_transactions(status);
CREATE INDEX idx_transactions_date_type ON public.financial_transactions(date, type);

-- Índices para business_users
CREATE INDEX idx_business_users_business ON public.business_users(business_id);
CREATE INDEX idx_business_users_user ON public.business_users(user_id);
CREATE INDEX idx_business_users_role ON public.business_users(role);

-- Índices para service_categories
CREATE INDEX idx_service_categories_business ON public.service_categories(business_id);
CREATE INDEX idx_service_categories_active ON public.service_categories(is_active);

-- Índices para professional_services
CREATE INDEX idx_professional_services_professional ON public.professional_services(professional_id);
CREATE INDEX idx_professional_services_service ON public.professional_services(service_id);
CREATE INDEX idx_professional_services_active ON public.professional_services(is_active);

-- Índices para appointment_services
CREATE INDEX idx_appointment_services_appointment ON public.appointment_services(appointment_id);
CREATE INDEX idx_appointment_services_service ON public.appointment_services(service_id);

-- Índices para availabilities
CREATE INDEX idx_availabilities_professional ON public.availabilities(professional_id);
CREATE INDEX idx_availabilities_service ON public.availabilities(service_id);
CREATE INDEX idx_availabilities_date ON public.availabilities(custom_date);
CREATE INDEX idx_availabilities_day ON public.availabilities(day_of_week);

COMMIT; 