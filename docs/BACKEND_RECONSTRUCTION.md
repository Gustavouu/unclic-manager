# Reconstrução do Backend - UnCliC Manager

## 1. Análise da Estrutura Atual

### 1.1 Tabelas do Banco de Dados
```sql
-- Tabelas Principais
businesses
users
business_users
professionals
clients
services
appointments
loyalty_transactions
webhook_events
financial_transactions
stock_movements
```

### 1.2 Edge Functions
```typescript
// Funções Existentes
check-slug-availability
create-business
complete-business-setup
check-business-status
efipay-payment-handler
efipay-webhook
send-appointment-reminders
```

### 1.3 Endpoints Diretos (Supabase)
```typescript
// Operações CRUD
businesses: {
  create: 'POST /businesses',
  read: 'GET /businesses/:id',
  update: 'PUT /businesses/:id',
  delete: 'DELETE /businesses/:id',
  list: 'GET /businesses'
}

// Relacionamentos
business_users: {
  create: 'POST /business_users',
  read: 'GET /business_users/:id',
  update: 'PUT /business_users/:id',
  delete: 'DELETE /business_users/:id',
  list: 'GET /business_users'
}

// Outras operações
loyalty_transactions: {
  create: 'POST /loyalty_transactions',
  list: 'GET /loyalty_transactions'
}

webhook_events: {
  create: 'POST /webhook_events',
  list: 'GET /webhook_events'
}

financial_transactions: {
  create: 'POST /financial_transactions',
  list: 'GET /financial_transactions'
}

stock_movements: {
  create: 'POST /stock_movements',
  list: 'GET /stock_movements'
}
```

## 2. Problemas Identificados

### 2.1 Banco de Dados
1. **RLS Policies**
   - Políticas incompletas ou mal configuradas
   - Falta de validação em algumas operações
   - Problemas de permissão no onboarding

2. **Schema**
   - Inconsistência de nomenclatura
   - Falta de índices otimizados
   - Relacionamentos não bem definidos

3. **Performance**
   - Queries não otimizadas
   - Falta de cache
   - Problemas de escalabilidade

### 2.2 Edge Functions
1. **Estrutura**
   - Código duplicado
   - Falta de padronização
   - Tratamento de erros inconsistente

2. **Segurança**
   - Validação insuficiente
   - Falta de rate limiting
   - Logging inadequado

3. **Manutenção**
   - Falta de testes
   - Documentação incompleta
   - Versionamento não definido

## 3. Plano de Reconstrução

### 3.1 Fase 1: Banco de Dados
```sql
-- 1. Revisão e Otimização do Schema
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  admin_email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  address_number TEXT,
  address_complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  logo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Índices Otimizados
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_created_at ON businesses(created_at);

-- 3. RLS Policies
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Businesses are viewable by authenticated users"
ON businesses FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Businesses are insertable by authenticated users"
ON businesses FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Businesses are updatable by business owners"
ON businesses FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT business_id 
    FROM business_users 
    WHERE user_id = auth.uid() 
    AND role = 'owner'
  )
);

CREATE POLICY "Businesses are deletable by business owners"
ON businesses FOR DELETE
TO authenticated
USING (
  id IN (
    SELECT business_id 
    FROM business_users 
    WHERE user_id = auth.uid() 
    AND role = 'owner'
  )
);
```

### 3.2 Fase 2: Edge Functions
```typescript
// 1. Estrutura Padronizada
interface EdgeFunctionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    timestamp: string;
    requestId: string;
    duration: number;
  };
}

// 2. Middleware de Validação
const validateRequest = (schema: any) => {
  return async (req: Request) => {
    try {
      const body = await req.json();
      await schema.validate(body);
      return body;
    } catch (error) {
      throw new Error(`Validation Error: ${error.message}`);
    }
  };
};

// 3. Middleware de Logging
const logRequest = async (req: Request, fn: Function) => {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  
  try {
    const result = await fn(req);
    console.log({
      requestId,
      method: req.method,
      path: req.url,
      duration: Date.now() - start,
      status: 'success'
    });
    return result;
  } catch (error) {
    console.error({
      requestId,
      method: req.method,
      path: req.url,
      duration: Date.now() - start,
      status: 'error',
      error: error.message
    });
    throw error;
  }
};
```

### 3.3 Fase 3: Cache e Performance
```typescript
// 1. Estratégia de Cache
interface CacheConfig {
  ttl: number;
  staleWhileRevalidate: boolean;
  maxSize: number;
}

const cacheConfig: Record<string, CacheConfig> = {
  businesses: {
    ttl: 5 * 60 * 1000, // 5 minutos
    staleWhileRevalidate: true,
    maxSize: 1000
  },
  services: {
    ttl: 15 * 60 * 1000, // 15 minutos
    staleWhileRevalidate: true,
    maxSize: 5000
  }
};

// 2. Implementação de Cache
class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, any>;
  
  private constructor() {
    this.cache = new Map();
  }
  
  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }
  
  public async get<T>(key: string): Promise<T | null> {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  public set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl
    });
  }
}
```

### 3.4 Fase 4: Monitoramento
```typescript
// 1. Métricas
interface Metrics {
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
  cacheHitRate: number;
}

// 2. Logging
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  metadata: Record<string, any>;
}

// 3. Alertas
interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  threshold: number;
  currentValue: number;
}
```

## 4. Próximos Passos

### 4.1 Implementação
1. Criar scripts de migração
2. Implementar novas RLS policies
3. Refatorar Edge Functions
4. Implementar sistema de cache
5. Configurar monitoramento

### 4.2 Testes
1. Testes unitários
2. Testes de integração
3. Testes de carga
4. Testes de segurança

### 4.3 Documentação
1. Documentar APIs
2. Criar guias de uso
3. Documentar processos
4. Atualizar diagramas

## 5. Cronograma

### 5.1 Semana 1
- Análise e documentação
- Criação de scripts de migração
- Implementação de RLS policies

### 5.2 Semana 2
- Refatoração de Edge Functions
- Implementação de cache
- Configuração de monitoramento

### 5.3 Semana 3
- Testes e correções
- Documentação
- Deploy em staging

### 5.4 Semana 4
- Testes em produção
- Monitoramento
- Ajustes finais 