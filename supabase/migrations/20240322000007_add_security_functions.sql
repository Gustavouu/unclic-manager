-- Adiciona funções de segurança
BEGIN;

-- Função para verificar permissões do usuário
CREATE OR REPLACE FUNCTION check_user_permission(
    p_user_id uuid,
    p_business_id uuid,
    p_permission text
)
RETURNS boolean AS $$
DECLARE
    v_has_permission boolean;
BEGIN
    -- Verifica se o usuário é dono do negócio
    SELECT EXISTS (
        SELECT 1
        FROM public.businesses
        WHERE id = p_business_id
        AND owner_id = p_user_id
    ) INTO v_has_permission;

    IF v_has_permission THEN
        RETURN true;
    END IF;

    -- Verifica se o usuário é profissional do negócio
    SELECT EXISTS (
        SELECT 1
        FROM public.professionals
        WHERE business_id = p_business_id
        AND user_id = p_user_id
        AND status = 'active'
    ) INTO v_has_permission;

    IF v_has_permission THEN
        -- Verifica permissões específicas do profissional
        SELECT EXISTS (
            SELECT 1
            FROM public.professional_permissions
            WHERE professional_id = (
                SELECT id
                FROM public.professionals
                WHERE business_id = p_business_id
                AND user_id = p_user_id
            )
            AND permission = p_permission
        ) INTO v_has_permission;

        RETURN v_has_permission;
    END IF;

    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para validar dados sensíveis
CREATE OR REPLACE FUNCTION validate_sensitive_data(
    p_data jsonb,
    p_type text
)
RETURNS boolean AS $$
BEGIN
    CASE p_type
        WHEN 'email' THEN
            RETURN p_data ? 'email' AND p_data->>'email' ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
        WHEN 'phone' THEN
            RETURN p_data ? 'phone' AND p_data->>'phone' ~ '^\+?[0-9]{10,15}$';
        WHEN 'cpf' THEN
            RETURN p_data ? 'cpf' AND p_data->>'cpf' ~ '^[0-9]{11}$';
        WHEN 'cnpj' THEN
            RETURN p_data ? 'cnpj' AND p_data->>'cnpj' ~ '^[0-9]{14}$';
        ELSE
            RETURN false;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para criptografar dados sensíveis
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(
    p_data text,
    p_type text
)
RETURNS text AS $$
BEGIN
    -- Implementar criptografia adequada aqui
    -- Por enquanto, apenas retorna o dado original
    RETURN p_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para descriptografar dados sensíveis
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(
    p_data text,
    p_type text
)
RETURNS text AS $$
BEGIN
    -- Implementar descriptografia adequada aqui
    -- Por enquanto, apenas retorna o dado original
    RETURN p_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para registrar tentativas de acesso
CREATE OR REPLACE FUNCTION log_access_attempt(
    p_user_id uuid,
    p_business_id uuid,
    p_action text,
    p_status text,
    p_details jsonb DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO public.access_logs (
        user_id,
        business_id,
        action,
        status,
        details,
        ip_address,
        user_agent
    ) VALUES (
        p_user_id,
        p_business_id,
        p_action,
        p_status,
        p_details,
        current_setting('request.headers')::jsonb->>'x-forwarded-for',
        current_setting('request.headers')::jsonb->>'user-agent'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar rate limiting
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_user_id uuid,
    p_action text,
    p_limit integer DEFAULT 100,
    p_window interval DEFAULT '1 hour'::interval
)
RETURNS boolean AS $$
DECLARE
    v_count integer;
BEGIN
    SELECT COUNT(*)
    INTO v_count
    FROM public.access_logs
    WHERE user_id = p_user_id
    AND action = p_action
    AND created_at > NOW() - p_window;

    RETURN v_count < p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar força da senha
CREATE OR REPLACE FUNCTION check_password_strength(
    p_password text
)
RETURNS boolean AS $$
BEGIN
    -- Verifica se a senha tem pelo menos 8 caracteres
    IF length(p_password) < 8 THEN
        RETURN false;
    END IF;

    -- Verifica se a senha tem pelo menos uma letra maiúscula
    IF p_password !~ '[A-Z]' THEN
        RETURN false;
    END IF;

    -- Verifica se a senha tem pelo menos uma letra minúscula
    IF p_password !~ '[a-z]' THEN
        RETURN false;
    END IF;

    -- Verifica se a senha tem pelo menos um número
    IF p_password !~ '[0-9]' THEN
        RETURN false;
    END IF;

    -- Verifica se a senha tem pelo menos um caractere especial
    IF p_password !~ '[!@#$%^&*(),.?":{}|<>]' THEN
        RETURN false;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se o usuário está bloqueado
CREATE OR REPLACE FUNCTION is_user_blocked(
    p_user_id uuid
)
RETURNS boolean AS $$
DECLARE
    v_blocked_until timestamp with time zone;
BEGIN
    SELECT blocked_until
    INTO v_blocked_until
    FROM public.users
    WHERE id = p_user_id;

    IF v_blocked_until IS NULL THEN
        RETURN false;
    END IF;

    IF v_blocked_until > NOW() THEN
        RETURN true;
    END IF;

    -- Desbloqueia o usuário se o período de bloqueio expirou
    UPDATE public.users
    SET blocked_until = NULL
    WHERE id = p_user_id;

    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se o IP está bloqueado
CREATE OR REPLACE FUNCTION is_ip_blocked(
    p_ip_address text
)
RETURNS boolean AS $$
DECLARE
    v_blocked_until timestamp with time zone;
BEGIN
    SELECT blocked_until
    INTO v_blocked_until
    FROM public.blocked_ips
    WHERE ip_address = p_ip_address;

    IF v_blocked_until IS NULL THEN
        RETURN false;
    END IF;

    IF v_blocked_until > NOW() THEN
        RETURN true;
    END IF;

    -- Remove o bloqueio se o período expirou
    DELETE FROM public.blocked_ips
    WHERE ip_address = p_ip_address;

    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se o token é válido
CREATE OR REPLACE FUNCTION is_token_valid(
    p_token text,
    p_type text
)
RETURNS boolean AS $$
DECLARE
    v_expires_at timestamp with time zone;
BEGIN
    SELECT expires_at
    INTO v_expires_at
    FROM public.tokens
    WHERE token = p_token
    AND type = p_type
    AND used = false;

    IF v_expires_at IS NULL THEN
        RETURN false;
    END IF;

    IF v_expires_at < NOW() THEN
        -- Marca o token como usado se expirou
        UPDATE public.tokens
        SET used = true
        WHERE token = p_token;

        RETURN false;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT; 