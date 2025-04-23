# Políticas de Segurança para Sistema de Fidelidade e Segmentação - UnCliC Manager

Este documento detalha as políticas de segurança em nível de linha (RLS - Row Level Security) implementadas no sistema de fidelidade e segmentação de clientes do UnCliC Manager.

## Visão Geral

O sistema de fidelidade e segmentação de clientes permite que cada negócio gerencie seus programas de pontos e campanhas de marketing de forma segura, garantindo que cada estabelecimento tenha acesso apenas aos seus próprios dados. As políticas foram projetadas para seguir os mesmos princípios de segurança aplicados ao resto do sistema.

## Políticas para Novos Campos em Clientes

Os campos adicionados à tabela `clientes` para suportar o sistema de fidelidade e segmentação seguem as mesmas políticas de segurança da tabela principal:

1. Acesso de Leitura:
```sql
CREATE POLICY "Usuários podem ver apenas clientes do seu negócio" ON clientes
FOR SELECT
USING (auth.uid() IN (
  SELECT id FROM usuarios WHERE id_negocio = clientes.id_negocio
));
```

2. Acesso de Edição para Dados de Fidelidade:
```sql
CREATE POLICY "Apenas administradores e profissionais autorizados podem editar pontos de fidelidade" ON clientes
FOR UPDATE
USING (auth.uid() IN (
  SELECT u.id FROM usuarios u
  JOIN perfis_acesso p ON u.id = p.id_usuario
  WHERE u.id_negocio = clientes.id_negocio
  AND (p.e_administrador = true OR p.acesso_clientes = true)
))
WITH CHECK (
  -- Impedir que campos sensíveis sejam alterados
  OLD.id_negocio = NEW.id_negocio AND
  ((dados_fidelidade->'pontos')::integer <= (NEW.dados_fidelidade->'pontos')::integer + 1000)
);
```

3. Acesso de Edição para Preferências de Marketing:
```sql
CREATE POLICY "Apenas administradores e profissionais de marketing podem editar preferências de marketing" ON clientes
FOR UPDATE
USING (auth.uid() IN (
  SELECT u.id FROM usuarios u
  JOIN perfis_acesso p ON u.id = p.id_usuario
  WHERE u.id_negocio = clientes.id_negocio
  AND (p.e_administrador = true OR p.acesso_marketing = true)
))
WITH CHECK (
  -- Impedir que campos sensíveis sejam alterados
  OLD.id_negocio = NEW.id_negocio
);
```

## Validações de Negócio

Além das políticas RLS, validações adicionais são implementadas no backend:

1. **Limites de Pontos**: Limitação de quantos pontos podem ser adicionados em uma única operação (máximo de 1000 pontos)

2. **Auditoria de Pontos**: Todas as alterações de pontos são registradas em uma tabela de auditoria (`historico_fidelidade`)

3. **Preferências de Marketing**: Apenas as preferências explicitamente aceitas pelos clientes podem ser utilizadas para comunicação

## Políticas para Campanhas de Marketing

Para a tabela `campanhas_marketing`, as seguintes políticas são aplicadas:

1. Acesso de Leitura:
```sql
CREATE POLICY "Usuários podem ver apenas campanhas do seu negócio" ON campanhas_marketing
FOR SELECT
USING (auth.uid() IN (
  SELECT id FROM usuarios WHERE id_negocio = campanhas_marketing.id_negocio
));
```

2. Acesso de Criação e Edição:
```sql
CREATE POLICY "Apenas administradores e profissionais de marketing podem gerenciar campanhas" ON campanhas_marketing
FOR ALL
USING (auth.uid() IN (
  SELECT u.id FROM usuarios u
  JOIN perfis_acesso p ON u.id = p.id_usuario
  WHERE u.id_negocio = campanhas_marketing.id_negocio
  AND (p.e_administrador = true OR p.acesso_marketing = true)
));
```

## Tabela de Histórico de Fidelidade

Para rastrear todas as alterações de pontos de fidelidade, uma tabela específica foi criada:

```sql
CREATE TABLE historico_fidelidade (
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

-- Impedir atualizações e exclusões
CREATE POLICY "Proibir atualizações no histórico de fidelidade" ON historico_fidelidade
FOR UPDATE
USING (false);

CREATE POLICY "Proibir exclusões no histórico de fidelidade" ON historico_fidelidade
FOR DELETE
USING (false);
```

## Proteção de Dados Pessoais

As políticas de segurança para o sistema de fidelidade e segmentação de clientes também foram projetadas para atender a requisitos de proteção de dados pessoais, garantindo que:

1. Apenas pessoas autorizadas têm acesso aos dados
2. Todas as alterações são auditadas
3. As preferências dos clientes são respeitadas
4. Os dados são utilizados apenas para os fins consentidos pelos clientes

Estas políticas garantem a segurança e conformidade do sistema com regulamentações de proteção de dados. 