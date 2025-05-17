
-- This function will safely fetch appointments from any valid appointment table
CREATE OR REPLACE FUNCTION public.fetch_agendamentos(business_id_param UUID)
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- First try agendamentos table if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agendamentos') THEN
    RETURN QUERY
    SELECT jsonb_build_object(
      'id', a.id,
      'data', a.data,
      'hora_inicio', a.hora_inicio,
      'status', a.status,
      'cliente_nome', c.nome
    )
    FROM agendamentos a
    LEFT JOIN clientes c ON a.id_cliente = c.id
    WHERE a.id_negocio = business_id_param;
    RETURN;
  END IF;
  
  -- If that fails, try Appointments table (capital A)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Appointments') THEN
    RETURN QUERY
    SELECT jsonb_build_object(
      'id', a.id,
      'data', a.data,
      'hora_inicio', a.hora_inicio,
      'status', a.status,
      'cliente_nome', c.nome
    )
    FROM "Appointments" a
    LEFT JOIN clientes c ON a.id_cliente = c.id
    WHERE a.id_negocio = business_id_param;
    RETURN;
  END IF;
  
  -- Finally try bookings table
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bookings') THEN
    RETURN QUERY
    SELECT jsonb_build_object(
      'id', b.id,
      'data', b.booking_date,
      'hora_inicio', b.start_time,
      'status', b.status,
      'cliente_nome', c.name
    )
    FROM bookings b
    LEFT JOIN clients c ON b.client_id = c.id
    WHERE b.business_id = business_id_param;
    RETURN;
  END IF;
  
  -- Return empty set if no tables found
  RETURN;
END;
$$;
