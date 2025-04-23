-- Migração para adicionar tabela de histórico de fidelidade para auditoria de pontos

-- Criar tabela para histórico de fidelidade
CREATE TABLE IF NOT EXISTS historico_fidelidade (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_negocio UUID NOT NULL REFERENCES negocios(id),
  id_cliente UUID NOT NULL REFERENCES clientes(id),
  pontos_anteriores INTEGER NOT NULL,
  pontos_adicionados INTEGER NOT NULL,
  pontos_totais INTEGER NOT NULL,
  motivo TEXT,
  id_transacao UUID REFERENCES transacoes(id),
  id_agendamento UUID REFERENCES agendamentos(id),
  criado_por UUID NOT NULL REFERENCES usuarios(id),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS
ALTER TABLE historico_fidelidade ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
-- Política para leitura
CREATE POLICY "Usuários podem ver apenas histórico de fidelidade do seu negócio" ON historico_fidelidade
FOR SELECT
USING (auth.uid() IN (
  SELECT id FROM usuarios WHERE id_negocio = historico_fidelidade.id_negocio
));

-- Política para inserção
CREATE POLICY "Apenas administradores e profissionais autorizados podem inserir histórico de fidelidade" ON historico_fidelidade
FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT u.id FROM usuarios u
  JOIN perfis_acesso p ON u.id = p.id_usuario
  WHERE u.id_negocio = historico_fidelidade.id_negocio
  AND (p.e_administrador = true OR p.acesso_clientes = true)
));

-- Proibir atualizações e exclusões
CREATE POLICY "Proibir atualizações no histórico de fidelidade" ON historico_fidelidade
FOR UPDATE
USING (false);

CREATE POLICY "Proibir exclusões no histórico de fidelidade" ON historico_fidelidade
FOR DELETE
USING (false);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_historico_fidelidade_cliente ON historico_fidelidade(id_cliente);
CREATE INDEX IF NOT EXISTS idx_historico_fidelidade_negocio ON historico_fidelidade(id_negocio);
CREATE INDEX IF NOT EXISTS idx_historico_fidelidade_data ON historico_fidelidade(criado_em);

-- Criar função para adicionar automaticamente ao histórico quando pontos forem atualizados
CREATE OR REPLACE FUNCTION fn_registrar_alteracao_pontos()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se houve alteração nos pontos
  IF (NEW.dados_fidelidade->>'pontos')::integer != (OLD.dados_fidelidade->>'pontos')::integer THEN
    INSERT INTO historico_fidelidade (
      id_negocio,
      id_cliente,
      pontos_anteriores,
      pontos_adicionados,
      pontos_totais,
      motivo,
      criado_por
    ) VALUES (
      NEW.id_negocio,
      NEW.id,
      (OLD.dados_fidelidade->>'pontos')::integer,
      (NEW.dados_fidelidade->>'pontos')::integer - (OLD.dados_fidelidade->>'pontos')::integer,
      (NEW.dados_fidelidade->>'pontos')::integer,
      'Atualização manual de pontos',
      auth.uid()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ativar o trigger para a tabela de clientes
CREATE TRIGGER trg_registrar_alteracao_pontos
AFTER UPDATE ON clientes
FOR EACH ROW
WHEN ((NEW.dados_fidelidade->>'pontos')::integer != (OLD.dados_fidelidade->>'pontos')::integer)
EXECUTE FUNCTION fn_registrar_alteracao_pontos(); 