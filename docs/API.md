# Análise de API

## 1. Endpoints

### 1.1 Autenticação
```typescript
// Exemplo de endpoints de autenticação
const authEndpoints = {
  login: {
    method: 'POST',
    path: '/auth/login',
    body: {
      email: string,
      password: string
    },
    response: {
      token: string,
      user: User
    }
  },
  
  register: {
    method: 'POST',
    path: '/auth/register',
    body: {
      name: string,
      email: string,
      password: string
    },
    response: {
      token: string,
      user: User
    }
  },
  
  refresh: {
    method: 'POST',
    path: '/auth/refresh',
    body: {
      refreshToken: string
    },
    response: {
      token: string
    }
  }
};
```

### 1.2 Negócios
```typescript
// Exemplo de endpoints de negócios
const businessEndpoints = {
  create: {
    method: 'POST',
    path: '/businesses',
    body: {
      name: string,
      description: string,
      address: string
    },
    response: {
      id: string,
      name: string,
      // ...
    }
  },
  
  update: {
    method: 'PUT',
    path: '/businesses/:id',
    body: {
      name?: string,
      description?: string,
      address?: string
    },
    response: {
      id: string,
      name: string,
      // ...
    }
  },
  
  get: {
    method: 'GET',
    path: '/businesses/:id',
    response: {
      id: string,
      name: string,
      // ...
    }
  },
  
  list: {
    method: 'GET',
    path: '/businesses',
    query: {
      page?: number,
      limit?: number,
      search?: string
    },
    response: {
      data: Business[],
      total: number,
      page: number,
      limit: number
    }
  }
};
```

## 2. Validação

### 2.1 Schemas
```typescript
// Exemplo de schemas de validação
const schemas = {
  business: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 100
      },
      description: {
        type: 'string',
        maxLength: 500
      },
      address: {
        type: 'string',
        maxLength: 200
      }
    }
  },
  
  appointment: {
    type: 'object',
    required: ['clientId', 'professionalId', 'serviceId', 'date'],
    properties: {
      clientId: {
        type: 'string',
        format: 'uuid'
      },
      professionalId: {
        type: 'string',
        format: 'uuid'
      },
      serviceId: {
        type: 'string',
        format: 'uuid'
      },
      date: {
        type: 'string',
        format: 'date-time'
      }
    }
  }
};
```

### 2.2 Middleware
```typescript
// Exemplo de middleware de validação
const validateRequest = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors
      });
    }
  };
};

// Exemplo de uso
app.post('/businesses', validateRequest(schemas.business), createBusiness);
```

## 3. Autenticação

### 3.1 JWT
```typescript
// Exemplo de middleware de autenticação
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Authentication Error',
      message: 'Invalid token'
    });
  }
};

// Exemplo de uso
app.get('/businesses', authenticate, listBusinesses);
```

### 3.2 Rate Limiting
```typescript
// Exemplo de rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por windowMs
  message: {
    error: 'Too Many Requests',
    message: 'Please try again later'
  }
});

// Exemplo de uso
app.use('/api/', limiter);
```

## 4. Documentação

### 4.1 Swagger
```typescript
// Exemplo de configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UnCliC Manager API',
      version: '1.0.0',
      description: 'API para gerenciamento de negócios'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
```

### 4.2 Exemplos
```typescript
/**
 * @swagger
 * /businesses:
 *   post:
 *     summary: Cria um novo negócio
 *     tags: [Businesses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Business'
 *     responses:
 *       201:
 *         description: Negócio criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
```

## 5. Cache

### 5.1 Redis
```typescript
// Exemplo de configuração de cache
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD
});

// Exemplo de middleware de cache
const cache = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `cache:${req.originalUrl}`;
    const cachedResponse = await redis.get(key);
    
    if (cachedResponse) {
      return res.json(JSON.parse(cachedResponse));
    }
    
    res.sendResponse = res.json;
    res.json = (body: any) => {
      redis.setex(key, duration, JSON.stringify(body));
      return res.sendResponse(body);
    };
    
    next();
  };
};

// Exemplo de uso
app.get('/businesses', cache(300), listBusinesses);
```

### 5.2 Estratégias
```typescript
// Exemplo de estratégias de cache
const cacheStrategies = {
  // Cache por 5 minutos
  short: cache(300),
  
  // Cache por 1 hora
  medium: cache(3600),
  
  // Cache por 1 dia
  long: cache(86400),
  
  // Cache invalidation
  invalidate: async (pattern: string) => {
    const keys = await redis.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  }
};
```

## 6. Monitoramento

### 6.1 Métricas
```typescript
// Exemplo de coleta de métricas
const metrics = {
  requestCount: new Counter({
    name: 'http_requests_total',
    help: 'Total de requisições HTTP',
    labelNames: ['method', 'path', 'status']
  }),
  
  requestDuration: new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duração das requisições HTTP',
    labelNames: ['method', 'path']
  })
};

// Exemplo de middleware de métricas
const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    metrics.requestCount.inc({
      method: req.method,
      path: req.path,
      status: res.statusCode
    });
    
    metrics.requestDuration.observe({
      method: req.method,
      path: req.path
    }, duration / 1000);
  });
  
  next();
};
```

### 6.2 Logs
```typescript
// Exemplo de configuração de logs
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Exemplo de middleware de logs
const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info({
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    ip: req.ip
  });
  
  next();
};
```

## 7. Plano de Melhorias

### 7.1 Curto Prazo
1. Implementar validação
2. Melhorar autenticação
3. Adicionar cache
4. Configurar logs

### 7.2 Médio Prazo
1. Implementar rate limiting
2. Melhorar documentação
3. Adicionar métricas
4. Otimizar performance

### 7.3 Longo Prazo
1. Implementar versionamento
2. Melhorar segurança
3. Adicionar analytics
4. Otimizar escalabilidade

## 8. Conclusão

A API é um componente fundamental do UnCliC Manager. Os endpoints e processos implementados visam proporcionar uma interface robusta e segura para o sistema.

O plano de melhorias estabelecido permitirá evoluir continuamente a API, garantindo que ela continue atendendo às necessidades do sistema de forma eficiente e segura. 