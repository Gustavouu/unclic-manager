BEGIN;

-- Waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id uuid NOT NULL REFERENCES public.businesses(id),
  client_id uuid NOT NULL REFERENCES public.clients(id),
  service_id uuid REFERENCES public.services(id),
  preferred_date date,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view waitlist for their business" ON public.waitlist
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.business_users bu
    WHERE bu.business_id = waitlist.business_id
      AND bu.user_id = auth.uid()
      AND bu.status = 'active'::user_status
  )
);

CREATE POLICY "Admins can manage waitlist" ON public.waitlist
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.business_users bu
    WHERE bu.business_id = waitlist.business_id
      AND bu.user_id = auth.uid()
      AND bu.role IN ('owner','admin')
      AND bu.status = 'active'::user_status
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.business_users bu
    WHERE bu.business_id = waitlist.business_id
      AND bu.user_id = auth.uid()
      AND bu.role IN ('owner','admin')
      AND bu.status = 'active'::user_status
  )
);

-- Commissions table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.commissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id uuid NOT NULL REFERENCES public.professionals(id),
  appointment_id uuid NOT NULL REFERENCES public.appointments(id),
  financial_transaction_id uuid REFERENCES public.financial_transactions(id),
  amount numeric NOT NULL,
  status text DEFAULT 'pending',
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view commissions of their business" ON public.commissions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.business_users bu
    JOIN public.appointments a ON a.id = commissions.appointment_id
    WHERE bu.business_id = a.business_id
      AND bu.user_id = auth.uid()
      AND bu.status = 'active'::user_status
  )
);

CREATE POLICY "Admins can manage commissions" ON public.commissions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.business_users bu
    JOIN public.appointments a ON a.id = commissions.appointment_id
    WHERE bu.business_id = a.business_id
      AND bu.user_id = auth.uid()
      AND bu.role IN ('owner','admin')
      AND bu.status = 'active'::user_status
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.business_users bu
    JOIN public.appointments a ON a.id = commissions.appointment_id
    WHERE bu.business_id = a.business_id
      AND bu.user_id = auth.uid()
      AND bu.role IN ('owner','admin')
      AND bu.status = 'active'::user_status
  )
);

-- RPC to calculate commission
CREATE OR REPLACE FUNCTION public.calculate_commission(p_appointment_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total numeric;
  prof uuid;
BEGIN
  SELECT professional_id INTO prof FROM public.appointments WHERE id = p_appointment_id;
  SELECT SUM(price) INTO total FROM public.appointment_services WHERE appointment_id = p_appointment_id;
  IF prof IS NULL OR total IS NULL THEN
    RETURN;
  END IF;
  INSERT INTO public.commissions (professional_id, appointment_id, amount)
  VALUES (prof, p_appointment_id, total * 0.10)
  ON CONFLICT DO NOTHING;
END;
$$;

COMMIT;
