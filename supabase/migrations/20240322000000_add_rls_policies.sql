-- Adiciona políticas RLS para todas as tabelas principais
BEGIN;

-- Habilita RLS em todas as tabelas
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para businesses
CREATE POLICY "Usuários podem ver apenas seus próprios negócios"
ON public.businesses FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = id
  )
);

CREATE POLICY "Apenas owners podem criar negócios"
ON public.businesses FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE role = 'owner'
  )
);

CREATE POLICY "Apenas owners podem atualizar seus negócios"
ON public.businesses FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = id AND role = 'owner'
  )
);

-- Políticas para business_users
CREATE POLICY "Usuários podem ver membros de seus negócios"
ON public.business_users FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = business_users.business_id
  )
);

CREATE POLICY "Apenas owners podem gerenciar membros"
ON public.business_users FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = business_users.business_id AND role = 'owner'
  )
);

-- Políticas para professionals
CREATE POLICY "Usuários podem ver profissionais de seus negócios"
ON public.professionals FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = professionals.business_id
  )
);

CREATE POLICY "Apenas admins podem gerenciar profissionais"
ON public.professionals FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = professionals.business_id AND role IN ('owner', 'admin')
  )
);

-- Políticas para clients
CREATE POLICY "Usuários podem ver clientes de seus negócios"
ON public.clients FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = clients.business_id
  )
);

CREATE POLICY "Apenas staff pode gerenciar clientes"
ON public.clients FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = clients.business_id AND role IN ('owner', 'admin', 'staff')
  )
);

-- Políticas para appointments
CREATE POLICY "Usuários podem ver agendamentos de seus negócios"
ON public.appointments FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = appointments.business_id
  )
);

CREATE POLICY "Profissionais podem ver seus agendamentos"
ON public.appointments FOR SELECT
USING (
  professional_id IN (
    SELECT id 
    FROM public.professionals 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Apenas staff pode gerenciar agendamentos"
ON public.appointments FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = appointments.business_id AND role IN ('owner', 'admin', 'staff')
  )
);

-- Políticas para services
CREATE POLICY "Usuários podem ver serviços de seus negócios"
ON public.services FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = services.business_id
  )
);

CREATE POLICY "Apenas admins podem gerenciar serviços"
ON public.services FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = services.business_id AND role IN ('owner', 'admin')
  )
);

-- Políticas para products
CREATE POLICY "Usuários podem ver produtos de seus negócios"
ON public.products FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = products.business_id
  )
);

CREATE POLICY "Apenas admins podem gerenciar produtos"
ON public.products FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = products.business_id AND role IN ('owner', 'admin')
  )
);

-- Políticas para inventory
CREATE POLICY "Usuários podem ver estoque de seus negócios"
ON public.inventory FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = inventory.business_id
  )
);

CREATE POLICY "Apenas admins podem gerenciar estoque"
ON public.inventory FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = inventory.business_id AND role IN ('owner', 'admin')
  )
);

-- Políticas para financial_transactions
CREATE POLICY "Usuários podem ver transações de seus negócios"
ON public.financial_transactions FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = financial_transactions.business_id
  )
);

CREATE POLICY "Apenas admins podem gerenciar transações"
ON public.financial_transactions FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.business_users 
    WHERE business_id = financial_transactions.business_id AND role IN ('owner', 'admin')
  )
);

COMMIT; 