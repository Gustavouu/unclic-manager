
-- Otimização de políticas RLS para melhor performance
BEGIN;

-- 1. Remover políticas existentes que podem estar causando problemas
DROP POLICY IF EXISTS "Users can view clients from their business" ON public.clients_unified;
DROP POLICY IF EXISTS "Users can insert clients in their business" ON public.clients_unified;
DROP POLICY IF EXISTS "Users can update clients in their business" ON public.clients_unified;
DROP POLICY IF EXISTS "Owners can delete clients" ON public.clients_unified;

DROP POLICY IF EXISTS "Users can view appointments from their business" ON public.appointments_unified;
DROP POLICY IF EXISTS "Users can insert appointments in their business" ON public.appointments_unified;
DROP POLICY IF EXISTS "Users can update appointments in their business" ON public.appointments_unified;
DROP POLICY IF EXISTS "Owners can delete appointments" ON public.appointments_unified;

-- 2. Criar função otimizada para verificar acesso ao negócio
CREATE OR REPLACE FUNCTION public.user_has_business_access(business_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.business_users 
    WHERE user_id = auth.uid() 
    AND business_id = business_id_param
  );
END;
$$;

-- 3. Criar função para verificar se usuário é proprietário
CREATE OR REPLACE FUNCTION public.user_is_business_owner(business_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.business_users 
    WHERE user_id = auth.uid() 
    AND business_id = business_id_param 
    AND role = 'owner'
  );
END;
$$;

-- 4. Políticas otimizadas para clients_unified
CREATE POLICY "Optimized client access" ON public.clients_unified
FOR ALL USING (public.user_has_business_access(business_id));

-- 5. Políticas otimizadas para appointments_unified
CREATE POLICY "Optimized appointment access" ON public.appointments_unified
FOR ALL USING (public.user_has_business_access(business_id));

-- 6. Políticas otimizadas para employees_unified
CREATE POLICY "Optimized employee access" ON public.employees_unified
FOR ALL USING (public.user_has_business_access(business_id));

-- 7. Políticas otimizadas para business_settings
CREATE POLICY "Optimized business settings access" ON public.business_settings
FOR SELECT USING (public.user_has_business_access(business_id));

CREATE POLICY "Optimized business settings management" ON public.business_settings
FOR INSERT WITH CHECK (public.user_is_business_owner(business_id));

CREATE POLICY "Optimized business settings update" ON public.business_settings
FOR UPDATE USING (public.user_is_business_owner(business_id));

-- 8. Políticas otimizadas para inventory
CREATE POLICY "Optimized inventory access" ON public.inventory
FOR ALL USING (public.user_has_business_access(business_id));

-- 9. Habilitar RLS nas tabelas principais
ALTER TABLE public.clients_unified ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments_unified ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees_unified ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- 10. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_business_users_user_business ON public.business_users(user_id, business_id);
CREATE INDEX IF NOT EXISTS idx_clients_unified_business ON public.clients_unified(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_unified_business ON public.appointments_unified(business_id);
CREATE INDEX IF NOT EXISTS idx_employees_unified_business ON public.employees_unified(business_id);

COMMIT;
