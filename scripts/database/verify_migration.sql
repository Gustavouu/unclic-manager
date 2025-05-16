-- Verificar contagem de registros
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'businesses', COUNT(*) FROM businesses
UNION ALL
SELECT 'clients', COUNT(*) FROM clients
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'professionals', COUNT(*) FROM professionals
UNION ALL
SELECT 'professional_schedules', COUNT(*) FROM professional_schedules
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'business_settings', COUNT(*) FROM business_settings;

-- Verificar integridade referencial
SELECT 'users' as table_name, COUNT(*) as invalid_records
FROM users u
LEFT JOIN businesses b ON u.business_id = b.id
WHERE b.id IS NULL
UNION ALL
SELECT 'clients', COUNT(*)
FROM clients c
LEFT JOIN businesses b ON c.business_id = b.id
WHERE b.id IS NULL
UNION ALL
SELECT 'services', COUNT(*)
FROM services s
LEFT JOIN businesses b ON s.business_id = b.id
WHERE b.id IS NULL
UNION ALL
SELECT 'professionals', COUNT(*)
FROM professionals p
LEFT JOIN businesses b ON p.business_id = b.id
WHERE b.id IS NULL
UNION ALL
SELECT 'appointments', COUNT(*)
FROM appointments a
LEFT JOIN businesses b ON a.business_id = b.id
WHERE b.id IS NULL
UNION ALL
SELECT 'business_settings', COUNT(*)
FROM business_settings bs
LEFT JOIN businesses b ON bs.business_id = b.id
WHERE b.id IS NULL;

-- Verificar dados inválidos
SELECT 'users' as table_name, COUNT(*) as invalid_records
FROM users
WHERE email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
UNION ALL
SELECT 'businesses', COUNT(*)
FROM businesses
WHERE (email IS NOT NULL AND email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
   OR (phone IS NOT NULL AND phone !~ '^\+?[0-9]{10,15}$')
UNION ALL
SELECT 'clients', COUNT(*)
FROM clients
WHERE (email IS NOT NULL AND email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
   OR (phone IS NOT NULL AND phone !~ '^\+?[0-9]{10,15}$')
UNION ALL
SELECT 'professionals', COUNT(*)
FROM professionals
WHERE email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
   OR (phone IS NOT NULL AND phone !~ '^\+?[0-9]{10,15}$');

-- Verificar agendamentos inválidos
SELECT COUNT(*) as invalid_appointments
FROM appointments a
LEFT JOIN clients c ON a.client_id = c.id
LEFT JOIN professionals p ON a.professional_id = p.id
LEFT JOIN services s ON a.service_id = s.id
WHERE c.id IS NULL OR p.id IS NULL OR s.id IS NULL;

-- Verificar horários inválidos
SELECT COUNT(*) as invalid_schedules
FROM professional_schedules
WHERE start_time >= end_time;

-- Verificar configurações de negócio inválidas
SELECT COUNT(*) as invalid_settings
FROM business_settings
WHERE appointment_interval <= 0
   OR min_advance_time < 0
   OR max_advance_time <= 0;

-- Verificar índices
SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname; 