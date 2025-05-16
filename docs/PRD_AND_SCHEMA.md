# Documentação do PRD e Schema Prisma

## 1. Visão Geral do Produto

### 1.1 Sumário Executivo
O UnCliC Manager é uma plataforma web SaaS completa para gestão de negócios baseados em serviços agendados. A plataforma oferece um conjunto abrangente de ferramentas para gerenciamento de agendamentos, clientes, profissionais, serviços, estoque, finanças e relatórios analíticos em uma interface moderna e intuitiva.

### 1.2 Escopo do Produto
- Solução end-to-end para todo o ciclo operacional de negócios de serviços
- Processo de onboarding simplificado
- Gestão diária das operações
- Sistema de agendamentos online
- Controle financeiro integrado
- Análises de desempenho

### 1.3 Objetivos do Produto
- Facilitar a digitalização de negócios de serviços
- Centralizar operações em uma única plataforma
- Reduzir complexidade operacional
- Aumentar produtividade através de automação
- Melhorar experiência do cliente
- Fornecer insights de negócio
- Simplificar gestão financeira

## 2. Público-Alvo e Segmentos

### 2.1 Usuários Primários
1. Proprietários de estabelecimentos
2. Gerentes e administradores
3. Recepcionistas e atendentes
4. Profissionais/prestadores de serviço
5. Contadores/financeiros

### 2.2 Segmentos de Mercado
1. Beleza e estética
2. Saúde e bem-estar
3. Serviços pessoais
4. Outros serviços agendados

## 3. Arquitetura Técnica

### 3.1 Frontend
- React com TypeScript
- Vite como build tool
- Tailwind CSS para estilização
- shadcn/ui para componentes
- React Router para navegação

### 3.2 Backend
- Supabase como plataforma principal
- PostgreSQL para banco de dados
- Autenticação via Supabase Auth
- Row Level Security (RLS)
- Edge Functions para lógica de servidor

### 3.3 Armazenamento
- Supabase Storage para arquivos
- Suporte a uploads de imagens

## 4. Schema do Banco de Dados

### 4.1 Modelos Principais

#### Business (Negócio)
```prisma
model Business {
  id                  String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name                String
  slug                String    @unique
  adminEmail          String
  // ... outros campos
}
```

#### User (Usuário)
```prisma
model User {
  id            String    @id @db.Uuid
  email         String    @unique
  passwordHash  String?
  // ... outros campos
}
```

#### Professional (Profissional)
```prisma
model Professional {
  id                  String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  businessId          String    @db.Uuid
  name                String
  // ... outros campos
}
```

#### Client (Cliente)
```prisma
model Client {
  id                  String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  businessId          String    @db.Uuid
  name                String
  // ... outros campos
}
```

#### Service (Serviço)
```prisma
model Service {
  id                  String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  businessId          String    @db.Uuid
  name                String
  // ... outros campos
}
```

#### Appointment (Agendamento)
```prisma
model Appointment {
  id                  String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  businessId          String    @db.Uuid
  clientId            String    @db.Uuid
  // ... outros campos
}
```

### 4.2 Relacionamentos Principais

1. Business -> Users (N:N)
2. Business -> Professionals (1:N)
3. Business -> Clients (1:N)
4. Business -> Services (1:N)
5. Professional -> Services (N:N)
6. Client -> Appointments (1:N)
7. Service -> Appointments (N:N)

## 5. Políticas de Segurança

### 5.1 Row Level Security (RLS)
```sql
-- Exemplo de política RLS para Business
CREATE POLICY "Usuários podem ver negócios a que pertencem" 
ON public.businesses 
FOR SELECT 
USING (auth.uid() IN (
  SELECT user_id FROM public.business_users WHERE business_id = id
));
```

### 5.2 Funções de Utilidade
```sql
-- Função para verificar permissões
CREATE OR REPLACE FUNCTION public.user_has_permission(
  business_id uuid, 
  resource_name text, 
  action_name text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
  -- Implementação
$$;
```

## 6. APIs e Endpoints

### 6.1 Edge Functions
1. check-slug-availability
2. create-business
3. complete-business-setup
4. check-business-status
5. efipay-payment-handler
6. efipay-webhook

### 6.2 Chamadas Diretas ao Supabase
- CRUD de negócios
- CRUD de clientes
- CRUD de serviços
- CRUD de profissionais
- CRUD de agendamentos
- Operações financeiras
- Sistema de fidelidade

## 7. Considerações de Implementação

### 7.1 Multi-tenancy
- Isolamento de dados por business_id
- Middleware de tenant
- Contexto de tenant

### 7.2 Sistema de Permissões
- RBAC (Role-Based Access Control)
- Políticas RLS
- Verificação de permissões

### 7.3 Processamento de Pagamentos
- Integração com EFI Pay
- Webhooks de pagamento
- Atualização de transações

## 8. Próximos Passos

### 8.1 Prioridades Imediatas
1. Finalizar implementação do sistema de agendamentos
2. Completar integração com gateway de pagamento
3. Implementar sistema de notificações
4. Desenvolver relatórios e analytics

### 8.2 Melhorias Futuras
1. Aplicativo móvel nativo
2. Integrações com calendários externos
3. Sistema de marketing e fidelidade
4. Recursos de IA para insights

## 9. Conclusão

O UnCliC Manager é uma solução robusta e escalável para gestão de negócios baseados em agendamentos. A arquitetura escolhida permite uma implementação segura e eficiente, com suporte a multi-tenancy e controle granular de permissões.

O schema do banco de dados foi projetado para suportar todas as funcionalidades necessárias, com relacionamentos bem definidos e políticas de segurança apropriadas. A documentação do PRD e do schema serve como guia para o desenvolvimento contínuo e evolução do produto. 