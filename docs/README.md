# Documentação do UnCliC Manager

![UnCliC Manager](https://lovable.dev/projects/e8f2341b-e418-4013-abc5-6be07f0520f4)

## Sumário

- [Introdução](#introdução)
- [Arquitetura](#arquitetura)
  - [Tecnologias](#tecnologias)
  - [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Autenticação](#autenticação)
- [Integração com Supabase](#integração-com-supabase)
- [Fluxo de Onboarding](#fluxo-de-onboarding)
- [Sistema de Componentes](#sistema-de-componentes)
- [Rotas e Navegação](#rotas-e-navegação)
- [Serviços](#serviços)
- [Gestão de Estado](#gestão-de-estado)
- [Processamento de Pagamentos](#processamento-de-pagamentos)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Desenvolvimento Local](#desenvolvimento-local)
- [Implantação](#implantação)

## Introdução

O UnCliC Manager é uma aplicação web para gestão completa de negócios de serviços, como salões de beleza, barbearias, consultórios e outros estabelecimentos que trabalham com agendamentos de serviços. A plataforma oferece recursos para gerenciamento de:

- Agendamentos e reservas
- Cadastro e gestão de clientes
- Cadastro de serviços e profissionais
- Controle de estoque
- Gestão financeira
- Processamento de pagamentos
- Relatórios e análises de desempenho
- Configurações personalizadas

O sistema possui um fluxo de onboarding intuitivo para facilitar a configuração inicial do negócio, e uma interface de administração completa para a gestão diária das operações.

## Arquitetura

### Tecnologias

O projeto utiliza as seguintes tecnologias principais:

- **Frontend**:
  - [React](https://reactjs.org/) - Biblioteca para construção de interfaces
  - [TypeScript](https://www.typescriptlang.org/) - Superset tipado de JavaScript
  - [Vite](https://vitejs.dev/) - Ferramenta de build e desenvolvimento
  - [React Router DOM](https://reactrouter.com/) - Roteamento e navegação
  - [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
  - [shadcn/ui](https://ui.shadcn.com/) - Conjunto de componentes reutilizáveis
  - [Lucide React](https://lucide.dev/) - Biblioteca de ícones
  - [React Hook Form](https://react-hook-form.com/) - Gerenciamento de formulários
  - [Zod](https://zod.dev/) - Validação de esquemas e tipos
  - [date-fns](https://date-fns.org/) - Manipulação de datas
  - [React Query](https://tanstack.com/query/latest) - Gerenciamento de estado de dados remotos

- **Backend**:
  - [Supabase](https://supabase.com/) - Plataforma de backend com banco de dados, autenticação e armazenamento

### Estrutura de Diretórios

A estrutura principal do projeto é organizada da seguinte forma:

```
src/
  ├── components/         # Componentes reutilizáveis
  │   ├── admin/          # Componentes da área administrativa
  │   ├── appointments/   # Componentes de agendamentos
  │   ├── auth/           # Componentes de autenticação
  │   ├── clients/        # Componentes de gestão de clientes
  │   ├── common/         # Componentes comuns e utilitários
  │   ├── dashboard/      # Componentes do dashboard
  │   ├── finance/        # Componentes financeiros
  │   ├── inventory/      # Componentes de estoque
  │   ├── layout/         # Componentes de layout (sidebar, header)
  │   ├── onboarding/     # Componentes do fluxo de onboarding
  │   ├── payment/        # Componentes de pagamento
  │   ├── professionals/  # Componentes de gestão de profissionais
  │   ├── reports/        # Componentes de relatórios
  │   ├── services/       # Componentes de serviços
  │   ├── settings/       # Componentes de configurações
  │   ├── sidebar/        # Componentes da barra lateral
  │   ├── ui/             # Componentes de UI básicos (shadcn)
  │   └── website/        # Componentes de site público
  │
  ├── contexts/           # Contextos React para gerenciamento de estado
  │   └── onboarding/     # Contexto do fluxo de onboarding
  │
  ├── hooks/              # Hooks personalizados
  │   ├── useAuth.tsx     # Hook de autenticação
  │   └── ...
  │
  ├── integrations/       # Integrações com serviços externos
  │   └── supabase/       # Cliente e tipos do Supabase
  │
  ├── lib/                # Bibliotecas e utilitários
  │   └── utils.ts        # Funções utilitárias
  │
  ├── pages/              # Páginas principais da aplicação
  │   ├── auth/           # Páginas de autenticação
  │   └── ...
  │
  ├── services/           # Serviços da aplicação
  │   └── payment/        # Serviços de pagamento
  │
  ├── utils/              # Utilitários gerais
  │
  ├── App.tsx             # Componente principal com definição de rotas
  ├── main.tsx            # Ponto de entrada da aplicação
  └── vite-env.d.ts       # Definições de tipos para o Vite
```

## Autenticação

A autenticação é implementada usando o Supabase Auth, com suporte para:

- Login com email/senha
- Cadastro de novos usuários
- Recuperação de senha
- Persistência de sessão

O sistema também possui um modo de demonstração para facilitar testes, que pode ser ativado através da variável de ambiente `VITE_ENABLE_DEMO_MODE`.

Exemplo de uso do hook de autenticação:

```tsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, login, logout, signup, loading } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // Usuário autenticado com sucesso
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  return (
    <div>
      {user ? (
        <button onClick={logout}>Sair</button>
      ) : (
        <button onClick={() => handleLogin("email@exemplo.com", "senha")}>
          Entrar
        </button>
      )}
    </div>
  );
}
```

## Integração com Supabase

O projeto utiliza o Supabase como backend, fornecendo:

1. **Banco de dados PostgreSQL** - Para armazenamento de dados
2. **Sistema de autenticação** - Para gerenciamento de usuários
3. **Storage** - Para armazenamento de arquivos (imagens, documentos)
4. **Funções de borda** - Para lógica do lado do servidor

A integração é configurada através de variáveis de ambiente:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

Cliente Supabase:

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "URL_PADRAO";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "CHAVE_PADRAO";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
```

## Fluxo de Onboarding

O sistema possui um fluxo de onboarding para configuração inicial do negócio, dividido em etapas:

1. **Informações do Negócio** - Nome, endereço, contato
2. **Serviços Oferecidos** - Cadastro de serviços com preços e durações
3. **Profissionais** - Cadastro de profissionais e suas especialidades
4. **Horário de Funcionamento** - Configuração de dias e horários de atendimento

O estado deste fluxo é gerenciado pelo contexto de onboarding (`OnboardingContext`), que fornece:

- Gerenciamento de estado para cada etapa
- Persistência de dados entre sessões (localStorage)
- Validação de dados
- Funções para manipular os dados de cada seção

O onboarding implementa um sistema de persistência sofisticado, com capacidade de lidar com upload de arquivos, convertendo-os para base64 para armazenamento local e restaurando-os quando necessário.

## Sistema de Componentes

A interface do usuário utiliza o [shadcn/ui](https://ui.shadcn.com/) como base para componentes, customizados com Tailwind CSS.

Os componentes são organizados em categorias funcionais:

- **Componentes de Layout** - Estrutura visual da aplicação
- **Componentes de UI** - Elementos básicos como botões, inputs, etc.
- **Componentes de Negócio** - Específicos para cada área funcional

Exemplo de componente de layout:

```tsx
// src/components/layout/AppLayout.tsx
export const AppLayout = ({ children, breadcrumb }: AppLayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <main className="flex-1 flex flex-col ml-16 md:ml-60 h-screen overflow-hidden">
        <Header breadcrumb={breadcrumb} />
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
```

## Rotas e Navegação

O roteamento da aplicação é implementado usando React Router DOM, com rotas protegidas que exigem autenticação.

Principais categorias de rotas:

1. **Rotas Públicas** - Acessíveis a todos (landing page, login, cadastro)
2. **Rotas de Onboarding** - Para configuração inicial do negócio
3. **Rotas Protegidas** - Requerem autenticação (dashboard, gestão)

Exemplo de definição de rotas:

```tsx
// src/App.tsx (simplificado)
function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="unclic-theme">
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Index />} />
        
        {/* Onboarding Routes */}
        <Route path="/onboarding" element={
          <OnboardingProvider>
            <Onboarding />
          </OnboardingProvider>
        } />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </RequireAuth>
          }
        />
        
        {/* Mais rotas protegidas... */}
      </Routes>
    </ThemeProvider>
  );
}
```

## Serviços

### Serviço de Pagamento

O sistema inclui um serviço de processamento de pagamentos que integra com provedores de pagamento. A implementação atual suporta o provedor "Efi Bank", com capacidade para adicionar outros provedores.

Funcionalidades:

- Criação de transações de pagamento
- Verificação de status de pagamentos
- Processamento de callbacks e webhooks
- Suporte a múltiplos métodos de pagamento

Exemplo de uso:

```typescript
import { PaymentService } from "@/services/payment/paymentService";

// Criar um novo pagamento
const paymentResponse = await PaymentService.createPayment({
  amount: 150.00,
  businessId: "123456",
  customerId: "cust_123",
  serviceId: "serv_456",
  appointmentId: "appt_789",
  paymentMethod: "credit_card",
  description: "Corte de cabelo"
});

// Verificar status de um pagamento
const status = await PaymentService.getPaymentStatus(paymentResponse.id);
```

## Gestão de Estado

A aplicação utiliza diferentes estratégias para gerenciamento de estado:

1. **React Context** - Para estado global ou compartilhado entre componentes
   - Exemplo: `AuthContext`, `OnboardingContext`

2. **React Query** - Para estado de dados remotos e operações de API
   - Gerencia cache, revalidação e estados de loading/error

3. **React useState/useReducer** - Para estado local de componentes

4. **LocalStorage** - Para persistência entre sessões
   - Implementado no fluxo de onboarding e autenticação

## Processamento de Pagamentos

O sistema implementa um fluxo completo de processamento de pagamentos:

1. **Criação de Transação** - Registra a transação no banco de dados
2. **Integração com Gateway** - Comunica com o gateway de pagamento (Efi Bank)
3. **Redirecionamento** - Gera URLs para checkout
4. **Verificação de Status** - Consulta e atualiza o status do pagamento
5. **Webhooks** - Recebe notificações de mudanças de status

O serviço possui modo de teste e produção, controlado por configuração.

## Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configuração:

```
# Supabase
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# API
VITE_API_URL=http://localhost:3000/api

# Modo de desenvolvimento
VITE_ENV=development
VITE_ENABLE_DEMO_MODE=true
```

Para desenvolvimento local, crie um arquivo `.env` ou `.env.local` na raiz do projeto com estas variáveis.

## Desenvolvimento Local

Para configurar o ambiente de desenvolvimento:

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd unclic-manager
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env.local` com as variáveis necessárias

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse a aplicação em [http://localhost:5173](http://localhost:5173)

## Implantação

O projeto pode ser implantado usando vários métodos:

1. **Lovable.dev**
   - Acesse [https://lovable.dev/projects/e8f2341b-e418-4013-abc5-6be07f0520f4](https://lovable.dev/projects/e8f2341b-e418-4013-abc5-6be07f0520f4)
   - Clique em Share -> Publish

2. **Netlify ou Vercel**
   - Configure as variáveis de ambiente necessárias no painel de controle
   - Conecte ao repositório Git
   - Configure o comando de build: `npm run build`
   - Configure o diretório de saída: `dist`

3. **Deploy Manual**
   - Execute `npm run build` para gerar os arquivos estáticos
   - Implante o conteúdo da pasta `dist` em qualquer servidor web estático

Para domínios personalizados, recomenda-se usar o Netlify conforme documentado em [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/). 