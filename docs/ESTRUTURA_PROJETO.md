# Estrutura do Projeto UnCliC Manager

## 1. Visão Geral da Estrutura

```
unclic-manager/
├── src/                    # Código fonte principal
│   ├── components/         # Componentes React
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Bibliotecas e utilitários
│   ├── pages/             # Páginas da aplicação
│   ├── services/          # Serviços e integrações
│   ├── styles/            # Estilos globais
│   └── types/             # Definições de tipos TypeScript
├── public/                # Arquivos estáticos
├── docs/                  # Documentação
├── scripts/               # Scripts utilitários
├── supabase/              # Configurações do Supabase
├── __tests__/            # Testes
└── config/               # Arquivos de configuração
```

## 2. Dependências Principais

### 2.1 Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "@supabase/supabase-js": "^2.x",
    "tailwindcss": "^3.x",
    "@radix-ui/react-*": "^1.x",
    "zustand": "^4.x",
    "date-fns": "^2.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vite": "^4.x",
    "vitest": "^0.x",
    "@testing-library/react": "^14.x",
    "eslint": "^8.x",
    "prettier": "^3.x"
  }
}
```

### 2.2 Backend (Supabase)
- PostgreSQL 15
- Edge Functions
- Storage
- Auth
- Realtime

## 3. Componentes Principais

### 3.1 Componentes de UI
- `Button`: Botão reutilizável com variantes
- `Input`: Campo de entrada com validação
- `Select`: Seleção com suporte a busca
- `Modal`: Modal reutilizável
- `Table`: Tabela com paginação e ordenação
- `Calendar`: Calendário para agendamentos
- `Form`: Formulários com validação

### 3.2 Componentes de Negócio
- `AppointmentForm`: Formulário de agendamento
- `ClientList`: Lista de clientes
- `ServiceCard`: Card de serviço
- `ProfessionalSchedule`: Agenda do profissional
- `BusinessDashboard`: Dashboard principal
- `FinancialReport`: Relatório financeiro

## 4. Serviços e Integrações

### 4.1 Serviços Locais
- `authService`: Gerenciamento de autenticação
- `businessService`: Operações de negócio
- `appointmentService`: Gestão de agendamentos
- `clientService`: Gestão de clientes
- `professionalService`: Gestão de profissionais
- `financialService`: Operações financeiras

### 4.2 Integrações Externas
- Supabase Auth
- Supabase Storage
- EFI Pay
- Google Calendar
- WhatsApp Business API

## 5. Hooks Customizados

### 5.1 Hooks de Estado
- `useAuth`: Gerenciamento de autenticação
- `useBusiness`: Contexto do negócio atual
- `useAppointments`: Gestão de agendamentos
- `useClients`: Gestão de clientes
- `useProfessionals`: Gestão de profissionais

### 5.2 Hooks de UI
- `useModal`: Gerenciamento de modais
- `useForm`: Formulários com validação
- `useToast`: Notificações toast
- `useLoading`: Estados de carregamento
- `usePagination`: Paginação de listas

## 6. Utilitários

### 6.1 Helpers
- `dateUtils`: Manipulação de datas
- `formatUtils`: Formatação de valores
- `validationUtils`: Validações comuns
- `storageUtils`: Manipulação de storage
- `apiUtils`: Helpers para chamadas de API

### 6.2 Configurações
- `apiConfig`: Configurações de API
- `themeConfig`: Configurações de tema
- `authConfig`: Configurações de autenticação
- `storageConfig`: Configurações de storage

## 7. Tipos e Interfaces

### 7.1 Tipos Principais
```typescript
interface Business {
  id: string;
  name: string;
  slug: string;
  // ...
}

interface User {
  id: string;
  email: string;
  role: UserRole;
  // ...
}

interface Appointment {
  id: string;
  clientId: string;
  professionalId: string;
  // ...
}
```

### 7.2 Enums
```typescript
enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  PROFESSIONAL = 'professional',
  STAFF = 'staff'
}

enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

## 8. Configurações de Ambiente

### 8.1 Variáveis de Ambiente
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=your-api-url
VITE_STORAGE_URL=your-storage-url
```

### 8.2 Configurações de Build
- Vite para desenvolvimento
- TypeScript para tipagem
- ESLint para linting
- Prettier para formatação
- Vitest para testes

## 9. Scripts Disponíveis

### 9.1 Desenvolvimento
```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build
```

### 9.2 Testes
```bash
npm run test       # Roda testes
npm run test:coverage  # Cobertura de testes
npm run test:watch # Testes em modo watch
```

### 9.3 Linting e Formatação
```bash
npm run lint       # Roda ESLint
npm run format     # Formata código
npm run type-check # Verifica tipos
```

## 10. Convenções e Padrões

### 10.1 Nomenclatura
- Componentes: PascalCase
- Hooks: camelCase com prefixo 'use'
- Utilitários: camelCase
- Tipos/Interfaces: PascalCase
- Arquivos: kebab-case

### 10.2 Estrutura de Arquivos
- Um componente por arquivo
- Testes junto ao componente
- Estilos com CSS Modules
- Tipos em arquivos separados

### 10.3 Padrões de Código
- Componentes funcionais
- Hooks para lógica
- Props tipadas
- Error boundaries
- Loading states

## 11. Considerações de Performance

### 11.1 Otimizações
- Code splitting
- Lazy loading
- Memoização
- Virtualização de listas
- Cache de queries

### 11.2 Monitoramento
- Error tracking
- Performance metrics
- User analytics
- API monitoring
- Resource usage

## 12. Conclusão

A estrutura do projeto UnCliC Manager foi projetada para ser:
- Modular e escalável
- Fácil de manter
- Bem documentada
- Segura e performática
- Preparada para crescimento

As convenções e padrões estabelecidos garantem consistência e qualidade do código, enquanto as ferramentas e configurações escolhidas fornecem uma base sólida para desenvolvimento. 