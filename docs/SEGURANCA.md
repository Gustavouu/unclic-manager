# Análise de Segurança

## 1. Vulnerabilidades Identificadas

### 1.1 Frontend
```typescript
// Exemplo de vulnerabilidades no frontend
const vulnerabilities = {
  xss: {
    description: 'Cross-Site Scripting (XSS)',
    example: `
      // Vulnerável a XSS
      const userInput = '<script>alert("xss")</script>';
      element.innerHTML = userInput;
      
      // Correção
      const userInput = '<script>alert("xss")</script>';
      element.textContent = userInput;
    `
  },
  
  csrf: {
    description: 'Cross-Site Request Forgery (CSRF)',
    example: `
      // Vulnerável a CSRF
      fetch('/api/appointments', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      // Correção
      fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify(data)
      });
    `
  },
  
  sensitiveData: {
    description: 'Exposição de Dados Sensíveis',
    example: `
      // Vulnerável
      console.log(user.creditCard);
      
      // Correção
      console.log('****-****-****-' + user.creditCard.slice(-4));
    `
  }
};
```

### 1.2 Backend
```typescript
// Exemplo de vulnerabilidades no backend
const vulnerabilities = {
  sqlInjection: {
    description: 'SQL Injection',
    example: `
      // Vulnerável
      const query = \`SELECT * FROM users WHERE id = '\${userId}'\`;
      
      // Correção
      const query = 'SELECT * FROM users WHERE id = $1';
      const values = [userId];
    `
  },
  
  auth: {
    description: 'Falhas de Autenticação',
    example: `
      // Vulnerável
      if (user.role === 'admin') {
        // Acesso total
      }
      
      // Correção
      if (await hasPermission(user, 'admin:access')) {
        // Acesso controlado
      }
    `
  },
  
  api: {
    description: 'Exposição de API',
    example: `
      // Vulnerável
      app.get('/api/users', (req, res) => {
        res.json(users);
      });
      
      // Correção
      app.get('/api/users', authenticate, authorize('users:read'), (req, res) => {
        res.json(users);
      });
    `
  }
};
```

## 2. Medidas de Segurança Implementadas

### 2.1 Frontend
```typescript
// Exemplo de medidas de segurança no frontend
const securityMeasures = {
  inputSanitization: {
    description: 'Sanitização de Entrada',
    example: `
      const sanitizeInput = (input: string) => {
        return input
          .replace(/[<>]/g, '')
          .trim();
      };
      
      const userInput = sanitizeInput(rawInput);
    `
  },
  
  dataValidation: {
    description: 'Validação de Dados',
    example: `
      const validateAppointment = (data: AppointmentData) => {
        const errors = [];
        
        if (!data.clientId) {
          errors.push('Cliente é obrigatório');
        }
        
        if (!data.date) {
          errors.push('Data é obrigatória');
        }
        
        return errors;
      };
    `
  },
  
  secureStorage: {
    description: 'Armazenamento Seguro',
    example: `
      const secureStorage = {
        set: (key: string, value: any) => {
          const encrypted = encrypt(value);
          localStorage.setItem(key, encrypted);
        },
        
        get: (key: string) => {
          const encrypted = localStorage.getItem(key);
          return encrypted ? decrypt(encrypted) : null;
        }
      };
    `
  }
};
```

### 2.2 Backend
```typescript
// Exemplo de medidas de segurança no backend
const securityMeasures = {
  middleware: {
    description: 'Middleware de Segurança',
    example: `
      const securityMiddleware = [
        helmet(),
        cors({
          origin: process.env.ALLOWED_ORIGINS.split(','),
          methods: ['GET', 'POST', 'PUT', 'DELETE'],
          allowedHeaders: ['Content-Type', 'Authorization']
        }),
        rateLimit({
          windowMs: 15 * 60 * 1000,
          max: 100
        })
      ];
      
      app.use(securityMiddleware);
    `
  },
  
  tokenValidation: {
    description: 'Validação de Token',
    example: `
      const validateToken = async (token: string) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await getUser(decoded.id);
          
          if (!user || user.tokenVersion !== decoded.version) {
            throw new Error('Token inválido');
          }
          
          return user;
        } catch (error) {
          throw new Error('Token inválido');
        }
      };
    `
  },
  
  dataEncryption: {
    description: 'Criptografia de Dados',
    example: `
      const encrypt = (data: any) => {
        const cipher = crypto.createCipheriv(
          'aes-256-gcm',
          Buffer.from(process.env.ENCRYPTION_KEY, 'hex'),
          Buffer.from(process.env.ENCRYPTION_IV, 'hex')
        );
        
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        return {
          data: encrypted,
          tag: cipher.getAuthTag()
        };
      };
    `
  }
};
```

## 3. Políticas de Segurança

### 3.1 Autenticação
```typescript
// Exemplo de políticas de autenticação
const authPolicies = {
  mfa: {
    description: 'Autenticação Multi-Fator',
    example: `
      const enableMFA = async (userId: string) => {
        const secret = speakeasy.generateSecret();
        
        await db.users.update({
          where: { id: userId },
          data: {
            mfaSecret: secret.base32,
            mfaEnabled: true
          }
        });
        
        return secret.otpauth_url;
      };
    `
  },
  
  session: {
    description: 'Gerenciamento de Sessão',
    example: `
      const sessionConfig = {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: true,
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000 // 24 horas
        }
      };
    `
  },
  
  password: {
    description: 'Política de Senhas',
    example: `
      const passwordPolicy = {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90 * 24 * 60 * 60 * 1000 // 90 dias
      };
    `
  }
};
```

### 3.2 Autorização
```typescript
// Exemplo de políticas de autorização
const authPolicies = {
  rbac: {
    description: 'Controle de Acesso Baseado em Funções',
    example: `
      const roles = {
        admin: [
          'users:read',
          'users:write',
          'appointments:read',
          'appointments:write'
        ],
        professional: [
          'appointments:read',
          'appointments:write'
        ],
        client: [
          'appointments:read'
        ]
      };
    `
  },
  
  rls: {
    description: 'Políticas de Segurança em Nível de Linha',
    example: `
      const rlsPolicies = {
        appointments: `
          CREATE POLICY "Users can view their own appointments"
          ON appointments
          FOR SELECT
          USING (user_id = auth.uid());
          
          CREATE POLICY "Professionals can view their appointments"
          ON appointments
          FOR SELECT
          USING (professional_id = auth.uid());
        `
      };
    `
  }
};
```

## 4. Proteção de Dados

### 4.1 Criptografia
```typescript
// Exemplo de criptografia
const encryption = {
  inTransit: {
    description: 'Criptografia em Trânsito',
    example: `
      const httpsConfig = {
        key: fs.readFileSync('private.key'),
        cert: fs.readFileSync('certificate.crt'),
        ciphers: [
          'ECDHE-ECDSA-AES128-GCM-SHA256',
          'ECDHE-RSA-AES128-GCM-SHA256'
        ].join(':'),
        minVersion: 'TLSv1.2'
      };
    `
  },
  
  atRest: {
    description: 'Criptografia em Repouso',
    example: `
      const encryptData = (data: any) => {
        const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);
        const iv = crypto.randomBytes(16);
        
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        return {
          iv: iv.toString('hex'),
          data: encrypted,
          tag: cipher.getAuthTag()
        };
      };
    `
  }
};
```

### 4.2 Sanitização
```typescript
// Exemplo de sanitização
const sanitization = {
  input: {
    description: 'Sanitização de Entrada',
    example: `
      const sanitizeInput = (input: string) => {
        return input
          .replace(/[<>]/g, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+=/gi, '')
          .trim();
      };
    `
  },
  
  output: {
    description: 'Sanitização de Saída',
    example: `
      const sanitizeOutput = (data: any) => {
        if (typeof data === 'string') {
          return data
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        }
        
        if (Array.isArray(data)) {
          return data.map(sanitizeOutput);
        }
        
        if (typeof data === 'object' && data !== null) {
          return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key,
              sanitizeOutput(value)
            ])
          );
        }
        
        return data;
      };
    `
  }
};
```

## 5. Monitoramento de Segurança

### 5.1 Logs
```typescript
// Exemplo de logs de segurança
const securityLogs = {
  auth: {
    description: 'Logs de Autenticação',
    example: `
      const logAuth = (event: string, user: User, details: any) => {
        logger.info({
          type: 'auth',
          event,
          userId: user.id,
          ip: request.ip,
          userAgent: request.headers['user-agent'],
          details
        });
      };
    `
  },
  
  access: {
    description: 'Logs de Acesso',
    example: `
      const logAccess = (req: Request, res: Response) => {
        logger.info({
          type: 'access',
          method: req.method,
          path: req.path,
          userId: req.user?.id,
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          status: res.statusCode
        });
      };
    `
  }
};
```

### 5.2 Alertas
```typescript
// Exemplo de alertas de segurança
const securityAlerts = {
  suspicious: {
    description: 'Alertas de Atividade Suspeita',
    example: `
      const checkSuspiciousActivity = async (userId: string) => {
        const recentLogins = await db.logins.findMany({
          where: {
            userId,
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          }
        });
        
        if (recentLogins.length > 5) {
          await notifyAdmin({
            type: 'suspicious_activity',
            userId,
            details: {
              logins: recentLogins.length,
              locations: [...new Set(recentLogins.map(l => l.ip))]
            }
          });
        }
      };
    `
  },
  
  violations: {
    description: 'Alertas de Violações',
    example: `
      const checkPolicyViolations = async (userId: string, action: string) => {
        const violations = await db.violations.findMany({
          where: {
            userId,
            action,
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          }
        });
        
        if (violations.length > 3) {
          await notifyAdmin({
            type: 'policy_violation',
            userId,
            details: {
              action,
              violations: violations.length
            }
          });
        }
      };
    `
  }
};
```

## 6. Plano de Ação

### 6.1 Curto Prazo
1. Implementar autenticação
2. Adicionar validação
3. Configurar logs
4. Implementar criptografia

### 6.2 Médio Prazo
1. Melhorar autorização
2. Adicionar monitoramento
3. Implementar alertas
4. Otimizar segurança

### 6.3 Longo Prazo
1. Implementar MFA
2. Melhorar políticas
3. Adicionar auditoria
4. Otimizar compliance

## 7. Conclusão

A segurança é um componente fundamental do UnCliC Manager. As medidas implementadas visam proteger o sistema e os dados dos usuários.

O plano de ação estabelecido permitirá evoluir continuamente a segurança, garantindo que o sistema continue protegido contra ameaças e vulnerabilidades. 