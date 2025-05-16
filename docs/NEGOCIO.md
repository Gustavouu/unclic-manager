# Análise de Negócio

## 1. Visão Geral do Domínio

O UnCliC Manager é uma solução SaaS para gestão de negócios baseados em serviços agendados, como salões de beleza, clínicas, consultórios e prestadores de serviços. O domínio de negócio abrange desde o onboarding do estabelecimento até a gestão diária de agendamentos, clientes, profissionais, serviços, pagamentos e relatórios.

## 2. Principais Entidades e Relacionamentos

- **Business (Negócio):** Representa o estabelecimento, centraliza dados, configurações e usuários.
- **User (Usuário):** Pode ser proprietário, administrador, profissional ou staff. Relaciona-se a um ou mais negócios.
- **Professional (Profissional):** Prestador de serviço vinculado a um negócio.
- **Client (Cliente):** Consumidor dos serviços, pode ter histórico, fidelidade e segmentação.
- **Service (Serviço):** Serviços oferecidos pelo negócio, com duração, preço e descrição.
- **Appointment (Agendamento):** Reserva de um serviço para um cliente em um horário com um profissional.
- **Payment (Pagamento):** Registro de transações financeiras, integrado ao gateway EFI Pay.

## 3. Regras de Negócio

### 3.1 Agendamento
- Não permitir agendamento em horários já ocupados para o mesmo profissional.
- Validar disponibilidade do profissional e do serviço.
- Permitir reagendamento e cancelamento conforme política do negócio.
- Suportar agendamentos recorrentes (futuro).

### 3.2 Pagamentos
- Registrar pagamentos no momento do agendamento ou após o serviço.
- Integrar com gateway EFI Pay para cobranças e conciliação.
- Permitir diferentes métodos de pagamento (PIX, cartão, dinheiro).

### 3.3 Fidelidade e Notificações
- Acumular pontos de fidelidade por serviço realizado.
- Notificar clientes sobre agendamentos, confirmações e cancelamentos.
- Enviar lembretes automáticos por e-mail, SMS ou WhatsApp.

### 3.4 Permissões e Multi-Tenancy
- Isolar dados por business_id.
- Controlar permissões por papel (RBAC) e políticas RLS.
- Permitir múltiplos usuários por negócio, com diferentes níveis de acesso.

## 4. Fluxos Operacionais

### 4.1 Onboarding
1. Cadastro do negócio
2. Configuração inicial (serviços, profissionais, horários)
3. Importação de clientes (opcional)
4. Ativação do sistema

### 4.2 Agendamento
1. Seleção de serviço e profissional
2. Escolha de data e horário disponível
3. Confirmação do agendamento
4. Notificação ao cliente e profissional

### 4.3 Faturamento
1. Registro do serviço realizado
2. Geração de cobrança
3. Recebimento e conciliação
4. Emissão de recibo

### 4.4 Relatórios
1. Relatórios de agendamentos (por período, profissional, serviço)
2. Relatórios financeiros (receita, inadimplência, comissões)
3. Relatórios de clientes (frequência, fidelidade)

## 5. Métricas e Indicadores de Sucesso

- Taxa de ocupação de agenda
- Receita por período/profissional/serviço
- Taxa de cancelamento e no-show
- Satisfação do cliente (NPS, avaliações)
- Engajamento com notificações
- Crescimento da base de clientes

## 6. Plano de Ação

### 6.1 Curto Prazo
1. Finalizar fluxo de agendamento e pagamentos
2. Implementar notificações automáticas
3. Garantir isolamento multi-tenant e RBAC

### 6.2 Médio Prazo
1. Adicionar agendamento recorrente e fila de espera
2. Integrar relatórios avançados e dashboard
3. Otimizar fluxo de onboarding

### 6.3 Longo Prazo
1. Implementar sistema de fidelidade completo
2. Adicionar recursos de marketing e campanhas
3. Integrar IA para insights e recomendações

## 7. Conclusão

O domínio de negócio do UnCliC Manager foi desenhado para cobrir todas as operações essenciais de negócios de serviços agendados, com foco em automação, eficiência operacional, experiência do cliente e escalabilidade. O plano de ação garante evolução contínua e alinhamento com as necessidades do mercado. 