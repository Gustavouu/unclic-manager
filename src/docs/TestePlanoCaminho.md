
# Plano de Teste - Tela de Configurações

Este documento descreve o plano de teste para a tela de Configurações, abrangendo testes de caminho feliz e testes de regressão.

## Teste de Caminho Feliz

### 1. Navegação por Abas

| Teste | Passos | Resultado Esperado |
|-------|--------|-------------------|
| Clicar em cada aba | 1. Clicar em cada uma das abas disponíveis | Todas as abas devem ser clicáveis e destacar quando ativas |
| Verificar conteúdo | 1. Clicar em "Perfil do Negócio"<br>2. Clicar em "Serviços"<br>3. Clicar em "Funcionários", etc. | O conteúdo correto deve ser exibido para cada aba selecionada |
| Destacar aba ativa | 1. Clicar em qualquer aba | A aba selecionada deve ter um estilo visual diferenciado (cor de fundo primária) |

### 2. Interações de Formulário

| Teste | Passos | Resultado Esperado |
|-------|--------|-------------------|
| Campos de texto | 1. Clicar em campos de texto<br>2. Digitar texto | Os campos devem permitir entrada de texto |
| Campos obrigatórios | 1. Limpar campos obrigatórios<br>2. Clicar em "Salvar Alterações" | Mensagens de erro devem aparecer para campos obrigatórios vazios |
| Validação de formato | 1. Inserir um email inválido<br>2. Inserir um telefone em formato inválido | Mensagens de erro específicas devem ser exibidas |
| Seleção em dropdowns | 1. Clicar em campos de seleção<br>2. Selecionar uma opção | O dropdown deve abrir e permitir seleção |
| Alternância de switches | 1. Clicar em switches | Os switches devem alternar entre estado ligado/desligado |
| Áreas de texto | 1. Clicar em áreas de texto maiores<br>2. Digitar várias linhas | As áreas de texto devem aceitar múltiplas linhas |

### 3. Funcionalidade de Botões

| Teste | Passos | Resultado Esperado |
|-------|--------|-------------------|
| Botão "Salvar Alterações" | 1. Preencher formulário<br>2. Clicar em "Salvar Alterações" | Deve mostrar feedback de salvamento (spinner e toast) |
| Botão "Cancelar" | 1. Modificar dados<br>2. Clicar em "Cancelar" | Deve restaurar os dados originais |
| Botões de ação específicos | 1. Clicar em "Adicionar Serviço", "Convidar Funcionário", etc. | Cada botão deve responder com a ação apropriada |
| Estado de desabilitado | 1. Clicar em "Salvar" durante o processo de salvamento | Botão deve ficar desabilitado durante o processamento |

### 4. Upload de Imagem

| Teste | Passos | Resultado Esperado |
|-------|--------|-------------------|
| Botões de upload | 1. Clicar nos botões "Alterar Logotipo" e "Alterar Imagem" | Os botões devem ser clicáveis e oferecer feedback |

## Teste de Regressão

### 1. Persistência de Dados

| Teste | Passos | Resultado Esperado |
|-------|--------|-------------------|
| Persistência entre abas | 1. Preencher dados em uma aba<br>2. Navegar para outra aba<br>3. Voltar à aba original | Os dados inseridos devem persistir |
| Restaurar ao cancelar | 1. Modificar dados<br>2. Clicar em "Cancelar" | Os dados originais devem ser restaurados |

### 2. Layout Responsivo

| Teste | Passos | Resultado Esperado |
|-------|--------|-------------------|
| Visualização em desktop | 1. Visualizar a página em tela grande | O layout deve ser organizado em duas colunas onde apropriado |
| Visualização em tablet | 1. Redimensionar para tamanho médio (768px) | Layout deve se adaptar adequadamente |
| Visualização em mobile | 1. Redimensionar para tamanho pequeno (375px) | Layout deve ficar em uma coluna, abas devem mostrar apenas ícones |
| Abas em duas linhas | 1. Verificar layout das abas | As abas devem ser organizadas em duas linhas sem scroll horizontal |

### 3. Tratamento de Erros

| Teste | Passos | Resultado Esperado |
|-------|--------|-------------------|
| Validação de campos obrigatórios | 1. Deixar campos obrigatórios vazios<br>2. Tentar salvar | Mensagens de erro específicas devem aparecer |
| Validação de formato de email | 1. Inserir email inválido<br>2. Tentar salvar | Mensagem de erro deve indicar formato inválido |
| Validação de formato de telefone | 1. Inserir telefone inválido<br>2. Tentar salvar | Mensagem de erro deve indicar formato inválido |
| Falha ao salvar | 1. Simular falha no salvamento | Toast de erro deve ser exibido |

### 4. Desempenho

| Teste | Passos | Resultado Esperado |
|-------|--------|-------------------|
| Tempo de carregamento inicial | 1. Carregar a página | Página deve carregar em menos de 3 segundos |
| Troca de abas | 1. Clicar em diferentes abas rapidamente | A transição deve ser suave e sem atrasos perceptíveis |
| Salvamento | 1. Clicar em "Salvar Alterações" | Operação deve ser concluída em tempo razoável com feedback adequado |

## Como Executar os Testes

Para auxiliar nos testes manuais, criamos utilitários que podem ser executados no console do navegador:

```javascript
// Importar e executar os testes
import { logTestResults } from "@/utils/testUtils";

// Ver resultados de todos os testes
logTestResults();
```

Os resultados dos testes serão exibidos no console do navegador, indicando quais testes passaram e quais falharam, com detalhes sobre os problemas encontrados.
