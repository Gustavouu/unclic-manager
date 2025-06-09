# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/e8f2341b-e418-4013-abc5-6be07f0520f4

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e8f2341b-e418-4013-abc5-6be07f0520f4) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e8f2341b-e418-4013-abc5-6be07f0520f4) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Testes e Checklist de Produção

### Cobertura de Testes Unitários

```sh
npm run test:coverage
```
O relatório será gerado na pasta `coverage/`.

### Testes E2E

```sh
npm run cy:run
```
O relatório será exibido no terminal. Para modo visual, use `npm run cy:open`.

### Checklist Automatizado de Produção

```sh
node scripts/checklist-producao.cjs
```
O script valida pré-requisitos essenciais antes do deploy.

## Novos Módulos

O projeto agora inclui funcionalidades adicionais que estavam pendentes no PRD:

- **Integração real com Google Calendar** em `src/services/calendar/GoogleCalendarService.ts`.
- **Suporte a iCal e Outlook** com `IcalCalendarService` e `OutlookCalendarService`.
- **Listas de espera** através do `WaitlistService`.
- **Agendamentos recorrentes** via `RecurringAppointmentService`.
- **Programa de fidelidade** implementado no `LoyaltySystem`.
- **Envio de mensagens WhatsApp** usando o `WhatsAppService`.
- **Integrações de marketing** por `MarketingIntegrationService`.
- **Cálculo de comissões** com `CommissionService`.
- **Reembolsos automáticos** com `RefundService`.
- **Emissão de NF-e/NFS-e** pelo `NfeService`.
- **Pagamentos presenciais** via `POSPaymentService`.
- Diretórios `mobile/`, `totem/` e `voice-server/` iniciam os aplicativos móveis, totem de autoatendimento e servidor de comandos de voz.

### Backup e Rollback

Execute `scripts/backup.sh` para gerar um `backup.sql` e mantenha `scripts/rollback.sql` atualizado para desfazer a última migração.

### Pipeline CI

O repositório inclui o workflow `.github/workflows/ci.yml` que roda `npm run lint`, `npm run test` e `npm run build` em cada PR.
