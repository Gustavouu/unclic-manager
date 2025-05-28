## <ProfessionalList />

Exibe a lista de profissionais do negócio, com opções de filtro e seleção.

**Props:**
- `filter?: string` – Filtro de busca por nome/especialidade.
- `onSelect?: (professionalId: string) => void` – Callback ao selecionar um profissional.

**Exemplo de uso:**
```tsx
<ProfessionalList filter="João" onSelect={handleSelectProfessional} />
```

**Acessibilidade:**
- Navegável por teclado.
- Labels e feedbacks internacionalizados.

---

## <ServiceList />

Lista de serviços cadastrados, com filtros por categoria e status.

**Props:**
- `category?: string` – Filtro por categoria.
- `activeOnly?: boolean` – Exibe apenas serviços ativos.
- `onSelect?: (serviceId: string) => void` – Callback ao selecionar um serviço.

**Exemplo de uso:**
```tsx
<ServiceList category="Beleza" activeOnly onSelect={handleSelectService} />
```

**Acessibilidade:**
- Todos os itens são acessíveis por teclado.
- Feedback visual para loading e erros.

---

## <ProductList />

Exibe a lista de produtos do estoque, com filtros e ações rápidas.

**Props:**
- `lowStockOnly?: boolean` – Exibe apenas produtos com estoque baixo.
- `onSelect?: (productId: string) => void` – Callback ao selecionar um produto.

**Exemplo de uso:**
```tsx
<ProductList lowStockOnly onSelect={handleSelectProduct} />
```

**Acessibilidade:**
- Navegação por teclado garantida.
- Cores e ícones acessíveis.

---

## <BusinessSettings />

Componente de configurações do negócio (dados, preferências, integrações).

**Props:**
- `businessId: string` – ID do negócio a ser configurado.
- `onSave?: (settings: any) => void` – Callback ao salvar configurações.

**Exemplo de uso:**
```tsx
<BusinessSettings businessId={currentBusinessId} onSave={handleSaveSettings} />
```

**Acessibilidade:**
- Formulários com labels e feedbacks claros.
- Suporte a navegação por teclado e leitores de tela.

---

## <KpiCards />

Exibe indicadores-chave de performance (KPIs) do negócio, como total de agendamentos, receita, clientes ativos, etc.

**Props:**
- `data: KpiData[]` – Array de objetos com os dados dos KPIs a serem exibidos.

**Exemplo de uso:**
```tsx
<KpiCards data={kpiData} />
```

**Acessibilidade:**
- KPIs possuem descrição textual para leitores de tela.
- Cores acessíveis para daltônicos.

---

## <Sidebar />

Menu lateral de navegação para o painel administrativo.

**Props:**
- `items: SidebarItem[]` – Lista de itens de menu (label, ícone, rota).
- `onSelect?: (route: string) => void` – Callback ao selecionar um item.

**Exemplo de uso:**
```tsx
<Sidebar items={sidebarItems} onSelect={handleMenuSelect} />
```

**Acessibilidade:**
- Navegação por teclado garantida.
- Labels e ícones com descrição para leitores de tela.

---

## <Modal />

Componente genérico para exibir diálogos e formulários em overlay.

**Props:**
- `open: boolean` – Controla a visibilidade do modal.
- `onClose: () => void` – Callback ao fechar o modal.
- `title?: string` – Título do modal.
- `children: React.ReactNode` – Conteúdo do modal.

**Exemplo de uso:**
```tsx
<Modal open={isOpen} onClose={closeModal} title="Novo Cliente">
  <ClientForm onSubmit={handleCreateClient} />
</Modal>
```

**Acessibilidade:**
- Usa `role="dialog"` e `aria-modal="true"`.
- Foco é movido para o modal ao abrir e retorna ao fechar.

---

## <FormField />

Componente reutilizável para campos de formulário com label, input e feedback.

**Props:**
- `label: string` – Label do campo.
- `name: string` – Nome do campo.
- `type?: string` – Tipo do input (default: text).
- `value: any` – Valor do campo.
- `onChange: (e) => void` – Handler de mudança.
- `error?: string` – Mensagem de erro.

**Exemplo de uso:**
```tsx
<FormField label="E-mail" name="email" value={email} onChange={handleChange} error={emailError} />
```

**Acessibilidade:**
- Label associado ao input via `htmlFor`/`id`.
- Mensagem de erro com `aria-live` para feedback imediato.

---

## <ErrorMessage />

Exibe mensagens de erro de forma centralizada e acessível.

**Props:**
- `message: string` – Mensagem de erro a ser exibida.

**Exemplo de uso:**
```tsx
<ErrorMessage message={t('errors.requiredField')} />
```

**Acessibilidade:**
- Usa `role="alert"` e `aria-live="assertive"` para leitura imediata por leitores de tela.

---

## Integração com Hooks e Contextos

Exemplo de uso de hooks de dados e contexto de autenticação:

```tsx
import { useClients } from '@/hooks/useClients';
import { useAuth } from '@/contexts/AuthContext';

function ClientsPage() {
  const { clients, isLoading, error } = useClients();
  const { user } = useAuth();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return <ClientList clients={clients} />;
}
```

- Todos os componentes podem ser integrados com hooks de dados, autenticação, tema e acessibilidade.
- Recomenda-se sempre usar hooks/contextos para lógica de negócio e manter componentes focados em UI e acessibilidade.

---

## Exemplo de Composição de Componentes

```tsx
<DashboardLayout>
  <KpiCards />
  <AppointmentCalendar initialView="month" />
  <ClientList onSelect={handleSelectClient} />
</DashboardLayout>
```

- Todos os componentes podem ser combinados para criar fluxos completos e responsivos.
- Props e eventos permitem integração fácil entre componentes.

---

## <Spinner />

Componente utilitário para exibir indicador de carregamento (loading spinner).

**Props:**
- `size?: string | number` – Tamanho do spinner (ex: 'sm', 'md', 'lg', 32).
- `color?: string` – Cor do spinner.
- `ariaLabel?: string` – Descrição para acessibilidade (default: "Carregando...").

**Exemplo de uso:**
```tsx
<Spinner size="md" color="#6366f1" ariaLabel="Carregando dados" />
```

**Acessibilidade:**
- Usa `role="status"` e `aria-live="polite"`.
- Sempre forneça um `ariaLabel` descritivo.

---

## <Skeleton />

Componente utilitário para exibir placeholder de carregamento (efeito shimmer).

**Props:**
- `width?: string | number` – Largura do skeleton.
- `height?: string | number` – Altura do skeleton.
- `radius?: string | number` – Raio de borda.
- `count?: number` – Quantidade de linhas/itens.

**Exemplo de uso:**
```tsx
<Skeleton width={200} height={24} radius={4} />
<Skeleton count={3} />
```

**Acessibilidade:**
- Usa `aria-busy="true"` enquanto o conteúdo real não é carregado.

---

## <ThemeProvider />

Provider global para alternância de temas (claro/escuro/alto contraste).

**Props:**
- `children: React.ReactNode` – Componentes filhos.
- `defaultTheme?: 'light' | 'dark' | 'system'` – Tema inicial.
- `enableHighContrast?: boolean` – Habilita suporte a contraste alto.

**Exemplo de uso:**
```tsx
<ThemeProvider defaultTheme="system" enableHighContrast>
  <App />
</ThemeProvider>
```

**Acessibilidade:**
- Permite alternância de tema via contexto ou controles na interface.
- Suporte a preferências do usuário (ex: `prefers-color-scheme`).

---

## Composição Avançada e Customização

- Todos os componentes utilitários podem ser combinados para criar experiências de carregamento e feedback visual sofisticadas.
- Exemplo de composição:
```tsx
<Card>
  {isLoading ? <Skeleton height={32} count={2} /> : <KpiCards data={kpiData} />}
</Card>
```
- O ThemeProvider pode ser usado em conjunto com contextos de acessibilidade para oferecer temas customizados, contraste alto e fontes maiores.
- Props de estilo (size, color, radius) permitem customização visual sem perder acessibilidade.
- Recomenda-se sempre fornecer descrições acessíveis (`ariaLabel`, `aria-busy`, etc.) para componentes de feedback visual.

---

**Observação:**
- Consulte os arquivos `.tsx` para detalhes de props avançadas e exemplos de customização.
- Todos os utilitários seguem padrão de acessibilidade e integração com temas/contextos globais.

**Observação:**
- Para detalhes de props e tipos, consulte os arquivos `.tsx` e os tipos TypeScript exportados.
- Todos os exemplos seguem padrão de internacionalização e acessibilidade.

---

## <AppointmentList />

Exibe a lista de agendamentos do negócio, com filtros por profissional, cliente, status e período.

**Props:**
- `businessId: string` – ID do negócio (multi-tenant).
- `professionalId?: string` – Filtro por profissional.
- `clientId?: string` – Filtro por cliente.
- `status?: string` – Filtro por status (agendado, confirmado, concluído, cancelado).
- `dateRange?: { start: string; end: string }` – Período de busca.
- `onSelect?: (appointmentId: string) => void` – Callback ao selecionar um agendamento.

**Exemplo de uso:**
```tsx
<AppointmentList businessId={currentBusinessId} status="agendado" onSelect={handleSelectAppointment} />
```

**Acessibilidade:**
- Navegação por teclado e leitores de tela.
- Feedback visual para loading, erros e estados vazios.

**Internacionalização:**
- Datas, status e mensagens traduzidas.

---

## <ClientForm />

Formulário para cadastro/edição de clientes.

**Props:**
- `businessId: string` – ID do negócio (multi-tenant).
- `client?: Client` – Cliente para edição.
- `onSubmit: (data: Client) => void` – Callback ao salvar.
- `onCancel?: () => void` – Callback ao cancelar.

**Exemplo de uso:**
```tsx
<ClientForm businessId={currentBusinessId} onSubmit={handleSaveClient} />
```

**Acessibilidade:**
- Labels, feedbacks e navegação por teclado.
- Mensagens de erro com `aria-live`.

**Internacionalização:**
- Placeholders, labels e mensagens traduzidas.

---

## <BusinessKpi />

Exibe KPIs do negócio (clientes, agendamentos, receita, profissionais ativos).

**Props:**
- `businessId: string` – ID do negócio.
- `onLoad?: (data: KpiData) => void` – Callback ao carregar dados.

**Exemplo de uso:**
```tsx
<BusinessKpi businessId={currentBusinessId} />
```

**Acessibilidade:**
- KPIs com descrição textual e cores acessíveis.

**Internacionalização:**
- Nomes dos KPIs e valores formatados conforme idioma/moeda.

---

## Observações Gerais

- Todos os componentes aceitam props de acessibilidade e integração com hooks/contextos globais.
- Recomenda-se sempre passar o `businessId` para garantir multi-tenant.
- Edge cases: estados vazios, erros de permissão, dados inconsistentes.
- Exemplos de composição e integração com hooks estão no final do arquivo. 