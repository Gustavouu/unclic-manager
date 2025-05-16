# Análise de Infraestrutura

## 1. Serviços

### 1.1 Supabase
```typescript
// Exemplo de configuração do Supabase
const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  options: {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
};

// Exemplo de cliente Supabase
const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.key,
  supabaseConfig.options
);
```

### 1.2 Edge Functions
```typescript
// Exemplo de Edge Function
export const createAppointment = async (req: Request) => {
  const { business_id, client_id, service_id, date } = await req.json();
  
  // Validar dados
  const validation = validateAppointment({
    business_id,
    client_id,
    service_id,
    date
  });
  
  if (!validation.isValid) {
    return new Response(
      JSON.stringify({ error: validation.errors }),
      { status: 400 }
    );
  }
  
  // Criar agendamento
  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      business_id,
      client_id,
      service_id,
      date,
      status: 'scheduled'
    }])
    .select()
    .single();
    
  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
  
  // Notificar cliente
  await notifyClient(data);
  
  return new Response(
    JSON.stringify({ data }),
    { status: 201 }
  );
};
```

### 1.3 Storage
```typescript
// Exemplo de configuração do Storage
const storageConfig = {
  bucket: 'business-assets',
  options: {
    cacheControl: '3600',
    upsert: false
  }
};

// Exemplo de upload
const uploadFile = async (file: File) => {
  const { data, error } = await supabase
    .storage
    .from(storageConfig.bucket)
    .upload(
      `${Date.now()}-${file.name}`,
      file,
      storageConfig.options
    );
    
  if (error) throw error;
  return data;
};

// Exemplo de download
const downloadFile = async (path: string) => {
  const { data, error } = await supabase
    .storage
    .from(storageConfig.bucket)
    .download(path);
    
  if (error) throw error;
  return data;
};
```

## 2. Banco de Dados

### 2.1 Schema
```sql
-- Exemplo de schema
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id),
  client_id UUID REFERENCES clients(id),
  service_id UUID REFERENCES services(id),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_appointments_business_id ON appointments(business_id);
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_date ON appointments(date);
```

### 2.2 Políticas
```sql
-- Exemplo de políticas RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios negócios"
  ON businesses
  FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Usuários podem criar seus próprios negócios"
  ON businesses
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Usuários podem atualizar seus próprios negócios"
  ON businesses
  FOR UPDATE
  USING (auth.uid() = owner_id);

-- Políticas para agendamentos
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver agendamentos de seus negócios"
  ON appointments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = appointments.business_id
      AND businesses.owner_id = auth.uid()
    )
  );
```

## 3. Cache

### 3.1 Redis
```typescript
// Exemplo de configuração do Redis
const redisConfig = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.NODE_ENV === 'production'
};

// Exemplo de cliente Redis
const redis = new Redis(redisConfig);

// Exemplo de cache
const cache = {
  get: async (key: string) => {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },
  
  set: async (key: string, value: any, ttl?: number) => {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await redis.set(key, stringValue, 'EX', ttl);
    } else {
      await redis.set(key, stringValue);
    }
  },
  
  del: async (key: string) => {
    await redis.del(key);
  }
};
```

### 3.2 Estratégias
```typescript
// Exemplo de estratégias de cache
const cacheStrategies = {
  // Cache de negócios
  business: {
    key: (id: string) => `business:${id}`,
    ttl: 3600, // 1 hora
    
    get: async (id: string) => {
      const key = cacheStrategies.business.key(id);
      return cache.get(key);
    },
    
    set: async (business: any) => {
      const key = cacheStrategies.business.key(business.id);
      await cache.set(key, business, cacheStrategies.business.ttl);
    }
  },
  
  // Cache de agendamentos
  appointments: {
    key: (businessId: string, date: string) =>
      `appointments:${businessId}:${date}`,
    ttl: 300, // 5 minutos
    
    get: async (businessId: string, date: string) => {
      const key = cacheStrategies.appointments.key(businessId, date);
      return cache.get(key);
    },
    
    set: async (businessId: string, date: string, appointments: any[]) => {
      const key = cacheStrategies.appointments.key(businessId, date);
      await cache.set(key, appointments, cacheStrategies.appointments.ttl);
    }
  }
};
```

## 4. Monitoramento

### 4.1 Métricas
```typescript
// Exemplo de coleta de métricas
const metrics = {
  // Métricas de HTTP
  http: {
    requests: new Counter({
      name: 'http_requests_total',
      help: 'Total de requisições HTTP',
      labelNames: ['method', 'path', 'status']
    }),
    
    duration: new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duração das requisições HTTP',
      labelNames: ['method', 'path']
    })
  },
  
  // Métricas de negócio
  business: {
    appointments: new Counter({
      name: 'appointments_total',
      help: 'Total de agendamentos',
      labelNames: ['business_id', 'status']
    }),
    
    revenue: new Counter({
      name: 'revenue_total',
      help: 'Receita total',
      labelNames: ['business_id']
    })
  }
};

// Exemplo de middleware de métricas
const metricsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    metrics.http.requests.inc({
      method: req.method,
      path: req.path,
      status: res.statusCode
    });
    
    metrics.http.duration.observe(
      { method: req.method, path: req.path },
      duration / 1000
    );
  });
  
  next();
};
```

### 4.2 Logs
```typescript
// Exemplo de configuração de logs
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'combined.log'
    })
  ]
});

// Exemplo de middleware de logs
const loggingMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  logger.info('Requisição recebida', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  
  next();
};
```

## 5. Plano de Ação

### 5.1 Curto Prazo
1. Configurar serviços
2. Implementar cache
3. Configurar monitoramento
4. Documentar infraestrutura

### 5.2 Médio Prazo
1. Otimizar performance
2. Melhorar segurança
3. Implementar backup
4. Refatorar código

### 5.3 Longo Prazo
1. Escalar infraestrutura
2. Melhorar resiliência
3. Adicionar recursos
4. Otimizar custos

## 6. Conclusão

A infraestrutura é um componente fundamental do UnCliC Manager. Os serviços e configurações implementados visam garantir um sistema robusto, seguro e escalável.

O plano de ação estabelecido permitirá evoluir continuamente a infraestrutura, garantindo que o sistema continue eficiente e confiável mesmo com o crescimento da base de usuários. 