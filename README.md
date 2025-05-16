# UnCliC Manager

Sistema de gestão para negócios baseados em serviços agendados, como salões de beleza, barbearias, clínicas estéticas e consultórios.

## 📚 Documentação

A documentação completa do projeto está organizada nos seguintes arquivos:

- [PRD e Schema](docs/PRD_AND_SCHEMA.md) - Documento de requisitos e schema do banco de dados
- [Análise do Sistema](docs/ANALISE_SISTEMA.md) - Análise detalhada, bugs, gaps e oportunidades
- [Estrutura do Projeto](docs/ESTRUTURA_PROJETO.md) - Estrutura de arquivos e dependências
- [Sistema de Agendamentos](docs/sistema-agendamentos.md) - Detalhes do sistema de agendamentos
- [Sistema de Permissões](docs/sistema-permissoes.md) - Sistema de permissões e RBAC
- [Políticas de Segurança](docs/politicas-seguranca.md) - Políticas de segurança e RLS
- [Integração API](docs/integracao-api.md) - Documentação da API e integrações
- [Multi-tenancy](docs/multitenancy.md) - Arquitetura multi-tenant
- [Database Schema](docs/database-schema.md) - Schema completo do banco de dados
- [Armazenamento de Arquivos](docs/armazenamento-arquivos.md) - Sistema de armazenamento
- [Autenticação](docs/autenticacao.md) - Sistema de autenticação

## 🚀 Tecnologias

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **UI**: shadcn/ui, Radix UI
- **Estado**: Zustand
- **Formulários**: React Hook Form, Zod
- **Testes**: Vitest, Testing Library
- **Linting**: ESLint, Prettier

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/unclic-manager.git
cd unclic-manager
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run test` - Roda os testes
- `npm run test:coverage` - Cobertura de testes
- `npm run lint` - Roda o ESLint
- `npm run format` - Formata o código

## 🔧 Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Configure as variáveis de ambiente com as credenciais
3. Execute as migrações do banco de dados
4. Configure as políticas RLS
5. Implemente as Edge Functions necessárias

## 🧪 Testes

O projeto usa Vitest e Testing Library para testes. Para rodar os testes:

```bash
npm run test
```

Para ver a cobertura:

```bash
npm run test:coverage
```

## 📝 Convenções de Código

- **Componentes**: PascalCase
- **Hooks**: camelCase com prefixo 'use'
- **Utilitários**: camelCase
- **Tipos/Interfaces**: PascalCase
- **Arquivos**: kebab-case

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para suporte@unclic.com.br ou abra uma issue no GitHub.

## 🙏 Agradecimentos

- [Supabase](https://supabase.com)
- [Vite](https://vitejs.dev)
- [React](https://reactjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
