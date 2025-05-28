-- Função para obter estatísticas do serviço
CREATE OR REPLACE FUNCTION get_service_stats(
  p_service_id UUID
) RETURNS TABLE (
  totalAppointments BIGINT,
  totalRevenue DECIMAL,
  averagePrice DECIMAL,
  mostPopularProfessional UUID,
  busiestDay TEXT,
  busiestTime TEXT
) LANGUAGE plpgsql AS $$
DECLARE
  v_total BIGINT;
  v_revenue DECIMAL;
  v_avg_price DECIMAL;
BEGIN
  -- Total de agendamentos
  SELECT COUNT(*) INTO v_total
  FROM appointments
  WHERE service_id = p_service_id;

  -- Receita total
  SELECT COALESCE(SUM(price), 0) INTO v_revenue
  FROM appointments
  WHERE service_id = p_service_id;

  -- Preço médio
  SELECT COALESCE(AVG(price), 0) INTO v_avg_price
  FROM appointments
  WHERE service_id = p_service_id;

  RETURN QUERY
  SELECT
    v_total as totalAppointments,
    v_revenue as totalRevenue,
    v_avg_price as averagePrice,
    (
      SELECT professional_id
      FROM appointments
      WHERE service_id = p_service_id
      GROUP BY professional_id
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as mostPopularProfessional,
    (
      SELECT to_char(start_time, 'day')
      FROM appointments
      WHERE service_id = p_service_id
      GROUP BY to_char(start_time, 'day')
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as busiestDay,
    (
      SELECT to_char(start_time, 'HH24:00')
      FROM appointments
      WHERE service_id = p_service_id
      GROUP BY to_char(start_time, 'HH24:00')
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as busiestTime
  FROM appointments
  WHERE service_id = p_service_id
  LIMIT 1;
END;
$$;

-- Função para obter estatísticas da categoria de serviço
CREATE OR REPLACE FUNCTION get_service_category_stats(
  p_category_id UUID
) RETURNS TABLE (
  totalServices BIGINT,
  totalAppointments BIGINT,
  totalRevenue DECIMAL,
  averagePrice DECIMAL,
  mostPopularService UUID,
  mostPopularProfessional UUID
) LANGUAGE plpgsql AS $$
DECLARE
  v_total_services BIGINT;
  v_total_appointments BIGINT;
  v_revenue DECIMAL;
  v_avg_price DECIMAL;
BEGIN
  -- Total de serviços
  SELECT COUNT(*) INTO v_total_services
  FROM services
  WHERE category = p_category_id;

  -- Total de agendamentos
  SELECT COUNT(*) INTO v_total_appointments
  FROM appointments a
  JOIN services s ON s.id = a.service_id
  WHERE s.category = p_category_id;

  -- Receita total
  SELECT COALESCE(SUM(a.price), 0) INTO v_revenue
  FROM appointments a
  JOIN services s ON s.id = a.service_id
  WHERE s.category = p_category_id;

  -- Preço médio
  SELECT COALESCE(AVG(a.price), 0) INTO v_avg_price
  FROM appointments a
  JOIN services s ON s.id = a.service_id
  WHERE s.category = p_category_id;

  RETURN QUERY
  SELECT
    v_total_services as totalServices,
    v_total_appointments as totalAppointments,
    v_revenue as totalRevenue,
    v_avg_price as averagePrice,
    (
      SELECT s.id
      FROM services s
      JOIN appointments a ON a.service_id = s.id
      WHERE s.category = p_category_id
      GROUP BY s.id
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as mostPopularService,
    (
      SELECT a.professional_id
      FROM appointments a
      JOIN services s ON s.id = a.service_id
      WHERE s.category = p_category_id
      GROUP BY a.professional_id
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as mostPopularProfessional
  FROM appointments a
  JOIN services s ON s.id = a.service_id
  WHERE s.category = p_category_id
  LIMIT 1;
END;
$$; 