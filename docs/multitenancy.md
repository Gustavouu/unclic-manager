# Implementação de Multitenancy no UnCliC Manager

Este documento detalha a arquitetura e implementação do modelo multitenant (múltiplos inquilinos) no UnCliC Manager, utilizando o Supabase como provedor de banco de dados e autenticação.

## Sumário

- [Visão Geral](#visão-geral)
- [Modelo de Dados](#modelo-de-dados)
- [Isolamento de Dados](#isolamento-de-dados)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Fluxo de Criação de Tenant](#fluxo-de-criação-de-tenant)
- [Controle de Acesso](#controle-de-acesso)
- [Gerenciamento de Recursos](#gerenciamento-de-recursos)
- [Auditoria e Logs](#auditoria-e-logs)
- [Considerações de Performance](#considerações-de-performance)
- [Melhores Práticas](#melhores-práticas)
- [Exemplos de Implementação](#exemplos-de-implementação)

## Visão Geral

O UnCliC Manager é um sistema SaaS (Software as a Service) multitenancy, onde cada cliente (negócio) é um tenant separado. Utilizamos o modelo de banco de dados compartilhado com isolamento a nível de linha (Row Level Security), implementado através do Supabase PostgreSQL.

### Tipos de Multitenancy

O sistema adota um modelo híbrido de multitenancy:

1. **Banco de Dados Compartilhado**: Todos os tenants compartilham o mesmo banco de dados
2. **Isolamento a Nível de Linha**: Dados são filtrados automaticamente por tenant via políticas RLS
3. **Aplicação Compartilhada**: Todos os tenants utilizam a mesma instância da aplicação

## Modelo de Dados

O sistema é projetado com uma arquitetura focada em isolamento de dados por negócio:

### Entidade Principal: Negócio (Tenant)

```sql
CREATE TABLE public.negocios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  cnpj TEXT,
  email TEXT,
  telefone TEXT,
  endereco JSONB,
  logo_url TEXT,
  plano TEXT DEFAULT 'basico',
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'ativo',
  configuracoes JSONB DEFAULT '{}'::JSONB
);
```

### Usuários Vinculados a Negócios

```sql
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  id_negocio UUID REFERENCES public.negocios(id),
  funcao TEXT NOT NULL DEFAULT 'colaborador',
  ativo BOOLEAN DEFAULT TRUE,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultimo_login TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::JSONB
);
```

### Todas as Tabelas com Referência ao Negócio

Cada tabela de dados do sistema inclui uma referência ao negócio, permitindo filtragem por tenant:

```sql
-- Exemplo genérico de tabela com referência ao tenant
CREATE TABLE public.tabela_exemplo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_negocio UUID NOT NULL REFERENCES public.negocios(id),
  -- outros campos específicos
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Isolamento de Dados

O isolamento entre tenants é implementado usando Row Level Security (RLS) do PostgreSQL:

### Política Base para Todas as Tabelas

Todas as tabelas possuem uma política RLS semelhante que restringe o acesso apenas a dados do negócio do usuário:

```sql
-- Política genérica aplicada a cada tabela
CREATE POLICY "Isolamento por negócio" 
ON public.tabela_exemplo
USING (
  id_negocio IN (
    SELECT id_negocio 
    FROM public.usuarios 
    WHERE auth.uid() = id
  )
);
```

### Funções Auxiliares

Para facilitar a verificação de acesso, implementamos funções utilitárias:

```sql
-- Verifica se o usuário pertence a um determinado negócio
CREATE OR REPLACE FUNCTION auth.pertence_ao_negocio(id_negocio_verificar UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.usuarios 
    WHERE auth.uid() = id AND id_negocio = id_negocio_verificar
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Arquitetura do Sistema

A arquitetura de multitenancy do UnCliC Manager se baseia em três pilares:

### 1. Modelo de Dados Tenant-aware

Cada tabela inclui uma referência ao tenant (id_negocio), permitindo separação natural dos dados.

### 2. Autenticação e Autorização

Combinamos autenticação Supabase Auth com autorização baseada em funções e políticas RLS.

### 3. Contexto de Tenant na Aplicação

A aplicação mantém e utiliza o contexto do tenant atual:

```typescript
// Hook para gerenciar contexto de tenant
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

const TenantContext = createContext(null);

export function TenantProvider({ children }) {
  const { user } = useAuth();
  const [currentTenant, setCurrentTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTenant() {
      if (!user) {
        setCurrentTenant(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('id_negocio, negocios(id, nome, plano, configuracoes)')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setCurrentTenant(data.negocios);
      } catch (error) {
        console.error('Erro ao carregar tenant:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTenant();
  }, [user]);

  return (
    <TenantContext.Provider value={{ currentTenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => useContext(TenantContext);
```

## Fluxo de Criação de Tenant

O processo de criação de um novo tenant segue estas etapas:

1. **Cadastro Inicial**: Usuário se registra no sistema
2. **Criação do Negócio**: Sistema cria um novo registro na tabela `negocios`
3. **Vinculação de Usuário**: Usuário é associado ao negócio como administrador
4. **Configuração Inicial**: Sistema cria registros iniciais para o funcionamento básico
5. **Personalização**: Usuário administrador completa o perfil do negócio

### Implementação

```typescript
// Exemplo de função para criar um novo tenant
async function criarNovoTenant(userData) {
  try {
    // 1. Criar usuário na autenticação
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });
    
    if (authError) throw authError;
    
    // 2. Criar o negócio (tenant)
    const { data: negocio, error: negocioError } = await supabase
      .from('negocios')
      .insert([{
        nome: userData.nomeBusiness,
        cnpj: userData.cnpj,
        email: userData.emailBusiness,
        telefone: userData.telefone,
        plano: 'basico'
      }])
      .select()
      .single();
    
    if (negocioError) throw negocioError;
    
    // 3. Vincular usuário ao negócio como administrador
    const { error: usuarioError } = await supabase
      .from('usuarios')
      .insert([{
        id: authData.user.id,
        nome: userData.nome,
        email: userData.email,
        id_negocio: negocio.id,
        funcao: 'admin'
      }]);
    
    if (usuarioError) throw usuarioError;
    
    // 4. Criar configurações iniciais para o tenant
    await criarConfiguracoesPadrao(negocio.id);
    
    return { success: true, negocioId: negocio.id };
  } catch (error) {
    console.error('Erro ao criar tenant:', error);
    return { success: false, error };
  }
}

// Configurações iniciais para o tenant
async function criarConfiguracoesPadrao(idNegocio) {
  // Criar categorias padrão
  await supabase
    .from('categorias')
    .insert([
      { nome: 'Geral', id_negocio: idNegocio },
      { nome: 'Serviços', id_negocio: idNegocio },
      { nome: 'Produtos', id_negocio: idNegocio }
    ]);
  
  // Criar status padrão para agendamentos
  await supabase
    .from('status_agendamento')
    .insert([
      { nome: 'Agendado', cor: '#3498db', id_negocio: idNegocio },
      { nome: 'Concluído', cor: '#2ecc71', id_negocio: idNegocio },
      { nome: 'Cancelado', cor: '#e74c3c', id_negocio: idNegocio }
    ]);
  
  // Outras configurações iniciais...
}
```

## Controle de Acesso

O sistema implementa controle de acesso em múltiplas camadas:

### 1. Nível de Autenticação

Utilizamos o Supabase Auth para autenticação de usuários.

### 2. Nível de Autorização por Função

Cada usuário possui uma função dentro do negócio, que determina suas permissões:

- **admin**: Acesso total ao tenant, incluindo configurações e usuários
- **gerente**: Acesso a maior parte das funcionalidades, exceto configurações avançadas
- **colaborador**: Acesso limitado a operações do dia-a-dia
- **visualizador**: Acesso somente leitura

### 3. Nível de Banco de Dados (RLS)

Políticas RLS garantem isolamento estrito entre tenants, mesmo em caso de falhas na aplicação.

### Implementação de Verificação de Permissões

```typescript
// Hook para verificação de permissões
export function usePermissions() {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    async function loadUserRole() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('funcao')
        .eq('id', user.id)
        .single();
      
      if (!error) {
        setUserRole(data.funcao);
      }
    }
    
    loadUserRole();
  }, [user]);
  
  // Verificar se usuário tem determinada permissão
  const hasPermission = (requiredPermission) => {
    if (!userRole) return false;
    
    const permissionHierarchy = {
      'super_admin': 100,
      'admin': 80,
      'gerente': 60,
      'colaborador': 40,
      'visualizador': 20
    };
    
    const permissionLevels = {
      'gerenciar_usuarios': 80,
      'configurar_negocio': 80,
      'gerenciar_financeiro': 60,
      'gerenciar_agendamentos': 40,
      'visualizar_relatorios': 20
    };
    
    return permissionHierarchy[userRole] >= permissionLevels[requiredPermission];
  };
  
  return { userRole, hasPermission };
}
```

## Gerenciamento de Recursos

O sistema controla e limita recursos por tenant com base no plano contratado:

### Limites de Recursos por Plano

```typescript
const planoLimites = {
  'gratuito': {
    maxClientes: 50,
    maxAgendamentosMes: 100,
    maxArmazenamentoMB: 100,
    maxUsuarios: 2,
    funcionalidadesAvancadas: false
  },
  'basico': {
    maxClientes: 500,
    maxAgendamentosMes: 1000,
    maxArmazenamentoMB: 1000,
    maxUsuarios: 5,
    funcionalidadesAvancadas: false
  },
  'profissional': {
    maxClientes: 2000,
    maxAgendamentosMes: 5000,
    maxArmazenamentoMB: 5000,
    maxUsuarios: 10,
    funcionalidadesAvancadas: true
  },
  'enterprise': {
    maxClientes: Infinity,
    maxAgendamentosMes: Infinity,
    maxArmazenamentoMB: 20000,
    maxUsuarios: 30,
    funcionalidadesAvancadas: true
  }
};
```

### Verificação de Limites

```typescript
// Hook para verificar limites do plano
export function usePlanLimits() {
  const { currentTenant } = useTenant();
  
  const checkLimit = async (resourceType) => {
    if (!currentTenant) return { withinLimit: false, current: 0, limit: 0 };
    
    const plano = currentTenant.plano || 'basico';
    const limite = planoLimites[plano][resourceType];
    
    let current = 0;
    
    // Verificar consumo atual do recurso
    switch (resourceType) {
      case 'maxClientes':
        const { count: clientCount } = await supabase
          .from('clientes')
          .select('*', { count: 'exact', head: true })
          .eq('id_negocio', currentTenant.id);
        current = clientCount;
        break;
      
      case 'maxUsuarios':
        const { count: userCount } = await supabase
          .from('usuarios')
          .select('*', { count: 'exact', head: true })
          .eq('id_negocio', currentTenant.id);
        current = userCount;
        break;
      
      // Outros tipos de recursos...
    }
    
    return {
      withinLimit: current < limite,
      current,
      limit: limite
    };
  };
  
  return { checkLimit, planName: currentTenant?.plano };
}
```

## Auditoria e Logs

O sistema mantém registro de atividades importantes para fins de auditoria e conformidade:

### Tabela de Auditoria

```sql
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_negocio UUID NOT NULL REFERENCES public.negocios(id),
  id_usuario UUID REFERENCES auth.users,
  acao TEXT NOT NULL,
  tabela TEXT,
  id_registro UUID,
  dados_antigos JSONB,
  dados_novos JSONB,
  ip_address TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Política de RLS para visualização
CREATE POLICY "Admins visualizam logs do próprio negócio"
ON public.audit_logs
FOR SELECT
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = id AND funcao = 'admin'
  )
);
```

### Funções para Registro de Auditoria

```sql
-- Função para registrar ações de auditoria
CREATE OR REPLACE FUNCTION public.registrar_auditoria(
  p_acao TEXT,
  p_tabela TEXT,
  p_id_registro UUID,
  p_dados_antigos JSONB DEFAULT NULL,
  p_dados_novos JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_id_negocio UUID;
  v_id_log UUID;
BEGIN
  -- Obter id_negocio do usuário atual
  SELECT id_negocio INTO v_id_negocio
  FROM public.usuarios
  WHERE id = auth.uid();
  
  -- Inserir registro de auditoria
  INSERT INTO public.audit_logs(
    id_negocio,
    id_usuario,
    acao,
    tabela,
    id_registro,
    dados_antigos,
    dados_novos,
    ip_address
  )
  VALUES (
    v_id_negocio,
    auth.uid(),
    p_acao,
    p_tabela,
    p_id_registro,
    p_dados_antigos,
    p_dados_novos,
    current_setting('request.headers')::json->>'x-forwarded-for'
  )
  RETURNING id INTO v_id_log;
  
  RETURN v_id_log;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Considerações de Performance

Em um sistema multitenant, considerações de performance são críticas:

### Otimizações Implementadas

1. **Indexação de Colunas de Tenant**

```sql
-- Adicionar índices para id_negocio em cada tabela
CREATE INDEX idx_clientes_id_negocio ON public.clientes(id_negocio);
CREATE INDEX idx_agendamentos_id_negocio ON public.agendamentos(id_negocio);
CREATE INDEX idx_servicos_id_negocio ON public.servicos(id_negocio);
-- ...outros índices
```

2. **Particionamento Lógico (Opcional para tenants muito grandes)**

```sql
-- Particionamento por tenant para tabelas com alto volume
CREATE TABLE public.transacoes_particionada (
  id UUID NOT NULL,
  id_negocio UUID NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_transacao TIMESTAMP WITH TIME ZONE NOT NULL,
  -- outros campos
  PRIMARY KEY (id_negocio, id)
) PARTITION BY LIST (id_negocio);

-- Criar partições para tenants específicos
CREATE TABLE transacoes_tenant_1 PARTITION OF transacoes_particionada
  FOR VALUES IN ('tenant-uuid-1');
```

3. **Otimização de Consultas**

```sql
-- Função que aproveita o contexto do tenant atual
CREATE OR REPLACE FUNCTION get_tenant_data(tabela text)
RETURNS SETOF RECORD AS $$
DECLARE
  v_id_negocio UUID;
  v_query text;
BEGIN
  -- Obter id_negocio do usuário atual (uma única vez)
  SELECT id_negocio INTO v_id_negocio
  FROM public.usuarios
  WHERE id = auth.uid();
  
  -- Construir consulta otimizada
  v_query := format('SELECT * FROM %I WHERE id_negocio = $1', tabela);
  
  -- Executar a consulta
  RETURN QUERY EXECUTE v_query USING v_id_negocio;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Melhores Práticas

Para manutenção eficiente do sistema multitenant, seguimos estas práticas:

1. **Isolamento rigoroso de dados**: Todas as tabelas têm RLS ativado e seguem o mesmo padrão
2. **Segurança em profundidade**: Verificações na aplicação e no banco de dados
3. **Monitoramento de Performance**: Alertas para queries lentas por tenant
4. **Migrações de banco sem interrupção**: Atualizações de esquema seguras
5. **Backups por tenant**: Permitir restauração granular de um único tenant

## Exemplos de Implementação

### Criação de Tenant Completo 

Exemplo de implementação completa para criar um novo tenant:

```typescript
import { supabase } from '../lib/supabase';

export async function createNewTenant(tenantData, userData) {
  // Iniciar transação
  const { error: transactionError } = await supabase.rpc('begin_transaction');
  if (transactionError) throw transactionError;
  
  try {
    // 1. Criar usuário na autenticação
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });
    
    if (authError) throw authError;
    
    // 2. Criar o negócio (tenant)
    const { data: negocio, error: negocioError } = await supabase
      .from('negocios')
      .insert([{
        nome: tenantData.nome,
        cnpj: tenantData.cnpj,
        email: tenantData.email,
        telefone: tenantData.telefone,
        endereco: tenantData.endereco,
        plano: tenantData.plano || 'basico'
      }])
      .select()
      .single();
    
    if (negocioError) throw negocioError;
    
    // 3. Vincular usuário ao negócio como administrador
    const { error: usuarioError } = await supabase
      .from('usuarios')
      .insert([{
        id: authData.user.id,
        nome: userData.nome,
        email: userData.email,
        id_negocio: negocio.id,
        funcao: 'admin'
      }]);
    
    if (usuarioError) throw usuarioError;
    
    // 4. Criar configurações iniciais para o tenant
    await setupInitialTenantData(negocio.id);
    
    // 5. Registrar ação de auditoria
    await supabase.rpc('registrar_auditoria', {
      p_acao: 'criar_tenant',
      p_tabela: 'negocios',
      p_id_registro: negocio.id,
      p_dados_novos: negocio
    });
    
    // Confirmar transação
    await supabase.rpc('commit_transaction');
    
    return { success: true, tenantId: negocio.id };
  } catch (error) {
    // Reverter transação em caso de erro
    await supabase.rpc('rollback_transaction');
    console.error('Erro ao criar tenant:', error);
    return { success: false, error };
  }
}

// Configurar dados iniciais do tenant
async function setupInitialTenantData(tenantId) {
  // Criar categorias padrão
  await supabase
    .from('categorias')
    .insert([
      { nome: 'Serviços', id_negocio: tenantId, cor: '#3498db' },
      { nome: 'Produtos', id_negocio: tenantId, cor: '#2ecc71' },
      { nome: 'Despesas', id_negocio: tenantId, cor: '#e74c3c' }
    ]);
  
  // Criar formas de pagamento padrão
  await supabase
    .from('formas_pagamento')
    .insert([
      { nome: 'Dinheiro', id_negocio: tenantId, ativo: true },
      { nome: 'Cartão de Crédito', id_negocio: tenantId, ativo: true },
      { nome: 'Cartão de Débito', id_negocio: tenantId, ativo: true },
      { nome: 'PIX', id_negocio: tenantId, ativo: true }
    ]);
  
  // Criar status de agendamento padrão
  await supabase
    .from('status_agendamento')
    .insert([
      { nome: 'Agendado', id_negocio: tenantId, cor: '#3498db' },
      { nome: 'Confirmado', id_negocio: tenantId, cor: '#2ecc71' },
      { nome: 'Em Andamento', id_negocio: tenantId, cor: '#f39c12' },
      { nome: 'Concluído', id_negocio: tenantId, cor: '#27ae60' },
      { nome: 'Cancelado', id_negocio: tenantId, cor: '#e74c3c' }
    ]);
}
```

### Componente de Seleção de Tenant

Para usuários que pertencem a múltiplos tenants:

```tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export function TenantSelector() {
  const { user } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState(null);
  
  useEffect(() => {
    async function loadUserTenants() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select(`
            negocios (
              id,
              nome,
              logo_url,
              plano
            )
          `)
          .eq('id', user.id);
        
        if (error) throw error;
        
        const tenantList = data.map(item => item.negocios).filter(Boolean);
        setTenants(tenantList);
        
        // Carregar tenant selecionado do localStorage
        const savedTenantId = localStorage.getItem('currentTenantId');
        if (savedTenantId) {
          const found = tenantList.find(t => t.id === savedTenantId);
          if (found) setSelectedTenant(found);
        } else if (tenantList.length > 0) {
          // Selecionar primeiro tenant por padrão
          setSelectedTenant(tenantList[0]);
          localStorage.setItem('currentTenantId', tenantList[0].id);
        }
      } catch (error) {
        console.error('Erro ao carregar tenants:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserTenants();
  }, [user]);
  
  const handleTenantChange = (tenant) => {
    setSelectedTenant(tenant);
    localStorage.setItem('currentTenantId', tenant.id);
    // Recarregar a página para atualizar o contexto
    window.location.reload();
  };
  
  if (loading) return <div>Carregando...</div>;
  
  if (tenants.length <= 1) return null;
  
  return (
    <div className="tenant-selector">
      <div className="dropdown">
        <button className="tenant-button">
          {selectedTenant ? (
            <>
              {selectedTenant.logo_url ? (
                <img 
                  src={selectedTenant.logo_url} 
                  alt={selectedTenant.nome} 
                  className="tenant-logo"
                />
              ) : (
                <div className="tenant-initials">
                  {selectedTenant.nome.substring(0, 2).toUpperCase()}
                </div>
              )}
              <span>{selectedTenant.nome}</span>
            </>
          ) : (
            'Selecione um negócio'
          )}
        </button>
        
        <div className="dropdown-content">
          {tenants.map(tenant => (
            <a 
              key={tenant.id} 
              onClick={() => handleTenantChange(tenant)}
              className={selectedTenant?.id === tenant.id ? 'active' : ''}
            >
              {tenant.logo_url ? (
                <img 
                  src={tenant.logo_url} 
                  alt={tenant.nome} 
                  className="tenant-logo"
                />
              ) : (
                <div className="tenant-initials">
                  {tenant.nome.substring(0, 2).toUpperCase()}
                </div>
              )}
              <span>{tenant.nome}</span>
              <span className="plan-badge">{tenant.plano}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
``` 