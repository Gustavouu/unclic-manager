-- Função para obter estatísticas do profissional
CREATE OR REPLACE FUNCTION get_professional_stats(
  p_professional_id UUID
) RETURNS TABLE (
  totalAppointments BIGINT,
  completedAppointments BIGINT,
  cancelledAppointments BIGINT,
  noShowAppointments BIGINT,
  averageRating DECIMAL,
  totalRevenue DECIMAL,
  mostPopularService UUID,
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
  WHERE professional_id = p_professional_id;

  -- Agendamentos completados
  SELECT COUNT(*) INTO v_completed
  FROM appointments
  WHERE professional_id = p_professional_id
    AND status = 'completed';

  -- Agendamentos cancelados
  SELECT COUNT(*) INTO v_cancelled
  FROM appointments
  WHERE professional_id = p_professional_id
    AND status = 'cancelled';

  -- Agendamentos no-show
  SELECT COUNT(*) INTO v_no_show
  FROM appointments
  WHERE professional_id = p_professional_id
    AND status = 'no_show';

  RETURN QUERY
  SELECT
    v_total as totalAppointments,
    v_completed as completedAppointments,
    v_cancelled as cancelledAppointments,
    v_no_show as noShowAppointments,
    (SELECT rating FROM professionals WHERE id = p_professional_id) as averageRating,
    COALESCE(SUM(price), 0) as totalRevenue,
    (
      SELECT service_id
      FROM appointments
      WHERE professional_id = p_professional_id
      GROUP BY service_id
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as mostPopularService,
    (
      SELECT to_char(start_time, 'day')
      FROM appointments
      WHERE professional_id = p_professional_id
      GROUP BY to_char(start_time, 'day')
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as busiestDay,
    (
      SELECT to_char(start_time, 'HH24:00')
      FROM appointments
      WHERE professional_id = p_professional_id
      GROUP BY to_char(start_time, 'HH24:00')
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as busiestTime
  FROM appointments
  WHERE professional_id = p_professional_id;
END;
$$; 