# Sistema de Permissões e Autorização

Este documento detalha o sistema de permissões e autorização implementado no UnCliC Manager, que controla o acesso de usuários às funcionalidades e dados do sistema.

## Sumário

- [Visão Geral](#visão-geral)
- [Funções de Usuário](#funções-de-usuário)
- [Modelo de Permissões](#modelo-de-permissões)
- [Implementação no Frontend](#implementação-no-frontend)
- [Implementação no Backend](#implementação-no-backend)
- [Integração com Row Level Security](#integração-com-row-level-security)
- [Fluxo de Verificação de Permissões](#fluxo-de-verificação-de-permissões)
- [Modificação de Permissões](#modificação-de-permissões)
- [Permissões Dinâmicas](#permissões-dinâmicas)
- [Melhores Práticas](#melhores-práticas)
- [Exemplos de Implementação](#exemplos-de-implementação)

## Visão Geral

O UnCliC Manager implementa um sistema de permissões baseado em funções (RBAC - Role-Based Access Control), onde cada usuário possui uma função específica no sistema que define o conjunto de ações que ele pode realizar.

As permissões são implementadas em múltiplas camadas:

1. Interface do Usuário (UI): Controle de visibilidade de elementos e rotas
2. Lógica do Cliente (Frontend): Verificações antes de executar ações
3. Banco de Dados (Backend): Políticas RLS que impedem acesso não autorizado aos dados
4. API: Middleware que verifica permissões para ações específicas

## Funções de Usuário

O sistema define as seguintes funções básicas para usuários:

| Função | Descrição | Nível de Acesso |
|--------|-----------|----------------|
| `admin` | Administrador do negócio com acesso total | Alto |
| `gerente` | Gerencia operações diárias e usuários | Médio-Alto |
| `colaborador` | Executa tarefas operacionais regulares | Médio |
| `visualizador` | Acesso somente leitura ao sistema | Baixo |
| `parceiro` | Acesso externo limitado (API, portal cliente) | Específico |

As funções são armazenadas na tabela de usuários:

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

## Modelo de Permissões

O sistema define permissões específicas que são agrupadas por função:

### Mapeamento de Permissões por Função

```typescript
const permissoesPorFuncao = {
  admin: [
    'gerenciar_usuarios',
    'gerenciar_negocio',
    'gerenciar_financeiro',
    'gerenciar_servicos',
    'gerenciar_clientes',
    'gerenciar_agendamentos',
    'gerenciar_estoque',
    'visualizar_relatorios',
    'exportar_dados',
    'importar_dados',
    'configurar_sistema'
  ],
  
  gerente: [
    'visualizar_usuarios',
    'gerenciar_financeiro',
    'gerenciar_servicos',
    'gerenciar_clientes',
    'gerenciar_agendamentos',
    'gerenciar_estoque',
    'visualizar_relatorios',
    'exportar_dados'
  ],
  
  colaborador: [
    'gerenciar_clientes',
    'gerenciar_agendamentos',
    'visualizar_servicos',
    'visualizar_estoque',
    'visualizar_relatorios_basicos'
  ],
  
  visualizador: [
    'visualizar_clientes',
    'visualizar_agendamentos',
    'visualizar_servicos',
    'visualizar_relatorios_basicos'
  ],

  parceiro: [
    'api_agendamentos',
    'api_servicos',
    'api_cliente_proprio'
  ]
};
```

## Implementação no Frontend

### Hook de Permissões

O sistema utiliza um hook personalizado para verificar permissões no frontend:

```tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { useTenant } from './useTenant';

// Dados de permissões
const permissoesPorFuncao = {
  // ... mapeamento definido anteriormente
};

// Contexto de permissões
const PermissionContext = createContext<{
  hasPermission: (permissionKey: string) => boolean;
  userRole: string | null;
  isLoading: boolean;
}>({
  hasPermission: () => false,
  userRole: null,
  isLoading: true
});

// Provider de permissões
export function PermissionProvider({ children }) {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserRole() {
      if (!user || !currentTenant) {
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      try {
        // Buscar função do usuário no banco de dados
        const { data, error } = await supabase
          .from('usuarios')
          .select('funcao')
          .eq('id', user.id)
          .eq('id_negocio', currentTenant.id)
          .single();

        if (error) throw error;
        setUserRole(data.funcao);
      } catch (error) {
        console.error('Erro ao carregar função do usuário:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserRole();
  }, [user, currentTenant]);

  // Função para verificar se o usuário tem uma determinada permissão
  const hasPermission = (permissionKey: string): boolean => {
    if (!userRole || isLoading) return false;
    
    // Verificar se a função do usuário tem a permissão solicitada
    const permissoesDisponiveisParaFuncao = permissoesPorFuncao[userRole] || [];
    return permissoesDisponiveisParaFuncao.includes(permissionKey);
  };

  return (
    <PermissionContext.Provider value={{ hasPermission, userRole, isLoading }}>
      {children}
    </PermissionContext.Provider>
  );
}

// Hook para usar permissões em componentes
export const usePermission = () => useContext(PermissionContext);
```

### Componente de Verificação de Permissão

Um componente de alto nível para controlar acesso a elementos da UI:

```tsx
import React from 'react';
import { usePermission } from '../hooks/usePermission';

interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({ 
  permission, 
  children, 
  fallback = null 
}: PermissionGateProps) {
  const { hasPermission, isLoading } = usePermission();
  
  if (isLoading) {
    return <div className="loading-indicator">Carregando...</div>;
  }
  
  if (hasPermission(permission)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}
```

### Controle de Rotas Protegidas

Proteção de rotas baseadas em permissões:

```tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePermission } from '../hooks/usePermission';
import { useAuth } from '../hooks/useAuth';

// Mapeamento de rotas para permissões necessárias
const rotasProtegidas = {
  '/admin/usuarios': 'gerenciar_usuarios',
  '/admin/configuracoes': 'configurar_sistema',
  '/financeiro': 'gerenciar_financeiro',
  '/relatorios/avancados': 'visualizar_relatorios',
  // ... outras rotas
};

export function RouteGuard({ children }) {
  const router = useRouter();
  const { hasPermission, isLoading } = usePermission();
  const { user, isLoading: authLoading } = useAuth();
  
  useEffect(() => {
    // Verificar se está carregando
    if (isLoading || authLoading) return;
    
    // Verificar se o usuário está autenticado
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Verificar se a rota atual requer permissão específica
    const currentPath = router.pathname;
    const requiredPermission = rotasProtegidas[currentPath];
    
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push('/acesso-negado');
    }
  }, [router.pathname, user, hasPermission, isLoading, authLoading]);
  
  return <>{children}</>;
}
```

## Implementação no Backend

### Políticas RLS Baseadas em Função

O sistema utiliza políticas Row Level Security (RLS) específicas por função:

```sql
-- Exemplo de política RLS para tabela de usuários
CREATE POLICY "Admins podem gerenciar todos os usuários do negócio"
ON public.usuarios
FOR ALL
USING (
  -- Verificar se o usuário atual é admin no mesmo negócio
  id_negocio IN (
    SELECT id_negocio FROM usuarios 
    WHERE auth.uid() = id AND funcao = 'admin'
  )
)
WITH CHECK (
  id_negocio IN (
    SELECT id_negocio FROM usuarios 
    WHERE auth.uid() = id AND funcao = 'admin'
  )
);

-- Gerentes podem visualizar (mas não editar) todos os usuários do negócio
CREATE POLICY "Gerentes podem visualizar todos os usuários do negócio"
ON public.usuarios
FOR SELECT
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios 
    WHERE auth.uid() = id AND funcao = 'gerente'
  )
);

-- Outros usuários só veem o próprio perfil
CREATE POLICY "Usuários visualizam apenas o próprio perfil"
ON public.usuarios
FOR SELECT
USING (
  id = auth.uid()
);
```

### Funções de Verificação de Permissão

Funções SQL para verificação centralizada de permissões:

```sql
-- Função para verificar se o usuário tem determinada função
CREATE OR REPLACE FUNCTION auth.usuario_tem_funcao(funcao_requerida TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.usuarios 
    WHERE auth.uid() = id AND funcao = funcao_requerida
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar permissão específica com base na função
CREATE OR REPLACE FUNCTION auth.usuario_tem_permissao(permissao_requerida TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  funcao_usuario TEXT;
BEGIN
  -- Obter função do usuário atual
  SELECT funcao INTO funcao_usuario
  FROM public.usuarios
  WHERE auth.uid() = id;
  
  -- Verificar permissão com base na função
  RETURN 
    (funcao_usuario = 'admin') OR
    (funcao_usuario = 'gerente' AND permissao_requerida IN (
      'visualizar_usuarios', 'gerenciar_financeiro', 'gerenciar_servicos',
      'gerenciar_clientes', 'gerenciar_agendamentos', 'gerenciar_estoque',
      'visualizar_relatorios', 'exportar_dados'
    )) OR
    (funcao_usuario = 'colaborador' AND permissao_requerida IN (
      'gerenciar_clientes', 'gerenciar_agendamentos', 'visualizar_servicos',
      'visualizar_estoque', 'visualizar_relatorios_basicos'
    )) OR
    (funcao_usuario = 'visualizador' AND permissao_requerida IN (
      'visualizar_clientes', 'visualizar_agendamentos', 'visualizar_servicos',
      'visualizar_relatorios_basicos'
    ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Integração com Row Level Security

As políticas RLS são integradas com o sistema de permissões por função:

### Políticas para Dados Sensíveis

```sql
-- Política para tabela de transações financeiras
CREATE POLICY "Políticas de acesso para transações financeiras"
ON public.transacoes
USING (
  -- Admins e gerentes podem ver todas as transações
  (
    id_negocio IN (
      SELECT id_negocio FROM usuarios 
      WHERE auth.uid() = id AND funcao IN ('admin', 'gerente')
    )
  ) OR
  -- Outros usuários não veem dados financeiros
  (
    FALSE
  )
)
WITH CHECK (
  -- Apenas admins e gerentes podem modificar dados financeiros
  id_negocio IN (
    SELECT id_negocio FROM usuarios 
    WHERE auth.uid() = id AND funcao IN ('admin', 'gerente')
  )
);
```

## Fluxo de Verificação de Permissões

O fluxo completo de verificação de permissões ocorre de forma hierárquica:

1. **Verificação na UI**: Renderização condicional com `<PermissionGate>`
2. **Verificação na Navegação**: Proteção de rotas com `RouteGuard`
3. **Verificação de Ações do Cliente**: Antes de fazer solicitações ao servidor
4. **Verificação nas API Routes**: Middlewares que verificam permissões
5. **Verificação no Banco de Dados**: Políticas RLS que aplicam as restrições de acesso

### Diagrama de Fluxo

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Verificação │    │  Verificação │    │  Verificação │    │  Verificação │
│     UI      │───▶│   Navegação  │───▶│    Ações    │───▶│     API     │
└─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                                │
                                                                ▼
                                                         ┌─────────────┐
                                                         │  Verificação │
                                                         │   Banco de   │
                                                         │    Dados     │
                                                         └─────────────┘
```

## Modificação de Permissões

O sistema permite a modificação de permissões somente por administradores:

### Interface de Gerenciamento de Funções

```tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { usePermission } from '../hooks/usePermission';
import { useTenant } from '../hooks/useTenant';

export function UserRoleManager() {
  const { hasPermission } = usePermission();
  const { currentTenant } = useTenant();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!currentTenant || !hasPermission('gerenciar_usuarios')) return;
    
    async function loadUsers() {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('id, nome, email, funcao')
          .eq('id_negocio', currentTenant.id);
        
        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUsers();
  }, [currentTenant]);
  
  const updateUserRole = async (userId, newRole) => {
    if (!hasPermission('gerenciar_usuarios')) return;
    
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ funcao: newRole })
        .eq('id', userId)
        .eq('id_negocio', currentTenant.id);
      
      if (error) throw error;
      
      // Atualizar lista de usuários
      setUsers(users.map(user => 
        user.id === userId ? { ...user, funcao: newRole } : user
      ));
    } catch (error) {
      console.error('Erro ao atualizar função do usuário:', error);
    }
  };
  
  if (!hasPermission('gerenciar_usuarios')) {
    return <div>Acesso negado</div>;
  }
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  return (
    <div className="user-role-manager">
      <h2>Gerenciar Funções de Usuários</h2>
      
      <table className="user-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Função Atual</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>{user.funcao}</td>
              <td>
                <select
                  value={user.funcao}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                >
                  <option value="admin">Administrador</option>
                  <option value="gerente">Gerente</option>
                  <option value="colaborador">Colaborador</option>
                  <option value="visualizador">Visualizador</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Permissões Dinâmicas

O sistema suporta permissões dinâmicas baseadas em metadados e configurações específicas do tenant:

### Configurações por Tenant

```typescript
// Hook para verificar permissões dinâmicas
export function useDynamicPermissions() {
  const { currentTenant } = useTenant();
  const { userRole } = usePermission();
  
  const checkFeatureAccess = (featureKey) => {
    if (!currentTenant || !userRole) return false;
    
    // Verificar plano do tenant
    const plano = currentTenant.plano || 'basico';
    
    // Verificar configurações do tenant
    const configuracoes = currentTenant.configuracoes || {};
    
    // Verificar se recurso está habilitado para o plano
    const recursoHabilitado = (
      (plano === 'enterprise') || // Enterprise tem acesso a tudo
      (plano === 'profissional' && ['relatorios_avancados', 'integracao_api', 'multiplos_usuarios'].includes(featureKey)) ||
      (plano === 'basico' && ['relatorios_basicos'].includes(featureKey)) ||
      // Verificar se está explicitamente habilitado nas configurações do tenant
      (configuracoes.recursos_habilitados && configuracoes.recursos_habilitados.includes(featureKey))
    );
    
    // Verificar se o usuário tem permissão para acessar o recurso
    const temPermissao = (
      userRole === 'admin' || // Admin tem acesso a tudo
      (userRole === 'gerente' && !['configuracoes_sistema', 'gerenciar_admins'].includes(featureKey)) ||
      // Outras verificações específicas por função...
      false
    );
    
    return recursoHabilitado && temPermissao;
  };
  
  return { checkFeatureAccess };
}
```

## Melhores Práticas

Para manter o sistema de permissões seguro e eficiente, seguimos estas práticas:

1. **Princípio do Menor Privilégio**: Usuários recebem apenas as permissões mínimas necessárias
2. **Verificação em Múltiplas Camadas**: Sempre implementar verificações na UI, API e banco de dados
3. **Auditoria de Alterações**: Registrar todas as alterações de permissões em logs
4. **Testes Automatizados**: Garantir que as permissões funcionem como esperado
5. **Sensibilidade ao Contexto**: Permissões podem variar com base no contexto (tenant, data, estado)

## Exemplos de Implementação

### Componentes da UI com Permissões

```tsx
import { PermissionGate } from '../components/PermissionGate';

export function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {/* Componentes visíveis a todos os usuários */}
      <DashboardSummary />
      
      {/* Componentes que requerem permissões específicas */}
      <PermissionGate permission="visualizar_relatorios">
        <ReportsSummary />
      </PermissionGate>
      
      <PermissionGate permission="gerenciar_financeiro">
        <FinancialSummary />
      </PermissionGate>
      
      <PermissionGate 
        permission="gerenciar_usuarios"
        fallback={<p>Você não tem permissão para gerenciar usuários.</p>}
      >
        <RecentUsersActivity />
      </PermissionGate>
    </div>
  );
}
```

### API Endpoint Protegido

```typescript
// pages/api/usuarios/alterar-funcao.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { verificarPermissao } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificar método HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  try {
    // Obter token de autenticação da requisição
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Não autenticado' });
    }
    
    // Verificar autenticação do usuário
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    
    // Verificar permissão do usuário
    const temPermissao = await verificarPermissao(user.id, 'gerenciar_usuarios');
    if (!temPermissao) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    
    // Obter dados da requisição
    const { idUsuario, novaFuncao, idNegocio } = req.body;
    
    // Verificar se usuário pertence ao mesmo negócio
    const { data: pertenceAoNegocio } = await supabase.rpc('pertence_ao_negocio', {
      id_negocio_verificar: idNegocio
    });
    
    if (!pertenceAoNegocio) {
      return res.status(403).json({ error: 'Acesso negado ao negócio' });
    }
    
    // Atualizar função do usuário
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ funcao: novaFuncao })
      .eq('id', idUsuario)
      .eq('id_negocio', idNegocio);
    
    if (updateError) {
      throw updateError;
    }
    
    // Registrar atividade de auditoria
    await supabase.rpc('registrar_auditoria', {
      p_acao: 'alterar_funcao_usuario',
      p_tabela: 'usuarios',
      p_id_registro: idUsuario,
      p_dados_novos: { funcao: novaFuncao }
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao alterar função:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
```

### Testes Automatizados para Permissões

```typescript
// __tests__/permissions.test.ts
import { render, screen } from '@testing-library/react';
import { PermissionGate } from '../components/PermissionGate';
import { PermissionProvider } from '../hooks/usePermission';

// Mock do hook de permissões
jest.mock('../hooks/usePermission', () => ({
  ...jest.requireActual('../hooks/usePermission'),
  usePermission: jest.fn()
}));

describe('Sistema de Permissões', () => {
  test('PermissionGate renderiza conteúdo quando usuário tem permissão', () => {
    // Configurar mock
    require('../hooks/usePermission').usePermission.mockReturnValue({
      hasPermission: (perm) => perm === 'test_permission',
      isLoading: false
    });
    
    render(
      <PermissionProvider>
        <PermissionGate permission="test_permission">
          <div data-testid="protected-content">Conteúdo protegido</div>
        </PermissionGate>
      </PermissionProvider>
    );
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
  
  test('PermissionGate não renderiza conteúdo quando usuário não tem permissão', () => {
    // Configurar mock
    require('../hooks/usePermission').usePermission.mockReturnValue({
      hasPermission: () => false,
      isLoading: false
    });
    
    render(
      <PermissionProvider>
        <PermissionGate permission="test_permission">
          <div data-testid="protected-content">Conteúdo protegido</div>
        </PermissionGate>
      </PermissionProvider>
    );
    
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
  
  test('PermissionGate renderiza fallback quando usuário não tem permissão', () => {
    // Configurar mock
    require('../hooks/usePermission').usePermission.mockReturnValue({
      hasPermission: () => false,
      isLoading: false
    });
    
    render(
      <PermissionProvider>
        <PermissionGate 
          permission="test_permission"
          fallback={<div data-testid="fallback-content">Acesso negado</div>}
        >
          <div data-testid="protected-content">Conteúdo protegido</div>
        </PermissionGate>
      </PermissionProvider>
    );
    
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
  });
});
``` 