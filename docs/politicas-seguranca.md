# Políticas de Segurança Row Level Security (RLS) - UnCliC Manager

Este documento descreve as políticas de segurança Row Level Security (RLS) implementadas no banco de dados do UnCliC Manager via Supabase.

## Sumário

- [Visão Geral](#visão-geral)
- [Princípios de Segurança](#princípios-de-segurança)
- [Estrutura de Políticas](#estrutura-de-políticas)
- [Políticas por Tabela](#políticas-por-tabela)
  - [Tabela: negocios](#tabela-negocios)
  - [Tabela: usuarios](#tabela-usuarios)
  - [Tabela: clientes](#tabela-clientes)
  - [Tabela: servicos](#tabela-servicos)
  - [Tabela: agendamentos](#tabela-agendamentos)
  - [Tabela: transacoes](#tabela-transacoes)
  - [Tabela: estoque](#tabela-estoque)
- [Funções de Segurança](#funções-de-segurança)
- [Claims JWT](#claims-jwt)
- [Melhores Práticas](#melhores-práticas)
- [Exemplos de Implementação](#exemplos-de-implementação)

## Visão Geral

O UnCliC Manager utiliza o sistema de Row Level Security (RLS) do PostgreSQL, gerenciado pelo Supabase, para implementar controle de acesso granular a nível de linha nas tabelas do banco de dados. Esse sistema garante que usuários só possam acessar os dados pertencentes ao seu próprio negócio ou aqueles aos quais têm permissão específica.

## Princípios de Segurança

Os principais princípios de segurança implementados são:

1. **Isolamento de dados por negócio**: Usuários só podem ver dados do negócio ao qual pertencem
2. **Princípio do privilégio mínimo**: Usuários têm acesso apenas ao necessário para sua função
3. **Segurança por padrão**: Todas as tabelas têm RLS ativado com política de negação total por padrão
4. **Segurança em profundidade**: Múltiplas camadas de verificação (aplicação e banco)
5. **Auditoria de acesso**: Registro de operações críticas

## Estrutura de Políticas

Cada política RLS define:

1. **Nome**: Identificador da política
2. **Operação**: SELECT, INSERT, UPDATE, DELETE ou ALL
3. **Expressão de utilização (USING)**: Determina se a linha é visível para operações de leitura
4. **Expressão de verificação (WITH CHECK)**: Determina se a linha pode ser modificada
5. **Tabela alvo**: Tabela à qual a política se aplica

## Políticas por Tabela

### Tabela: negocios

```sql
-- Habilitar RLS
ALTER TABLE negocios ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Usuários podem visualizar seu próprio negócio"
ON negocios FOR SELECT
USING (id IN (
  SELECT id_negocio FROM usuarios 
  WHERE auth.uid() = usuarios.id
));

CREATE POLICY "Administradores podem atualizar seu próprio negócio"
ON negocios FOR UPDATE
USING (id IN (
  SELECT id_negocio FROM usuarios 
  WHERE auth.uid() = usuarios.id AND funcao = 'admin'
))
WITH CHECK (id IN (
  SELECT id_negocio FROM usuarios 
  WHERE auth.uid() = usuarios.id AND funcao = 'admin'
));

CREATE POLICY "Somente super admins podem excluir negócios"
ON negocios FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE auth.uid() = usuarios.id 
    AND funcao = 'super_admin'
  )
);
```

### Tabela: usuarios

```sql
-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Usuários podem ver outros usuários do mesmo negócio"
ON usuarios FOR SELECT
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);

CREATE POLICY "Usuários podem atualizar apenas seu próprio perfil"
ON usuarios FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Administradores podem atualizar usuários do mesmo negócio"
ON usuarios FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM usuarios admins
    WHERE auth.uid() = admins.id
    AND admins.funcao = 'admin'
    AND admins.id_negocio = usuarios.id_negocio
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usuarios admins
    WHERE auth.uid() = admins.id
    AND admins.funcao = 'admin'
    AND admins.id_negocio = usuarios.id_negocio
  )
);

CREATE POLICY "Administradores podem criar usuários para o mesmo negócio"
ON usuarios FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usuarios admins
    WHERE auth.uid() = admins.id
    AND admins.funcao = 'admin'
    AND admins.id_negocio = usuarios.id_negocio
  )
);

CREATE POLICY "Administradores podem excluir usuários do mesmo negócio"
ON usuarios FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM usuarios admins
    WHERE auth.uid() = admins.id
    AND admins.funcao = 'admin'
    AND admins.id_negocio = usuarios.id_negocio
  )
);

CREATE POLICY "Super admins podem gerenciar todos os usuários"
ON usuarios FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE auth.uid() = usuarios.id
    AND funcao = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE auth.uid() = usuarios.id
    AND funcao = 'super_admin'
  )
);
```

### Tabela: clientes

```sql
-- Habilitar RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Usuários podem ver clientes do seu negócio"
ON clientes FOR SELECT
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);

CREATE POLICY "Usuários podem criar clientes para seu negócio"
ON clientes FOR INSERT
WITH CHECK (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);

CREATE POLICY "Usuários podem atualizar clientes do seu negócio"
ON clientes FOR UPDATE
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
)
WITH CHECK (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);

CREATE POLICY "Usuários podem excluir clientes do seu negócio"
ON clientes FOR DELETE
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);
```

### Tabela: servicos

```sql
-- Habilitar RLS
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Usuários podem ver serviços do seu negócio"
ON servicos FOR SELECT
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);

CREATE POLICY "Usuários podem criar serviços para seu negócio"
ON servicos FOR INSERT
WITH CHECK (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);

CREATE POLICY "Usuários podem atualizar serviços do seu negócio"
ON servicos FOR UPDATE
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
)
WITH CHECK (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);

CREATE POLICY "Usuários podem excluir serviços do seu negócio"
ON servicos FOR DELETE
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);
```

### Tabela: agendamentos

```sql
-- Habilitar RLS
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Usuários podem ver agendamentos do seu negócio"
ON agendamentos FOR SELECT
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);

CREATE POLICY "Usuários podem criar agendamentos para seu negócio"
ON agendamentos FOR INSERT
WITH CHECK (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);

CREATE POLICY "Usuários podem atualizar agendamentos do seu negócio"
ON agendamentos FOR UPDATE
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
)
WITH CHECK (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);

CREATE POLICY "Usuários podem excluir agendamentos do seu negócio"
ON agendamentos FOR DELETE
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);

-- Política adicional para funcionários verem apenas seus próprios agendamentos
CREATE POLICY "Funcionários veem apenas seus próprios agendamentos"
ON agendamentos FOR SELECT
USING (
  (
    id_funcionario = auth.uid()
  ) OR (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE auth.uid() = usuarios.id
      AND (funcao = 'admin' OR funcao = 'gerente')
      AND usuarios.id_negocio = agendamentos.id_negocio
    )
  )
);
```

### Tabela: transacoes

```sql
-- Habilitar RLS
ALTER TABLE transacoes ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Usuários podem ver transações do seu negócio"
ON transacoes FOR SELECT
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);

CREATE POLICY "Usuários podem criar transações para seu negócio"
ON transacoes FOR INSERT
WITH CHECK (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);

CREATE POLICY "Administradores e gerentes podem atualizar transações do seu negócio"
ON transacoes FOR UPDATE
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
    AND (funcao = 'admin' OR funcao = 'gerente')
  )
)
WITH CHECK (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
    AND (funcao = 'admin' OR funcao = 'gerente')
  )
);

CREATE POLICY "Administradores podem excluir transações do seu negócio"
ON transacoes FOR DELETE
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
    AND funcao = 'admin'
  )
);
```

### Tabela: estoque

```sql
-- Habilitar RLS
ALTER TABLE estoque ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Usuários podem ver estoque do seu negócio"
ON estoque FOR SELECT
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);

CREATE POLICY "Usuários podem criar itens de estoque para seu negócio"
ON estoque FOR INSERT
WITH CHECK (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);

CREATE POLICY "Usuários podem atualizar estoque do seu negócio"
ON estoque FOR UPDATE
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
)
WITH CHECK (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
  )
);

CREATE POLICY "Administradores e gerentes podem excluir itens de estoque do seu negócio"
ON estoque FOR DELETE
USING (
  id_negocio IN (
    SELECT id_negocio FROM usuarios
    WHERE auth.uid() = usuarios.id
    AND (funcao = 'admin' OR funcao = 'gerente')
  )
);
```

## Funções de Segurança

O sistema implementa funções auxiliares para verificações de segurança:

```sql
-- Função para verificar se o usuário pertence a um negócio específico
CREATE OR REPLACE FUNCTION auth.usuario_pertence_ao_negocio(id_negocio_verificar uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.usuarios
    WHERE id = auth.uid() 
    AND id_negocio = id_negocio_verificar
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se o usuário tem uma função específica
CREATE OR REPLACE FUNCTION auth.usuario_tem_funcao(funcao_verificar text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.usuarios
    WHERE id = auth.uid() 
    AND funcao = funcao_verificar
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar acesso a recursos específicos
CREATE OR REPLACE FUNCTION auth.usuario_tem_acesso_a_recurso(recurso text)
RETURNS boolean AS $$
DECLARE
  tem_acesso boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM public.perfis_acesso
    WHERE id_usuario = auth.uid() 
    AND (e_administrador = true OR recurso = ANY(acessos))
  ) INTO tem_acesso;
  
  RETURN tem_acesso;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Claims JWT

O Supabase Auth injeta claims específicas nos tokens JWT para facilitar as verificações de segurança:

```sql
-- Configuração de claims JWT personalizadas
CREATE OR REPLACE FUNCTION auth.jwt()
RETURNS jsonb
LANGUAGE sql STABLE
AS $$
  SELECT
    coalesce(
      nullif(current_setting('request.jwt.claim', true), ''),
      nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;

-- Função para adicionar claims personalizadas após autenticação
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  funcao text;
  id_negocio uuid;
BEGIN
  -- Obter função e id_negocio do usuário
  SELECT u.funcao, u.id_negocio 
  INTO funcao, id_negocio
  FROM public.usuarios u
  WHERE u.id = NEW.id;

  -- Adicionar claims personalizadas
  PERFORM set_claim(NEW.id, 'funcao', funcao);
  PERFORM set_claim(NEW.id, 'id_negocio', id_negocio::text);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para adicionar claims após login
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger para atualizar claims quando o usuário é atualizado
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS trigger AS $$
BEGIN
  -- Atualizar claims personalizadas
  PERFORM set_claim(NEW.id, 'funcao', NEW.funcao);
  PERFORM set_claim(NEW.id, 'id_negocio', NEW.id_negocio::text);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_updated
AFTER UPDATE ON public.usuarios
FOR EACH ROW EXECUTE PROCEDURE public.handle_user_update();
```

## Melhores Práticas

Implementamos as seguintes melhores práticas de segurança:

1. **Ativar RLS em todas as tabelas**: Sem exceções, todas as tabelas têm RLS ativado
2. **Denegar por padrão**: Sem uma política explícita, o acesso é negado
3. **Verificar na aplicação e no banco**: Dupla verificação de segurança
4. **Usar funções SECURITY DEFINER com cuidado**: Apenas quando necessário
5. **Simplificar políticas**: Manter políticas claras e fáceis de entender
6. **Testar políticas**: Testar todas as políticas para garantir que funcionam corretamente
7. **Documentar políticas**: Manter documentação atualizada das políticas de segurança

## Exemplos de Implementação

### Implementação em SQL

Script completo para implementação das políticas RLS:

```sql
-- Ativar RLS em todas as tabelas
DO $$
DECLARE
  t record;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t.tablename);
    EXECUTE format('CREATE POLICY "Default deny" ON public.%I FOR ALL USING (false);', t.tablename);
  END LOOP;
END
$$;

-- Implementar políticas específicas
-- ... (adicionar as políticas específicas definidas acima para cada tabela)
```

### Verificações na Aplicação

Exemplo de como a aplicação verifica permissões no lado do cliente:

```typescript
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

// Hook para verificar permissões de negócio
export function useBusinessPermission() {
  const { user } = useAuth();
  
  const canAccessBusiness = async (businessId: string): Promise<boolean> => {
    if (!user) return false;
    
    // Verificar se o usuário tem acesso ao negócio
    const { data, error } = await supabase
      .rpc('usuario_pertence_ao_negocio', { id_negocio_verificar: businessId });
    
    if (error || !data) return false;
    
    return data;
  };
  
  const canManageUsers = async (businessId: string): Promise<boolean> => {
    if (!user) return false;
    
    // Verificar se o usuário pode gerenciar outros usuários
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('usuario_tem_funcao', { funcao_verificar: 'admin' });
    
    if (adminError || !isAdmin) return false;
    
    // Verificar se o usuário pertence ao negócio
    const { data: belongsToBusiness, error: businessError } = await supabase
      .rpc('usuario_pertence_ao_negocio', { id_negocio_verificar: businessId });
    
    if (businessError || !belongsToBusiness) return false;
    
    return true;
  };
  
  return { canAccessBusiness, canManageUsers };
}

// Exemplo de uso
const Component = ({ businessId }) => {
  const { canAccessBusiness } = useBusinessPermission();
  const [hasAccess, setHasAccess] = useState(false);
  
  useEffect(() => {
    const checkAccess = async () => {
      const access = await canAccessBusiness(businessId);
      setHasAccess(access);
    };
    
    checkAccess();
  }, [businessId]);
  
  if (!hasAccess) return <div>Sem permissão</div>;
  
  return <div>Conteúdo protegido</div>;
};
```

### Auditoria

Implementação de gatilhos para auditoria de operações críticas:

```sql
-- Tabela de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tabela text NOT NULL,
  operacao text NOT NULL,
  id_registro uuid NOT NULL,
  dados_antigos jsonb,
  dados_novos jsonb,
  id_usuario uuid,
  criado_em timestamp with time zone DEFAULT now()
);

-- Função de auditoria
CREATE OR REPLACE FUNCTION audit_changes()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs(tabela, operacao, id_registro, dados_antigos, id_usuario)
    VALUES (TG_TABLE_NAME, TG_OP, OLD.id, row_to_json(OLD), auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs(tabela, operacao, id_registro, dados_antigos, dados_novos, id_usuario)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(OLD), row_to_json(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs(tabela, operacao, id_registro, dados_novos, id_usuario)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(NEW), auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar trigger de auditoria em tabelas críticas
CREATE TRIGGER audit_usuarios
AFTER INSERT OR UPDATE OR DELETE ON usuarios
FOR EACH ROW EXECUTE PROCEDURE audit_changes();

CREATE TRIGGER audit_transacoes
AFTER INSERT OR UPDATE OR DELETE ON transacoes
FOR EACH ROW EXECUTE PROCEDURE audit_changes();

CREATE TRIGGER audit_negocios
AFTER INSERT OR UPDATE OR DELETE ON negocios
FOR EACH ROW EXECUTE PROCEDURE audit_changes();
``` 