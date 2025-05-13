
# Row Level Security (RLS) Policies

Este arquivo documenta as políticas de Row Level Security (RLS) que devem ser aplicadas no banco de dados Supabase para garantir a segurança adequada dos dados.

## Tabela: clientes

```sql
-- Habilitar RLS na tabela clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados vejam apenas clientes do seu próprio negócio
CREATE POLICY "Usuários podem ver clientes do seu negócio"
ON public.clientes
FOR SELECT
USING (auth.uid() IN (
  SELECT id FROM public.usuarios WHERE id_negocio = clientes.id_negocio
));

-- Política para permitir que usuários autenticados criem clientes para seu próprio negócio
CREATE POLICY "Usuários podem criar clientes para seu negócio"
ON public.clientes
FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT id FROM public.usuarios WHERE id_negocio = clientes.id_negocio
));

-- Política para permitir que usuários autenticados atualizem clientes do seu próprio negócio
CREATE POLICY "Usuários podem atualizar clientes do seu negócio"
ON public.clientes
FOR UPDATE
USING (auth.uid() IN (
  SELECT id FROM public.usuarios WHERE id_negocio = clientes.id_negocio
));

-- Política para permitir que usuários autenticados excluam clientes do seu próprio negócio
CREATE POLICY "Usuários podem excluir clientes do seu negócio"
ON public.clientes
FOR DELETE
USING (auth.uid() IN (
  SELECT id FROM public.usuarios WHERE id_negocio = clientes.id_negocio
));
```

## Tabela: negocios

```sql
-- Habilitar RLS na tabela negocios
ALTER TABLE public.negocios ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas seu próprio negócio
CREATE POLICY "Usuários podem ver seu próprio negócio"
ON public.negocios
FOR SELECT
USING (id IN (
  SELECT id_negocio FROM public.usuarios WHERE id = auth.uid()
));

-- Política para permitir que administradores atualizem seu próprio negócio
CREATE POLICY "Administradores podem atualizar seu próprio negócio"
ON public.negocios
FOR UPDATE
USING (id IN (
  SELECT id_negocio FROM public.usuarios WHERE id = auth.uid() AND funcao = 'admin'
));

-- Política para permitir que usuários cadastrem um novo negócio (durante o onboarding)
CREATE POLICY "Usuários podem criar um novo negócio"
ON public.negocios
FOR INSERT
WITH CHECK (true);
```

## Tabela: usuarios

```sql
-- Habilitar RLS na tabela usuarios
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam outros usuários do mesmo negócio
CREATE POLICY "Usuários podem ver outros usuários do mesmo negócio"
ON public.usuarios
FOR SELECT
USING (
  id_negocio IN (
    SELECT id_negocio FROM public.usuarios WHERE id = auth.uid()
  ) OR id = auth.uid()
);

-- Política para permitir que usuários atualizem seu próprio perfil
CREATE POLICY "Usuários podem atualizar apenas seu próprio perfil"
ON public.usuarios
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Política para permitir que administradores atualizem usuários do mesmo negócio
CREATE POLICY "Administradores podem atualizar usuários do mesmo negócio"
ON public.usuarios
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios admins
    WHERE auth.uid() = admins.id
    AND admins.funcao = 'admin'
    AND admins.id_negocio = usuarios.id_negocio
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.usuarios admins
    WHERE auth.uid() = admins.id
    AND admins.funcao = 'admin'
    AND admins.id_negocio = usuarios.id_negocio
  )
);
```

## Função para verificar acesso ao negócio

```sql
-- Função para verificar se o usuário tem acesso a um negócio específico
CREATE OR REPLACE FUNCTION public.usuario_tem_acesso_ao_negocio(id_negocio_verificar uuid)
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
```

## Instruções para implementação

Para implementar essas políticas RLS:

1. Acesse o painel do Supabase
2. Vá para a seção "SQL Editor"
3. Cole e execute cada bloco de SQL separadamente
4. Verifique na seção "Authentication > Policies" se as políticas foram corretamente aplicadas
