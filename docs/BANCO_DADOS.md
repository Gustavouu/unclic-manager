# Análise de Banco de Dados

## 1. Schema

### 1.1 Tabelas Principais
```sql
-- Exemplo de schema
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id),
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id),
  client_id UUID REFERENCES clients(id),
  professional_id UUID REFERENCES professionals(id),
  service_id UUID REFERENCES services(id),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.2 Índices
```sql
-- Exemplo de índices
CREATE INDEX idx_businesses_owner ON businesses(owner_id);
CREATE INDEX idx_clients_business ON clients(business_id);
CREATE INDEX idx_professionals_business ON professionals(business_id);
CREATE INDEX idx_services_business ON services(business_id);
CREATE INDEX idx_appointments_business ON appointments(business_id);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_professional ON appointments(professional_id);
CREATE INDEX idx_appointments_service ON appointments(service_id);
CREATE INDEX idx_appointments_date ON appointments(date);
```

## 2. Políticas de Segurança

### 2.1 RLS (Row Level Security)
```sql
-- Exemplo de políticas RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Políticas para businesses
CREATE POLICY "Users can view their own businesses"
  ON businesses FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can update their own businesses"
  ON businesses FOR UPDATE
  USING (auth.uid() = owner_id);

-- Políticas para clients
CREATE POLICY "Users can view clients of their businesses"
  ON clients FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses
      WHERE owner_id = auth.uid()
    )
  );
```

### 2.2 Funções de Segurança
```sql
-- Exemplo de funções de segurança
CREATE OR REPLACE FUNCTION check_business_access(business_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM businesses
    WHERE id = business_id
    AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 3. Otimização

### 3.1 Queries Otimizadas
```sql
-- Exemplo de query otimizada
SELECT 
  a.id,
  a.date,
  c.name as client_name,
  p.name as professional_name,
  s.name as service_name,
  s.price
FROM appointments a
JOIN clients c ON a.client_id = c.id
JOIN professionals p ON a.professional_id = p.id
JOIN services s ON a.service_id = s.id
WHERE a.business_id = $1
AND a.date >= $2
AND a.date <= $3
ORDER BY a.date;
```

### 3.2 Particionamento
```sql
-- Exemplo de particionamento
CREATE TABLE appointments_partitioned (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id),
  client_id UUID REFERENCES clients(id),
  professional_id UUID REFERENCES professionals(id),
  service_id UUID REFERENCES services(id),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) PARTITION BY RANGE (date);

CREATE TABLE appointments_y2024m01 PARTITION OF appointments_partitioned
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

## 4. Backup e Recuperação

### 4.1 Backup
```sql
-- Exemplo de script de backup
CREATE OR REPLACE FUNCTION backup_database()
RETURNS void AS $$
BEGIN
  -- Backup do banco de dados
  PERFORM pg_dump(
    'unclic',
    '--format=custom',
    '--file=/backups/unclic_$(date +%Y%m%d_%H%M%S).backup'
  );
  
  -- Limpeza de backups antigos
  PERFORM pg_cleanup_old_backups('/backups', 7);
END;
$$ LANGUAGE plpgsql;
```

### 4.2 Recuperação
```sql
-- Exemplo de script de recuperação
CREATE OR REPLACE FUNCTION recover_database(backup_file TEXT)
RETURNS void AS $$
BEGIN
  -- Recuperação do banco de dados
  PERFORM pg_restore(
    'unclic',
    backup_file,
    '--clean',
    '--if-exists'
  );
  
  -- Verificação de integridade
  PERFORM verify_database_integrity();
END;
$$ LANGUAGE plpgsql;
```

## 5. Monitoramento

### 5.1 Métricas
```sql
-- Exemplo de coleta de métricas
CREATE OR REPLACE FUNCTION collect_database_metrics()
RETURNS TABLE (
  metric_name TEXT,
  metric_value NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    'active_connections'::TEXT,
    COUNT(*)::NUMERIC
  FROM pg_stat_activity
  WHERE state = 'active'
  
  UNION ALL
  
  SELECT
    'cache_hit_ratio'::TEXT,
    (SUM(heap_blks_hit) / (SUM(heap_blks_hit) + SUM(heap_blks_read)))::NUMERIC
  FROM pg_statio_user_tables;
END;
$$ LANGUAGE plpgsql;
```

### 5.2 Logs
```sql
-- Exemplo de configuração de logs
ALTER SYSTEM SET log_min_duration_statement = '1000';
ALTER SYSTEM SET log_checkpoints = on;
ALTER SYSTEM SET log_connections = on;
ALTER SYSTEM SET log_disconnections = on;
ALTER SYSTEM SET log_lock_waits = on;
ALTER SYSTEM SET log_temp_files = 0;
```

## 6. Manutenção

### 6.1 VACUUM
```sql
-- Exemplo de script de manutenção
CREATE OR REPLACE FUNCTION maintenance_vacuum()
RETURNS void AS $$
BEGIN
  -- VACUUM ANALYZE em todas as tabelas
  PERFORM vacuum_analyze_all_tables();
  
  -- VACUUM FULL em tabelas específicas
  PERFORM vacuum_full_table('appointments');
  PERFORM vacuum_full_table('clients');
  
  -- Atualização de estatísticas
  PERFORM analyze_all_tables();
END;
$$ LANGUAGE plpgsql;
```

### 6.2 Reindex
```sql
-- Exemplo de script de reindex
CREATE OR REPLACE FUNCTION maintenance_reindex()
RETURNS void AS $$
BEGIN
  -- Reindex em todos os índices
  PERFORM reindex_all_indexes();
  
  -- Reindex em índices específicos
  PERFORM reindex_index('idx_appointments_date');
  PERFORM reindex_index('idx_clients_business');
END;
$$ LANGUAGE plpgsql;
```

## 7. Plano de Melhorias

### 7.1 Curto Prazo
1. Otimizar índices
2. Implementar particionamento
3. Melhorar queries
4. Configurar backup

### 7.2 Médio Prazo
1. Implementar replicação
2. Melhorar segurança
3. Otimizar performance
4. Implementar monitoramento

### 7.3 Longo Prazo
1. Implementar sharding
2. Melhorar escalabilidade
3. Implementar DR
4. Otimizar custos

## 8. Conclusão

O banco de dados é um componente crítico do UnCliC Manager. O schema e as políticas implementadas visam garantir a integridade, segurança e performance dos dados.

O plano de melhorias estabelecido permitirá evoluir continuamente a estrutura e os processos do banco de dados, garantindo que ele continue atendendo às necessidades do sistema de forma eficiente e segura. 