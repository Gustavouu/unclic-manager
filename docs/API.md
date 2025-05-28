# Documentação da API – UnCliC Manager

## Autenticação

- **POST** `/auth/login`
  - **Descrição:** Autentica usuário e retorna token JWT.
  - **Parâmetros:**
    - `email` (string, obrigatório)
    - `senha` (string, obrigatório)
  - **Resposta:**
    - 200: `{ token, user }`
    - 401: `{ error: 'Credenciais inválidas' }`

---

## Usuários

- **GET** `/usuarios/{id}`
  - **Descrição:** Busca dados do usuário pelo ID.
  - **Parâmetros:**
    - `id` (UUID, obrigatório)
  - **Resposta:**
    - 200: `{ id, email, nome, cargo, ativo, id_negocio, ... }`
    - 404: `{ error: 'Usuário não encontrado' }`

- **GET** `/usuarios?negocio={business_id}`
  - **Descrição:** Lista usuários de um negócio.
  - **Parâmetros:**
    - `business_id` (UUID, obrigatório)
  - **Resposta:**
    - 200: `[{ ...usuario }]`

---

## Clientes

- **GET** `/clientes?negocio={business_id}`
  - **Descrição:** Lista clientes do negócio.
  - **Parâmetros:**
    - `business_id` (UUID, obrigatório)
  - **Resposta:**
    - 200: `[{ ...cliente }]`

- **POST** `/clientes`
  - **Descrição:** Cria novo cliente.
  - **Body:** `{ nome, email, telefone, ... }`
  - **Resposta:**
    - 201: `{ ...cliente }`
    - 400: `{ error: 'Dados inválidos' }`

- **GET** `/clientes/{id}`
  - **Descrição:** Busca cliente por ID.
  - **Resposta:**
    - 200: `{ ...cliente }`
    - 404: `{ error: 'Cliente não encontrado' }`

---

## Profissionais

- **GET** `/profissionais?negocio={business_id}`
  - **Descrição:** Lista profissionais do negócio.
  - **Parâmetros:**
    - `business_id` (UUID, obrigatório)
  - **Resposta:**
    - 200: `[{ ...profissional }]`

- **POST** `/profissionais`
  - **Descrição:** Cria novo profissional.
  - **Body:** `{ nome, email, especialidades, ... }`
  - **Resposta:**
    - 201: `{ ...profissional }`
    - 400: `{ error: 'Dados inválidos' }`

---

## Serviços

- **GET** `/servicos?negocio={business_id}`
  - **Descrição:** Lista serviços do negócio.
  - **Parâmetros:**
    - `business_id` (UUID, obrigatório)
  - **Resposta:**
    - 200: `[{ ...servico }]`

- **POST** `/servicos`
  - **Descrição:** Cria novo serviço.
  - **Body:** `{ nome, descricao, preco, duracao, ... }`
  - **Resposta:**
    - 201: `{ ...servico }`
    - 400: `{ error: 'Dados inválidos' }`

---

## Agendamentos

- **GET** `/agendamentos?negocio={business_id}&data_inicial=YYYY-MM-DD&data_final=YYYY-MM-DD`
  - **Descrição:** Lista agendamentos do negócio em um período.
  - **Parâmetros:**
    - `business_id` (UUID, obrigatório)
    - `data_inicial` (string, opcional)
    - `data_final` (string, opcional)
  - **Resposta:**
    - 200: `[{ ...agendamento }]`

- **POST** `/agendamentos`
  - **Descrição:** Cria novo agendamento (verifica conflitos).
  - **Body:** `{ cliente_id, profissional_id, servico_id, data_hora, ... }`
  - **Resposta:**
    - 201: `{ ...agendamento }`
    - 409: `{ error: 'Conflito de horário' }`

- **PATCH** `/agendamentos/{id}`
  - **Descrição:** Atualiza agendamento.
  - **Body:** `{ ...campos a atualizar }`
  - **Resposta:**
    - 200: `{ ...agendamento }`
    - 404: `{ error: 'Agendamento não encontrado' }`

- **DELETE** `/agendamentos/{id}`
  - **Descrição:** Remove agendamento.
  - **Resposta:**
    - 204: (sem conteúdo)
    - 404: `{ error: 'Agendamento não encontrado' }`

---

## Funções RPC e Estatísticas

- **POST** `/rpc/fetch_agendamentos`
  - **Descrição:** Busca agendamentos de múltiplas tabelas (compatibilidade).
  - **Body:** `{ business_id: UUID }`
  - **Resposta:**
    - 200: `[{ id, data, hora_inicio, status, cliente_nome }]`

- **POST** `/rpc/get_business_stats`
  - **Descrição:** KPIs do negócio.
  - **Body:** `{ business_id: UUID }`
  - **Resposta:**
    - 200: `{ total_clients, total_appointments, total_revenue, active_professionals }`

- **POST** `/rpc/get_client_stats`
  - **Descrição:** Estatísticas do cliente.
  - **Body:** `{ client_id: UUID }`
  - **Resposta:**
    - 200: `{ total_appointments, total_spent, average_appointment_value, ... }`

---

## Observações Gerais

- **Multi-tenant:** Sempre filtrar por `business_id`/`id_negocio`.
- **Segurança:** RLS ativo, policies garantem acesso apenas ao próprio negócio.
- **Internacionalização:** Mensagens de erro e respostas seguem idioma do usuário (PT/EN).
- **Status Codes:** 200 (OK), 201 (Criado), 204 (Sem conteúdo), 400 (Erro de validação), 401 (Não autorizado), 404 (Não encontrado), 409 (Conflito).
- **Edge cases:**
  - Conflitos de agendamento.
  - Dados inconsistentes entre tabelas (campos `id_negocio`, `business_id`, `tenant_id`).
  - Funções RPC podem retornar array vazio se não houver dados.

---

**Última atualização:** [DATA_ATUALIZACAO] 