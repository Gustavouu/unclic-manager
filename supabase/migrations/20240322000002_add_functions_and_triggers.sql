-- Adiciona funções e triggers importantes para o sistema
BEGIN;

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Função para validar agendamentos
CREATE OR REPLACE FUNCTION validate_appointment()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar conflitos de horário
    IF EXISTS (
        SELECT 1 FROM public.appointments
        WHERE professional_id = NEW.professional_id
        AND date = NEW.date
        AND id != NEW.id
        AND (
            (start_time, end_time) OVERLAPS (NEW.start_time, NEW.end_time)
        )
    ) THEN
        RAISE EXCEPTION 'Conflito de horário detectado';
    END IF;

    -- Verificar disponibilidade do profissional
    IF NOT EXISTS (
        SELECT 1 FROM public.availabilities
        WHERE professional_id = NEW.professional_id
        AND (
            (custom_date = NEW.date AND start_time <= NEW.start_time AND end_time >= NEW.end_time)
            OR
            (day_of_week = EXTRACT(DOW FROM NEW.date) AND start_time <= NEW.start_time AND end_time >= NEW.end_time)
        )
    ) THEN
        RAISE EXCEPTION 'Profissional não disponível neste horário';
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Função para atualizar estoque
CREATE OR REPLACE FUNCTION update_inventory()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar estoque quando um produto é vendido
    IF NEW.type = 'sale' THEN
        UPDATE public.inventory
        SET quantity = quantity - NEW.quantity
        WHERE business_id = NEW.business_id
        AND product_id = NEW.product_id;
    END IF;

    -- Atualizar estoque quando um produto é comprado
    IF NEW.type = 'purchase' THEN
        UPDATE public.inventory
        SET quantity = quantity + NEW.quantity
        WHERE business_id = NEW.business_id
        AND product_id = NEW.product_id;
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Função para calcular comissões
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
DECLARE
    commission_amount DECIMAL;
BEGIN
    -- Calcular comissão baseada no serviço e profissional
    SELECT 
        (NEW.total_price * COALESCE(ps.commission_percentage, s.commission_percentage) / 100)
    INTO commission_amount
    FROM public.appointment_services aps
    JOIN public.services s ON s.id = aps.service_id
    LEFT JOIN public.professional_services ps ON ps.service_id = s.id AND ps.professional_id = NEW.professional_id
    WHERE aps.appointment_id = NEW.id;

    -- Registrar comissão
    INSERT INTO public.financial_transactions (
        business_id,
        type,
        amount,
        description,
        professional_id,
        appointment_id
    ) VALUES (
        NEW.business_id,
        'commission',
        commission_amount,
        'Comissão do agendamento #' || NEW.id,
        NEW.professional_id,
        NEW.id
    );

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Função para enviar notificações
CREATE OR REPLACE FUNCTION send_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Enviar notificação para o cliente
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        data
    ) VALUES (
        (SELECT user_id FROM public.clients WHERE id = NEW.client_id),
        'appointment_' || NEW.status,
        'Atualização de Agendamento',
        'Seu agendamento foi ' || NEW.status,
        jsonb_build_object(
            'appointment_id', NEW.id,
            'date', NEW.date,
            'time', NEW.start_time
        )
    );

    -- Enviar notificação para o profissional
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        data
    ) VALUES (
        (SELECT user_id FROM public.professionals WHERE id = NEW.professional_id),
        'appointment_' || NEW.status,
        'Atualização de Agendamento',
        'Um agendamento foi ' || NEW.status,
        jsonb_build_object(
            'appointment_id', NEW.id,
            'date', NEW.date,
            'time', NEW.start_time
        )
    );

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON public.businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at
    BEFORE UPDATE ON public.professionals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers para validação de agendamentos
CREATE TRIGGER validate_appointment_before_insert
    BEFORE INSERT ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION validate_appointment();

CREATE TRIGGER validate_appointment_before_update
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION validate_appointment();

-- Triggers para atualização de estoque
CREATE TRIGGER update_inventory_after_transaction
    AFTER INSERT ON public.financial_transactions
    FOR EACH ROW
    WHEN (NEW.type IN ('sale', 'purchase'))
    EXECUTE FUNCTION update_inventory();

-- Triggers para cálculo de comissões
CREATE TRIGGER calculate_commission_after_appointment
    AFTER UPDATE OF status ON public.appointments
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION calculate_commission();

-- Triggers para envio de notificações
CREATE TRIGGER send_notification_after_appointment
    AFTER INSERT OR UPDATE OF status ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION send_notification();

COMMIT; 