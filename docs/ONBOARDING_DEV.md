# Onboarding de Novos Desenvolvedores

## 1. Boas-vindas e Visão do Produto

Bem-vindo ao UnCliC Manager! Aqui você fará parte de um time que valoriza colaboração, inovação, qualidade e impacto real na vida de milhares de negócios de serviços. Nossa missão é simplificar a gestão, potencializar resultados e criar experiências incríveis para nossos clientes.

## 2. Stack e Ferramentas

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Testes:** Vitest, Testing Library
- **DevOps:** GitHub Actions, Docker, Supabase CLI
- **Monitoramento:** DataDog, Grafana, Supabase Analytics
- **Comunicação:** Slack, Notion, Google Meet

## 3. Setup do Ambiente

1. Clone o repositório: `git clone https://github.com/seu-usuario/unclic-manager.git`
2. Instale as dependências: `npm install`
3. Copie o arquivo de variáveis: `cp .env.example .env`
4. Configure as variáveis de ambiente conforme o Notion do time
5. Inicie o servidor local: `npm run dev`
6. Execute os testes: `npm run test`
7. Consulte a documentação em `/docs` para detalhes de arquitetura, API e integrações

## 4. Fluxo de Trabalho (PR, Code Review, Deploy)

- **Branching:**
  - `main`: produção
  - `develop`: homologação
  - `feature/*`, `bugfix/*`, `hotfix/*`: desenvolvimento
- **Pull Requests:**
  - Sempre crie PRs para `develop` (ou `main` em hotfixes)
  - Descreva claramente o objetivo, contexto e testes realizados
  - Adicione reviewers e siga o checklist de PR
- **Code Review:**
  - Feedback construtivo, foco em clareza, segurança e performance
  - Siga padrões de código e arquitetura definidos em `/docs`
- **Deploy:**
  - Automatizado via GitHub Actions
  - Deploys em produção apenas com aprovação dupla
  - Rollback documentado em caso de falha

## 5. Boas Práticas de Código e Testes

- Componentes pequenos, funções puras e reutilizáveis
- Tipagem forte com TypeScript
- Validação e sanitização de dados de entrada
- Testes unitários e de integração para novas features
- Documentação de código e exemplos de uso
- Tratamento de erros e feedbacks amigáveis
- Respeito à acessibilidade e responsividade

## 6. Cultura, Comunicação e Feedback

- Comunicação aberta e respeitosa (Slack, reuniões semanais)
- Feedbacks frequentes e construtivos
- Cultura de aprendizado contínuo e compartilhamento
- Participação em decisões técnicas e de produto
- Valorização da diversidade e inclusão

## 7. Dicas e Links Úteis

- Documentação oficial do projeto: `/docs`
- Guia de API e integrações: `/docs/API.md`, `/docs/INTEGRACOES.md`
- Padrões de código: `/docs/ESTRUTURA_PROJETO.md`, `/docs/ARQUITETURA.md`
- FAQ e troubleshooting: `/docs/SUPORTE_OPERACAO.md`
- Contato do time: #dev-unclic no Slack
- Onboarding detalhado: Notion do time

## 8. Conclusão

Seu sucesso é o sucesso do UnCliC Manager! Não hesite em perguntar, sugerir melhorias e contribuir para a evolução do produto. Estamos juntos para criar algo grande, seguro e escalável. 