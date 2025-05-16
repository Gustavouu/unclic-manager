# Analytics e Métricas de Produto

## 1. Visão Geral

Esta documentação detalha como o UnCliC Manager coleta, armazena, analisa e utiliza métricas de uso, engajamento e negócio. O objetivo é garantir decisões orientadas a dados, identificar oportunidades de melhoria e medir o sucesso das funcionalidades.

## 2. Métricas de Negócio

- **MRR (Monthly Recurring Revenue):** Receita recorrente mensal.
- **Churn Rate:** Taxa de cancelamento de clientes.
- **LTV (Lifetime Value):** Valor do tempo de vida do cliente.
- **CAC (Customer Acquisition Cost):** Custo de aquisição de cliente.
- **NPS (Net Promoter Score):** Satisfação do cliente.
- **ARPU (Average Revenue Per User):** Receita média por usuário.

## 3. Métricas de Produto

- **DAU/MAU (Usuários Ativos Diários/Mensais):** Engajamento da base.
- **Funil de Conversão:** Taxa de conversão em cada etapa (onboarding, agendamento, pagamento).
- **Tempo de Sessão:** Duração média de uso por sessão.
- **Retenção de Usuários:** Percentual de usuários que retornam após X dias.
- **Taxa de No-show:** Percentual de agendamentos não comparecidos.
- **Engajamento com Notificações:** Taxa de abertura/click em notificações.

## 4. Ferramentas e Instrumentação

- **Google Analytics:** Monitoramento de páginas, eventos e funis.
- **Mixpanel/Amplitude:** Análise de eventos customizados e coorte.
- **Supabase Analytics:** Métricas de banco e API.
- **DataDog/Grafana:** Dashboards de infraestrutura e performance.
- **Custom Events:** Instrumentação via hooks e middlewares.

## 5. Eventos Customizados

### 5.1 Exemplos de Eventos
- `user_signup`: Cadastro de novo usuário
- `business_created`: Criação de novo negócio
- `appointment_booked`: Novo agendamento realizado
- `appointment_cancelled`: Cancelamento de agendamento
- `payment_completed`: Pagamento realizado
- `notification_clicked`: Notificação aberta/clicada

### 5.2 Instrumentação no Código
```typescript
// Exemplo de evento customizado
const trackEvent = (event: string, data: any) => {
  window.analytics?.track(event, data);
};

// Uso
trackEvent('appointment_booked', {
  userId: user.id,
  businessId: business.id,
  serviceId: service.id,
  date: appointment.date
});
```

## 6. Dashboards e Relatórios

- **Dashboards de Produto:** Funil de onboarding, agendamentos, pagamentos.
- **Dashboards de Negócio:** Receita, churn, LTV, CAC.
- **Alertas:** Notificações automáticas para métricas críticas (ex: aumento de churn, queda de conversão).
- **Relatórios Periódicos:** Envio semanal/mensal para stakeholders.

## 7. Plano de Evolução

### 7.1 Curto Prazo
- Padronizar eventos e nomenclatura
- Garantir instrumentação em todos os fluxos críticos
- Criar dashboards básicos para produto e negócio

### 7.2 Médio Prazo
- Implementar coortes e segmentação avançada
- Automatizar alertas e relatórios
- Integrar métricas de satisfação (NPS, avaliações)

### 7.3 Longo Prazo
- Implementar modelos preditivos (churn, upsell)
- Integrar IA para insights automáticos
- Evoluir dashboards para autoatendimento

## 8. Conclusão

A cultura de dados é fundamental para o crescimento sustentável do UnCliC Manager. A documentação de analytics garante que todos os times possam tomar decisões baseadas em evidências, promovendo evolução contínua do produto e do negócio. 