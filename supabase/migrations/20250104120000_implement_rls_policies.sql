
-- Implementação de políticas RLS para tabelas principais
BEGIN;

-- 1. Políticas para clients_unified
CREATE POLICY "Users can view clients from their business" ON public.clients_unified
FOR SELECT USING (
  business_id IN (
    SELECT business_id 
    FROM public.business_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert clients in their business" ON public.clients_unified
FOR INSERT WITH CHECK (
  business_id IN (
    SELECT business_id 
    FROM public.business_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update clients in their business" ON public.clients_unified
FOR UPDATE USING (
  business_id IN (
    SELECT business_id 
    FROM public.business_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Owners can delete clients" ON public.clients_unified
FOR DELETE USING (
  business_id IN (
    SELECT business_id 
    FROM public.business_users 
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- 2. Políticas para appointments_unified
CREATE POLICY "Users can view appointments from their business" ON public.appointments_unified
FOR SELECT USING (
  business_id IN (
    SELECT business_id 
    FROM public.business_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert appointments in their business" ON public.appointments_unified
FOR INSERT WITH CHECK (
  business_id IN (
    SELECT business_id 
    FROM public.business_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update appointments in their business" ON public.appointments_unified
FOR UPDATE USING (
  business_id IN (
    SELECT business_id 
    FROM public.business_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Owners can delete appointments" ON public.appointments_unified
FOR DELETE USING (
  business_id IN (
    SELECT business_id 
    FROM public.business_users 
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- 3. Políticas para employees_unified
CREATE POLICY "Users can view employees from their business" ON public.employees_unified
FOR SELECT USING (
  business_id IN (
    SELECT business_id 
    FROM public.business_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Owners and admins can manage employees" ON public.employees_unified
FOR ALL USING (
  business_id IN (
    SELECT business_id 
    FROM public.business_users 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- 4. Políticas para business_settings
CREATE POLICY "Users can view settings from their business" ON public.business_settings
FOR SELECT USING (
  business_id IN (
    SELECT business_id 
    FROM public.business_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Owners can manage business settings" ON public.business_settings
FOR ALL USING (
  business_id IN (
    SELECT business_id 
    FROM public.business_users 
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- 5. Políticas para inventory
CREATE POLICY "Users can view inventory from their business" ON public.inventory
FOR SELECT USING (
  business_id IN (
    SELECT business_id 
    FROM public.business_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Owners and admins can manage inventory" ON public.inventory
FOR ALL USING (
  business_id IN (
    SELECT business_id 
    FROM public.business_users 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

COMMIT;
