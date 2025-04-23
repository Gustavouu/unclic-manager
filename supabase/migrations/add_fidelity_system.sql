-- Migração para adicionar suporte ao sistema de fidelidade e segmentação de clientes

-- Adicionar coluna de dados de fidelidade
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS dados_fidelidade JSONB DEFAULT jsonb_build_object(
  'pontos', 0, 
  'nivel', 'Bronze', 
  'ultimo_resgate', NULL
);

-- Adicionar coluna de preferências de marketing
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS preferencias_marketing JSONB DEFAULT jsonb_build_object(
  'email', false, 
  'whatsapp', false, 
  'sms', false
);

-- Adicionar coluna de tags para segmentação
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Adicionar coluna de data de cadastro se não existir
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Criar índice para busca por pontos de fidelidade
CREATE INDEX IF NOT EXISTS idx_clientes_fidelidade ON clientes USING GIN ((dados_fidelidade->'pontos'));

-- Criar índice para busca por tags
CREATE INDEX IF NOT EXISTS idx_clientes_tags ON clientes USING GIN (tags);

-- Atualizar as políticas de segurança para incluir as novas colunas
DO $$
BEGIN
  -- Verificar se as políticas existem e atualizar
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Usuários podem ver apenas clientes do seu negócio' AND tablename = 'clientes') THEN
    -- Manter a política existente
    NULL;
  ELSE
    -- Criar a política se não existir
    CREATE POLICY "Usuários podem ver apenas clientes do seu negócio" ON clientes
      FOR SELECT
      USING (auth.uid() IN (
        SELECT id FROM usuarios WHERE id_negocio = clientes.id_negocio
      ));
  END IF;

  -- Política para administradores e profissionais com permissão
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Apenas usuários com permissão podem editar clientes' AND tablename = 'clientes') THEN
    -- Manter a política existente
    NULL;
  ELSE
    -- Criar a política se não existir
    CREATE POLICY "Apenas usuários com permissão podem editar clientes" ON clientes
      FOR UPDATE
      USING (auth.uid() IN (
        SELECT u.id FROM usuarios u
        JOIN perfis_acesso p ON u.id = p.id_usuario
        WHERE u.id_negocio = clientes.id_negocio
        AND (p.e_administrador = true OR p.acesso_clientes = true)
      ));
  END IF;
END
$$; 