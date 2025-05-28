# Auditoria de Acessibilidade – UnCliC Manager

## 1. Escopo da Auditoria

- **Fluxos auditados:**
  - Login e autenticação
  - Cadastro de cliente
  - Agendamento
  - Navegação principal (sidebar, menus)
  - Formulários (clientes, profissionais, serviços)
  - Relatórios e dashboards
  - Configurações do negócio
- **Componentes auditados:**
  - Listagens, formulários, modais, feedbacks, utilitários (Spinner, Skeleton, etc.)
- **Temas:** Claro, escuro, alto contraste
- **Idiomas:** PT e EN

---

## 2. Metodologia

- **Ferramentas automáticas:** axe-core, Lighthouse, WAVE
- **Testes manuais:**
  - Navegação por teclado (Tab, Shift+Tab, Enter, Espaço, Esc)
  - Leitores de tela (NVDA, VoiceOver)
  - Teste de contraste de cores
  - Teste de responsividade e zoom
- **Checklist WCAG 2.1 AA:**
  - Perceptível: textos alternativos, contraste, feedback visual
  - Operável: navegação por teclado, foco visível, skip links
  - Compreensível: labels, instruções, mensagens de erro claras
  - Robusto: compatibilidade com tecnologias assistivas

---

## 3. Checklist de Acessibilidade

| Critério WCAG         | Descrição                                      | Status  | Observações/Prints |
|---------------------- |-----------------------------------------------|---------|-------------------|
| Textos alternativos   | Imagens e ícones possuem alt/aria-label        | [ ]     |                   |
| Contraste de cores    | Contraste mínimo 4.5:1                        | [ ]     |                   |
| Navegação por teclado | Todos os fluxos acessíveis sem mouse           | [ ]     |                   |
| Foco visível          | Foco claro e consistente em todos os elementos | [ ]     |                   |
| Skip links            | Link para pular navegação presente             | [ ]     |                   |
| Labels e instruções   | Campos de formulário com label/instrução clara | [ ]     |                   |
| Mensagens de erro     | Feedback de erro acessível e descritivo        | [ ]     |                   |
| ARIA roles/states     | Uso correto de roles, states e landmarks       | [ ]     |                   |
| Responsividade/Zoom   | Layout funcional em zoom e mobile              | [ ]     |                   |
| Leitores de tela      | Compatível com NVDA/VoiceOver                  | [ ]     |                   |
| Internacionalização   | Mensagens acessíveis em PT/EN                  | [ ]     |                   |

---

## 4. Pontos de Conformidade e Não Conformidade

- **Conformidades:**
  - (Exemplo) Todos os botões possuem foco visível e descrição ARIA.
- **Não conformidades:**
  - (Exemplo) Contraste insuficiente em botões secundários (print abaixo).
  - (Exemplo) Falta de skip link na navegação principal.

---

## 5. Sugestões de Correção e Priorização

- (Exemplo) Ajustar contraste dos botões para mínimo 4.5:1 (alta prioridade)
- (Exemplo) Adicionar skip link antes do menu lateral (média prioridade)
- (Exemplo) Revisar labels de campos obrigatórios (baixa prioridade)

---

## 6. Plano de Ação

- [ ] Corrigir contrastes
- [ ] Implementar skip links
- [ ] Revisar labels e mensagens de erro
- [ ] Testar novamente com leitores de tela

---

## 7. Anexos (Prints, Evidências)

- (Inserir prints e descrições dos problemas encontrados)

---

**Última atualização:** [DATA_ATUALIZACAO] 