
-- Função para definir o status de um negócio
CREATE OR REPLACE FUNCTION public.set_business_status(business_id UUID, new_status TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.negocios 
  SET status = new_status,
      updated_at = NOW()
  WHERE id = business_id;
  
  RETURN FOUND;
END;
$$;
