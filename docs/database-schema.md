# Estrutura do Banco de Dados - UnCliC Manager

Este documento descreve o esquema de banco de dados do UnCliC Manager, implementado no Supabase (PostgreSQL).

## Sumário

- [Visão Geral](#visão-geral)
- [Tabelas Principais](#tabelas-principais)
  - [Negócios](#negocios)
  - [Usuários](#usuarios)
  - [Clientes](#clientes)
  - [Funcionários](#funcionarios)
  - [Serviços](#servicos)
  - [Agendamentos](#agendamentos)
  - [Transações](#transacoes)
  - [Estoque](#estoque)
  - [Categorias](#categorias)
  - [Horários de Disponibilidade](#horarios_disponibilidade)
  - [Configurações de Negócio](#configuracoes_negocio)
  - [Análises de Negócio](#analises_negocio)
  - [Campanhas de Marketing](#campanhas_marketing)
  - [Integrações](#integracoes)
  - [Perfis de Acesso](#perfis_acesso)
- [Relacionamentos](#relacionamentos)
- [Políticas de Segurança](#políticas-de-segurança)
- [Consultas Comuns](#consultas-comuns)

## Visão Geral

O esquema de banco de dados foi projetado para suportar múltiplos negócios na mesma plataforma, com isolamento de dados entre eles. A estrutura utiliza chaves estrangeiras para relacionamentos e políticas de segurança em nível de linha (RLS - Row Level Security) para garantir a segregação de dados.

## Tabelas Principais

### negocios

Armazena informações sobre os estabelecimentos cadastrados na plataforma.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único do negócio (PK) |
| nome | text | Nome do estabelecimento |
| email_admin | text | Email do administrador principal |
| slug | text | Identificador amigável para URLs |
| telefone | text | Telefone de contato |
| endereco | text | Endereço do estabelecimento |
| numero | text | Número do endereço |
| complemento | text | Complemento do endereço |
| bairro | text | Bairro |
| cidade | text | Cidade |
| estado | text | Estado |
| cep | text | CEP |
| latitude | float | Latitude da localização |
| longitude | float | Longitude da localização |
| cnpj | text | CNPJ do estabelecimento |
| razao_social | text | Razão social |
| nome_fantasia | text | Nome fantasia |
| descricao | text | Descrição do negócio |
| url_logo | text | URL do logo |
| status | text | Status do negócio (ativo, inativo, etc) |
| status_assinatura | text | Status da assinatura da plataforma |
| data_fim_assinatura | timestamp | Data de término da assinatura |
| data_fim_teste | timestamp | Data de término do período de teste |
| idioma | text | Idioma padrão |
| moeda | text | Moeda padrão |
| fuso_horario | text | Fuso horário |
| criado_em | timestamp | Data de criação |
| atualizado_em | timestamp | Data da última atualização |

### usuarios

Armazena informações sobre os usuários do sistema, que podem ser administradores ou funcionários.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único do usuário (PK) |
| email | text | Email do usuário |
| nome_completo | text | Nome completo |
| senha_hash | text | Hash da senha (quando não usa autenticação do Supabase) |
| telefone | text | Telefone de contato |
| id_negocio | uuid | Negócio associado (FK para negocios.id) |
| funcao | text | Função no sistema |
| status | text | Status do usuário (ativo, inativo, etc) |
| cpf | text | CPF do usuário |
| data_nascimento | date | Data de nascimento |
| url_avatar | text | URL da foto de perfil |
| ultimo_acesso | timestamp | Data do último acesso |
| criado_em | timestamp | Data de criação |
| atualizado_em | timestamp | Data da última atualização |

### clientes

Armazena os clientes cadastrados por cada negócio.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único do cliente (PK) |
| id_negocio | uuid | Negócio associado (FK para negocios.id) |
| id_usuario | uuid | Usuário associado caso o cliente tenha acesso (FK para usuarios.id) |
| nome | text | Nome do cliente |
| email | text | Email do cliente |
| telefone | text | Telefone de contato |
| data_nascimento | date | Data de nascimento |
| genero | text | Gênero |
| endereco | text | Endereço completo |
| cidade | text | Cidade |
| estado | text | Estado |
| cep | text | CEP |
| preferencias | jsonb | Preferências do cliente (formato JSON) |
| notas | text | Notas sobre o cliente |
| ultima_visita | timestamp | Data da última visita |
| valor_total_gasto | numeric | Valor total gasto pelo cliente |
| criado_em | timestamp | Data de criação |
| atualizado_em | timestamp | Data da última atualização |

### funcionarios

Armazena informações sobre os profissionais de cada negócio.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único do funcionário (PK) |
| id_negocio | uuid | Negócio associado (FK para negocios.id) |
| id_usuario | uuid | Usuário associado (FK para usuarios.id) |
| nome | text | Nome do funcionário |
| cargo | text | Cargo ou função |
| telefone | text | Telefone de contato |
| email | text | Email profissional |
| foto_url | text | URL da foto |
| bio | text | Biografia ou descrição |
| especializacoes | text[] | Lista de especializações |
| comissao_percentual | numeric | Percentual de comissão |
| data_contratacao | date | Data de contratação |
| status | text | Status (ativo, afastado, etc) |
| criado_em | timestamp | Data de criação |
| atualizado_em | timestamp | Data da última atualização |

### servicos

Armazena os serviços oferecidos por cada negócio.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único do serviço (PK) |
| id_negocio | uuid | Negócio associado (FK para negocios.id) |
| id_categoria | uuid | Categoria do serviço (FK para categorias.id) |
| nome | text | Nome do serviço |
| descricao | text | Descrição do serviço |
| preco | numeric | Preço do serviço |
| duracao | integer | Duração em minutos |
| imagem_url | text | URL da imagem |
| ativo | boolean | Se o serviço está ativo |
| comissao_percentual | numeric | Percentual de comissão |
| requer_equipamento | boolean | Se requer equipamento específico |
| ids_equipamentos | uuid[] | IDs dos equipamentos necessários |
| criado_em | timestamp | Data de criação |
| atualizado_em | timestamp | Data da última atualização |

### agendamentos

Armazena os agendamentos de serviços.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único do agendamento (PK) |
| id_negocio | uuid | Negócio associado (FK para negocios.id) |
| id_cliente | uuid | Cliente (FK para clientes.id) |
| id_funcionario | uuid | Funcionário responsável (FK para funcionarios.id) |
| id_servico | uuid | Serviço agendado (FK para servicos.id) |
| data | date | Data do agendamento |
| hora_inicio | time | Hora de início |
| hora_fim | time | Hora de término |
| duracao | integer | Duração em minutos |
| valor | numeric | Valor do serviço |
| status | text | Status (agendado, confirmado, concluído, cancelado) |
| observacoes | text | Observações adicionais |
| forma_pagamento | text | Forma de pagamento |
| lembrete_enviado | boolean | Se o lembrete foi enviado |
| avaliacao | integer | Avaliação do serviço (1-5) |
| comentario_avaliacao | text | Comentário da avaliação |
| criado_em | timestamp | Data de criação |
| atualizado_em | timestamp | Data da última atualização |

### transacoes

Armazena as transações financeiras.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único da transação (PK) |
| id_negocio | uuid | Negócio associado (FK para negocios.id) |
| id_cliente | uuid | Cliente (FK para clientes.id) |
| id_agendamento | uuid | Agendamento relacionado (FK para agendamentos.id) |
| id_categoria | uuid | Categoria financeira (FK para categorias.id) |
| tipo | text | Tipo (receita, despesa) |
| valor | numeric | Valor da transação |
| descricao | text | Descrição |
| data_vencimento | date | Data de vencimento |
| data_pagamento | date | Data do pagamento efetivo |
| status | text | Status (pendente, pago, cancelado) |
| metodo_pagamento | text | Método de pagamento |
| comprovante_url | text | URL do comprovante |
| notas | text | Notas adicionais |
| criado_por | uuid | Usuário que criou (FK para usuarios.id) |
| criado_em | timestamp | Data de criação |
| atualizado_em | timestamp | Data da última atualização |

### estoque

Armazena os itens de estoque e equipamentos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único do item (PK) |
| id_negocio | uuid | Negócio associado (FK para negocios.id) |
| id_categoria | uuid | Categoria do item (FK para categorias.id) |
| id_fornecedor | uuid | Fornecedor do item |
| nome | text | Nome do item |
| descricao | text | Descrição do item |
| quantidade | integer | Quantidade em estoque |
| quantidade_minima | integer | Quantidade mínima para alerta |
| preco_custo | numeric | Preço de custo |
| preco_venda | numeric | Preço de venda |
| e_equipamento | boolean | Se é um equipamento ou produto |
| localizacao | text | Localização no estoque |
| imagem_url | text | URL da imagem |
| codigo_barras | text | Código de barras |
| sku | text | SKU (Stock Keeping Unit) |
| data_validade | date | Data de validade |
| data_ultima_reposicao | date | Data da última reposição |
| criado_em | timestamp | Data de criação |
| atualizado_em | timestamp | Data da última atualização |

### categorias

Armazena categorias para diversos tipos de itens (serviços, transações, produtos).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único da categoria (PK) |
| id_negocio | uuid | Negócio associado (FK para negocios.id) |
| nome | text | Nome da categoria |
| tipo | text | Tipo de categoria (serviço, transação, produto) |
| descricao | text | Descrição da categoria |
| cor | text | Cor para representação visual |
| icone | text | Ícone da categoria |
| criado_em | timestamp | Data de criação |
| atualizado_em | timestamp | Data da última atualização |

### horarios_disponibilidade

Armazena os horários de disponibilidade do negócio ou funcionários.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único (PK) |
| id_negocio | uuid | Negócio associado (FK para negocios.id) |
| id_funcionario | uuid | Funcionário, se aplicável (FK para funcionarios.id) |
| id_servico | uuid | Serviço, se aplicável (FK para servicos.id) |
| dia_semana | integer | Dia da semana (0=domingo, 6=sábado) |
| hora_inicio | time | Hora de início |
| hora_fim | time | Hora de término |
| dia_folga | boolean | Se é dia de folga |
| capacidade_simultanea | integer | Capacidade de atendimentos simultâneos |
| intervalo_entre_agendamentos | integer | Intervalo entre agendamentos (minutos) |
| criado_em | timestamp | Data de criação |
| atualizado_em | timestamp | Data da última atualização |

### configuracoes_negocio

Armazena configurações específicas de cada negócio.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único (PK) |
| id_negocio | uuid | Negócio associado (FK para negocios.id) |
| logo_url | text | URL do logo |
| banner_url | text | URL do banner |
| cores_primarias | text | Cores primárias da marca |
| cores_secundarias | text | Cores secundárias da marca |
| permite_fila_remota | boolean | Se permite fila remota |
| limite_fila_remota | integer | Limite de pessoas na fila remota |
| aviso_minimo_agendamento | integer | Aviso mínimo para agendamento (horas) |
| dias_maximos_antecedencia | integer | Máximo de dias para agendamento antecipado |
| politica_cancelamento | text | Política de cancelamento |
| pagamento_antecipado_obrigatorio | boolean | Se exige pagamento antecipado |
| permite_gorjetas | boolean | Se permite gorjetas |
| ia_habilitada | boolean | Se recursos de IA estão habilitados |
| fallback_humano_habilitado | boolean | Se fallback humano para IA está habilitado |
| configuracoes_gateway_pagamento | jsonb | Configurações do gateway de pagamento |
| criado_em | timestamp | Data de criação |
| atualizado_em | timestamp | Data da última atualização |

### analises_negocio

Armazena métricas e análises de desempenho do negócio.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único (PK) |
| id_negocio | uuid | Negócio associado (FK para negocios.id) |
| data | date | Data da análise |
| total_agendamentos | integer | Total de agendamentos |
| agendamentos_concluidos | integer | Agendamentos concluídos |
| taxa_cancelamento | numeric | Taxa de cancelamento (%) |
| taxa_ocupacao | numeric | Taxa de ocupação (%) |
| receita_total | numeric | Receita total |
| despesas_total | numeric | Despesas totais |
| lucro_liquido | numeric | Lucro líquido |
| novos_clientes | integer | Novos clientes |
| clientes_recorrentes | integer | Clientes recorrentes |
| tempo_medio_atendimento | integer | Tempo médio de atendimento (minutos) |
| nps | numeric | NPS (Net Promoter Score) |
| servicos_populares | jsonb | Serviços mais populares |
| funcionarios_destaque | jsonb | Funcionários em destaque |
| criado_em | timestamp | Data de criação |

### campanhas_marketing

Armazena informações sobre campanhas de marketing.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único (PK) |
| id_negocio | uuid | Negócio associado (FK para negocios.id) |
| nome | text | Nome da campanha |
| tipo | text | Tipo de campanha |
| data_inicio | date | Data de início |
| data_fim | date | Data de término |
| orcamento | numeric | Orçamento |
| total_gasto | numeric | Total gasto |
| status | text | Status da campanha |
| publico_alvo | text | Público-alvo |
| canais | text[] | Canais utilizados |
| impressoes | integer | Número de impressões |
| cliques | integer | Número de cliques |
| conversoes | integer | Número de conversões |
| roi | numeric | ROI (Retorno sobre Investimento) |
| resultados | jsonb | Resultados detalhados |
| criado_por | uuid | Usuário que criou (FK para usuarios.id) |
| criado_em | timestamp | Data de criação |
| atualizado_em | timestamp | Data da última atualização |

### integracoes

Armazena informações sobre integrações com serviços externos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único (PK) |
| id_negocio | uuid | Negócio associado (FK para negocios.id) |
| nome_provedor | text | Nome do provedor (Google, Meta, etc) |
| tipo | text | Tipo de integração (calendário, pagamentos, etc) |
| ativo | boolean | Se a integração está ativa |
| token_acesso | text | Token de acesso |
| token_refresh | text | Token de refresh |
| data_expiracao_token | timestamp | Data de expiração do token |
| configuracao | jsonb | Configurações específicas |
| ultima_sincronizacao | timestamp | Data da última sincronização |
| status_ultima_sincronizacao | text | Status da última sincronização |
| criado_em | timestamp | Data de criação |
| atualizado_em | timestamp | Data da última atualização |

### perfis_acesso

Armazena os perfis de acesso dos usuários no sistema.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Identificador único (PK) |
| id_negocio | uuid | Negócio associado (FK para negocios.id) |
| id_usuario | uuid | Usuário (FK para usuarios.id) |
| e_administrador | boolean | Se é administrador |
| acesso_agendamentos | boolean | Acesso à gestão de agendamentos |
| acesso_clientes | boolean | Acesso à gestão de clientes |
| acesso_financeiro | boolean | Acesso à gestão financeira |
| acesso_estoque | boolean | Acesso à gestão de estoque |
| acesso_configuracoes | boolean | Acesso às configurações |
| acesso_relatorios | boolean | Acesso aos relatórios |
| acesso_marketing | boolean | Acesso ao marketing |
| criado_em | timestamp | Data de criação |
| atualizado_em | timestamp | Data da última atualização |

## Relacionamentos

O banco de dados possui diversos relacionamentos entre as tabelas, principalmente através de chaves estrangeiras. Os principais relacionamentos são:

1. **Negócio como entidade central**: Todas as tabelas têm uma relação com `negocios` para garantir isolamento de dados.

2. **Usuários e Perfis**: Cada usuário pode ter um perfil de acesso específico.

3. **Funcionários e Usuários**: Um funcionário pode estar associado a um usuário do sistema.

4. **Clientes**: Podem ser associados a um usuário (opcional) para acesso ao sistema.

5. **Serviços e Categorias**: Serviços são organizados em categorias.

6. **Agendamentos**: Relacionam-se com clientes, funcionários e serviços.

7. **Transações**: Podem ser associadas a agendamentos para pagamentos.

## Políticas de Segurança

O banco de dados implementa políticas de segurança em nível de linha (RLS) para garantir o isolamento de dados entre negócios. Cada tabela possui políticas que:

1. Permitem que usuários vejam apenas dados relacionados ao seu negócio
2. Restringem operações baseadas no perfil do usuário
3. Impedem modificação de dados históricos

Exemplo de política para tabela de clientes:

```sql
CREATE POLICY "Usuários podem ver apenas clientes do seu negócio" ON clientes
    FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM usuarios WHERE id_negocio = clientes.id_negocio
    ));

CREATE POLICY "Apenas usuários com permissão podem editar clientes" ON clientes
    FOR UPDATE
    USING (auth.uid() IN (
        SELECT u.id FROM usuarios u
        JOIN perfis_acesso p ON u.id = p.id_usuario
        WHERE u.id_negocio = clientes.id_negocio
        AND (p.e_administrador = true OR p.acesso_clientes = true)
    ));
```

## Consultas Comuns

### Agendamentos do dia

```sql
SELECT 
    a.id, 
    a.hora_inicio, 
    a.hora_fim, 
    s.nome as servico, 
    c.nome as cliente, 
    f.nome as profissional
FROM agendamentos a
JOIN clientes c ON a.id_cliente = c.id
JOIN funcionarios f ON a.id_funcionario = f.id
JOIN servicos s ON a.id_servico = s.id
WHERE a.id_negocio = '<id_negocio>' 
AND a.data = CURRENT_DATE
ORDER BY a.hora_inicio;
```

### Faturamento por período

```sql
SELECT 
    SUM(valor) as total_receita
FROM transacoes
WHERE id_negocio = '<id_negocio>'
AND tipo = 'receita'
AND data_pagamento BETWEEN '<data_inicio>' AND '<data_fim>';
```

### Clientes mais frequentes

```sql
SELECT 
    c.id, 
    c.nome, 
    COUNT(a.id) as total_agendamentos
FROM clientes c
JOIN agendamentos a ON c.id = a.id_cliente
WHERE c.id_negocio = '<id_negocio>'
GROUP BY c.id, c.nome
ORDER BY total_agendamentos DESC
LIMIT 10;
``` 