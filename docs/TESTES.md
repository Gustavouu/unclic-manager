# Documentação de Testes – UnCliC Manager

## Estratégia Geral

- Testes unitários para componentes, hooks e serviços (Jest/Vitest).
- Testes E2E para fluxos críticos (Cypress/Playwright).
- Mocks para integrações externas (Supabase, APIs de terceiros).
- Cobertura mínima recomendada: 80% dos fluxos críticos.

---

## Testes Unitários

- **Componentes:**
  - Renderização, props, eventos, acessibilidade (ex: navegação por teclado, ARIA).
  - Exemplo:
    ```tsx
    import { render, screen } from '@testing-library/react';
    import { Spinner } from '@/components/ui/spinner';
    test('exibe spinner com aria-label', () => {
      render(<Spinner ariaLabel="Carregando" />);
      expect(screen.getByLabelText('Carregando')).toBeInTheDocument();
    });
    ```
- **Hooks:**
  - Testes de estados, efeitos e integração com contextos.
- **Serviços:**
  - Testes de chamadas à API, tratamento de erros, edge cases (ex: multi-tenant, dados inconsistentes).
  - Exemplo:
    ```ts
    import { fetchClients } from '@/services/clientService';
    test('retorna clientes do negócio', async () => {
      const clients = await fetchClients('business-id-mock');
      expect(clients).toBeInstanceOf(Array);
    });
    ```

---

## Testes E2E

- **Fluxos cobertos:**
  - Login, cadastro de cliente, agendamento, edição/cancelamento, relatórios, permissões.
- **Exemplo (Cypress):**
    ```js
    it('deve criar um novo cliente', () => {
      cy.login('admin@teste.com', 'senha123');
      cy.visit('/clientes');
      cy.get('button[nome="Novo Cliente"]').click();
      cy.get('input[name="nome"]').type('Cliente Teste');
      cy.get('form').submit();
      cy.contains('Cliente Teste').should('exist');
    });
    ```
- **Acessibilidade:**
  - Testes automáticos com axe-core, navegação por teclado, contraste, foco visível.

---

## Mocks e Integrações

- **Supabase:**
  - Uso de mocks para simular respostas de queries/mutations.
  - Exemplo:
    ```ts
    jest.mock('@/integrations/supabase/client', () => ({
      supabase: { from: jest.fn().mockReturnValue({ select: jest.fn() }) }
    }));
    ```
- **APIs externas:**
  - Mocks para webhooks, pagamentos, notificações.

---

## Edge Cases e Cobertura

- Testar permissões (RLS), erros de autenticação, dados inconsistentes, conflitos de agendamento.
- Testar diferentes perfis de usuário (admin, profissional, recepcionista).
- Testar internacionalização (PT/EN) nos fluxos principais.

---

## Como rodar os testes

- **Unitários:**
  - `npm run test` ou `npx vitest`
- **E2E:**
  - `npx cypress open` ou `npx playwright test`

---

**Última atualização:** [DATA_ATUALIZACAO] 