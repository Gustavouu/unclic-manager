-- Função para verificar conflitos de agendamento
CREATE OR REPLACE FUNCTION check_appointment_conflicts(
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ,
  p_professional_id UUID,
  p_client_id UUID,
  p_service_id UUID,
  p_appointment_id UUID DEFAULT NULL
) RETURNS TABLE (
  appointment_id UUID,
  professional_id UUID,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  conflict_type TEXT,
  conflict_details TEXT
) LANGUAGE plpgsql AS $$
BEGIN
  -- Verifica conflitos com o profissional
  RETURN QUERY
  SELECT 
    a.id as appointment_id,
    a.professional_id,
    a.start_time,
    a.end_time,
    'professional' as conflict_type,
    'Professional has another appointment at this time' as conflict_details
  FROM appointments a
  WHERE a.professional_id = p_professional_id
    AND a.id != COALESCE(p_appointment_id, a.id)
    AND a.status NOT IN ('cancelled', 'no_show')
    AND (
      (a.start_time <= p_start_time AND a.end_time > p_start_time)
      OR (a.start_time < p_end_time AND a.end_time >= p_end_time)
      OR (a.start_time >= p_start_time AND a.end_time <= p_end_time)
    );

  -- Verifica conflitos com o cliente
  RETURN QUERY
  SELECT 
    a.id as appointment_id,
    a.professional_id,
    a.start_time,
    a.end_time,
    'client' as conflict_type,
    'Client has another appointment at this time' as conflict_details
  FROM appointments a
  WHERE a.client_id = p_client_id
    AND a.id != COALESCE(p_appointment_id, a.id)
    AND a.status NOT IN ('cancelled', 'no_show')
    AND (
      (a.start_time <= p_start_time AND a.end_time > p_start_time)
      OR (a.start_time < p_end_time AND a.end_time >= p_end_time)
      OR (a.start_time >= p_start_time AND a.end_time <= p_end_time)
    );

  -- Verifica conflitos com o serviço
  RETURN QUERY
  SELECT 
    a.id as appointment_id,
    a.professional_id,
    a.start_time,
    a.end_time,
    'service' as conflict_type,
    'Service is already booked at this time' as conflict_details
  FROM appointments a
  WHERE a.service_id = p_service_id
    AND a.id != COALESCE(p_appointment_id, a.id)
    AND a.status NOT IN ('cancelled', 'no_show')
    AND (
      (a.start_time <= p_start_time AND a.end_time > p_start_time)
      OR (a.start_time < p_end_time AND a.end_time >= p_end_time)
      OR (a.start_time >= p_start_time AND a.end_time <= p_end_time)
    );
END;
$$;

-- Função para obter estatísticas de agendamento
CREATE OR REPLACE FUNCTION get_appointment_stats(
  p_business_id UUID
) RETURNS TABLE (
  totalAppointments BIGINT,
  totalRevenue DECIMAL,
  averageAppointmentValue DECIMAL,
  completionRate DECIMAL,
  cancellationRate DECIMAL,
  noShowRate DECIMAL,
  mostPopularService UUID,
  mostPopularProfessional UUID,
  busiestDay TEXT,
  busiestTime TEXT
) LANGUAGE plpgsql AS $$
DECLARE
  v_total BIGINT;
  v_completed BIGINT;
  v_cancelled BIGINT;
  v_no_show BIGINT;
BEGIN
  -- Total de agendamentos
  SELECT COUNT(*) INTO v_total
  FROM appointments
  WHERE business_id = p_business_id;

  -- Agendamentos completados
  SELECT COUNT(*) INTO v_completed
  FROM appointments
  WHERE business_id = p_business_id
    AND status = 'completed';

  -- Agendamentos cancelados
  SELECT COUNT(*) INTO v_cancelled
  FROM appointments
  WHERE business_id = p_business_id
    AND status = 'cancelled';

  -- Agendamentos no-show
  SELECT COUNT(*) INTO v_no_show
  FROM appointments
  WHERE business_id = p_business_id
    AND status = 'no_show';

  RETURN QUERY
  SELECT
    v_total as totalAppointments,
    COALESCE(SUM(price), 0) as totalRevenue,
    CASE WHEN v_total > 0 THEN COALESCE(SUM(price), 0) / v_total ELSE 0 END as averageAppointmentValue,
    CASE WHEN v_total > 0 THEN v_completed::DECIMAL / v_total ELSE 0 END as completionRate,
    CASE WHEN v_total > 0 THEN v_cancelled::DECIMAL / v_total ELSE 0 END as cancellationRate,
    CASE WHEN v_total > 0 THEN v_no_show::DECIMAL / v_total ELSE 0 END as noShowRate,
    (
      SELECT service_id
      FROM appointments
      WHERE business_id = p_business_id
      GROUP BY service_id
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as mostPopularService,
    (
      SELECT professional_id
      FROM appointments
      WHERE business_id = p_business_id
      GROUP BY professional_id
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as mostPopularProfessional,
    (
      SELECT to_char(start_time, 'day')
      FROM appointments
      WHERE business_id = p_business_id
      GROUP BY to_char(start_time, 'day')
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as busiestDay,
    (
      SELECT to_char(start_time, 'HH24:00')
      FROM appointments
      WHERE business_id = p_business_id
      GROUP BY to_char(start_time, 'HH24:00')
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as busiestTime
  FROM appointments
  WHERE business_id = p_business_id;
END;
$$; 