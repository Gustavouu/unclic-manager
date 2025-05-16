# Análise de Acessibilidade

## 1. Diretrizes WCAG

### 1.1 Perceptível
```typescript
// Exemplo de implementação de diretrizes perceptíveis
const perceptibleGuidelines = {
  textAlternatives: {
    description: 'Alternativas em Texto',
    example: `
      // Imagens com alt text
      const Image = ({ src, alt }) => (
        <img
          src={src}
          alt={alt}
          role="img"
          aria-label={alt}
        />
      );
      
      // SVGs com descrição
      const Icon = ({ name, description }) => (
        <svg
          role="img"
          aria-label={name}
        >
          <title>{name}</title>
          <desc>{description}</desc>
          {/* SVG content */}
        </svg>
      );
    `
  },
  
  timeBasedMedia: {
    description: 'Mídia Baseada em Tempo',
    example: `
      // Vídeo com legendas
      const Video = ({ src, captions }) => (
        <video controls>
          <source src={src} type="video/mp4" />
          <track
            kind="captions"
            src={captions}
            srcLang="pt-BR"
            label="Português"
            default
          />
        </video>
      );
      
      // Áudio com transcrição
      const Audio = ({ src, transcript }) => (
        <div>
          <audio controls>
            <source src={src} type="audio/mpeg" />
          </audio>
          <details>
            <summary>Transcrição</summary>
            <p>{transcript}</p>
          </details>
        </div>
      );
    `
  },
  
  adaptable: {
    description: 'Conteúdo Adaptável',
    example: `
      // Layout responsivo
      const Layout = ({ children }) => (
        <div className="layout">
          <nav className="nav" role="navigation">
            {/* Navigation content */}
          </nav>
          <main className="main" role="main">
            {children}
          </main>
          <aside className="sidebar" role="complementary">
            {/* Sidebar content */}
          </aside>
        </div>
      );
      
      // Texto adaptável
      const Text = ({ children }) => (
        <p className="text">
          {children}
        </p>
      );
    `
  },
  
  distinguishable: {
    description: 'Conteúdo Distinguível',
    example: `
      // Contraste de cores
      const theme = {
        text: {
          primary: '#000000',
          secondary: '#666666',
          background: '#FFFFFF'
        },
        contrast: {
          ratio: 4.5 // WCAG AA
        }
      };
      
      // Foco visível
      const Button = styled.button\`
        &:focus {
          outline: 2px solid #007AFF;
          outline-offset: 2px;
        }
      \`;
    `
  }
};
```

### 1.2 Operável
```typescript
// Exemplo de implementação de diretrizes operáveis
const operableGuidelines = {
  keyboard: {
    description: 'Acessível por Teclado',
    example: `
      // Navegação por teclado
      const Menu = () => {
        const [focusedIndex, setFocusedIndex] = useState(0);
        
        const handleKeyDown = (e: KeyboardEvent) => {
          switch (e.key) {
            case 'ArrowDown':
              setFocusedIndex(prev => (prev + 1) % items.length);
              break;
            case 'ArrowUp':
              setFocusedIndex(prev => (prev - 1 + items.length) % items.length);
              break;
            case 'Enter':
              items[focusedIndex].onClick();
              break;
          }
        };
        
        return (
          <ul role="menu" onKeyDown={handleKeyDown}>
            {items.map((item, index) => (
              <li
                key={item.id}
                role="menuitem"
                tabIndex={index === focusedIndex ? 0 : -1}
              >
                {item.label}
              </li>
            ))}
          </ul>
        );
      };
    `
  },
  
  time: {
    description: 'Tempo Suficiente',
    example: `
      // Ajuste de tempo
      const Timeout = ({ duration, onTimeout }) => {
        const [timeLeft, setTimeLeft] = useState(duration);
        
        useEffect(() => {
          const timer = setInterval(() => {
            setTimeLeft(prev => {
              if (prev <= 0) {
                clearInterval(timer);
                onTimeout();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          return () => clearInterval(timer);
        }, []);
        
        return (
          <div role="timer" aria-live="polite">
            Tempo restante: {timeLeft}s
          </div>
        );
      };
    `
  },
  
  seizures: {
    description: 'Convulsões e Reações Físicas',
    example: `
      // Prevenção de flashes
      const FlashWarning = ({ content }) => (
        <div className="flash-warning">
          <p>Este conteúdo pode causar convulsões para pessoas com epilepsia fotossensível.</p>
          <button onClick={() => setShowContent(true)}>
            Continuar
          </button>
          {showContent && content}
        </div>
      );
    `
  },
  
  navigation: {
    description: 'Navegável',
    example: `
      // Skip links
      const SkipLink = () => (
        <a
          href="#main-content"
          className="skip-link"
        >
          Pular para o conteúdo principal
        </a>
      );
      
      // Breadcrumbs
      const Breadcrumbs = ({ items }) => (
        <nav aria-label="Breadcrumb">
          <ol>
            {items.map((item, index) => (
              <li key={item.id}>
                {index < items.length - 1 ? (
                  <>
                    <a href={item.href}>{item.label}</a>
                    <span aria-hidden="true">/</span>
                  </>
                ) : (
                  <span aria-current="page">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      );
    `
  }
};
```

### 1.3 Compreensível
```typescript
// Exemplo de implementação de diretrizes compreensíveis
const understandableGuidelines = {
  readable: {
    description: 'Legível',
    example: `
      // Idioma do conteúdo
      const Page = ({ children }) => (
        <html lang="pt-BR">
          <body>
            {children}
          </body>
        </html>
      );
      
      // Abreviações
      const Abbr = ({ term, definition }) => (
        <abbr title={definition}>
          {term}
        </abbr>
      );
    `
  },
  
  predictable: {
    description: 'Previsível',
    example: `
      // Navegação consistente
      const Navigation = () => (
        <nav role="navigation" aria-label="Principal">
          <ul>
            <li><a href="/">Início</a></li>
            <li><a href="/agenda">Agenda</a></li>
            <li><a href="/clientes">Clientes</a></li>
            <li><a href="/configuracoes">Configurações</a></li>
          </ul>
        </nav>
      );
      
      // Identificação de erros
      const Form = () => {
        const [errors, setErrors] = useState({});
        
        return (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <div id="email-error" role="alert">
                  {errors.email}
                </div>
              )}
            </div>
          </form>
        );
      };
    `
  },
  
  input: {
    description: 'Assistência de Entrada',
    example: `
      // Prevenção de erros
      const Form = () => {
        const [data, setData] = useState({});
        
        const handleSubmit = async (e) => {
          e.preventDefault();
          
          if (await validateData(data)) {
            await submitData(data);
          } else {
            setErrors(validationErrors);
          }
        };
        
        return (
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <button type="submit">Enviar</button>
          </form>
        );
      };
    `
  }
};
```

### 1.4 Robusto
```typescript
// Exemplo de implementação de diretrizes robustas
const robustGuidelines = {
  compatible: {
    description: 'Compatível',
    example: `
      // HTML válido
      const Component = () => (
        <div>
          <h1>Título</h1>
          <p>Conteúdo</p>
        </div>
      );
      
      // ARIA roles
      const Dialog = ({ isOpen, onClose, children }) => (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          hidden={!isOpen}
        >
          <h2 id="dialog-title">Título do Diálogo</h2>
          {children}
          <button onClick={onClose}>Fechar</button>
        </div>
      );
    `
  }
};
```

## 2. Componentes Acessíveis

### 2.1 Formulários
```typescript
// Exemplo de componentes de formulário acessíveis
const accessibleForms = {
  input: {
    description: 'Input Acessível',
    example: `
      const Input = ({ label, error, ...props }) => (
        <div>
          <label htmlFor={props.id}>{label}</label>
          <input
            {...props}
            aria-invalid={!!error}
            aria-describedby={error ? \`\${props.id}-error\` : undefined}
          />
          {error && (
            <div
              id={\`\${props.id}-error\`}
              role="alert"
              className="error"
            >
              {error}
            </div>
          )}
        </div>
      );
    `
  },
  
  select: {
    description: 'Select Acessível',
    example: `
      const Select = ({ label, options, error, ...props }) => (
        <div>
          <label htmlFor={props.id}>{label}</label>
          <select
            {...props}
            aria-invalid={!!error}
            aria-describedby={error ? \`\${props.id}-error\` : undefined}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && (
            <div
              id={\`\${props.id}-error\`}
              role="alert"
              className="error"
            >
              {error}
            </div>
          )}
        </div>
      );
    `
  }
};
```

### 2.2 Navegação
```typescript
// Exemplo de componentes de navegação acessíveis
const accessibleNavigation = {
  menu: {
    description: 'Menu Acessível',
    example: `
      const Menu = ({ items }) => (
        <nav aria-label="Menu principal">
          <ul role="menubar">
            {items.map(item => (
              <li key={item.id} role="none">
                <a
                  href={item.href}
                  role="menuitem"
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      );
    `
  },
  
  tabs: {
    description: 'Tabs Acessíveis',
    example: `
      const Tabs = ({ tabs }) => {
        const [activeTab, setActiveTab] = useState(0);
        
        return (
          <div role="tablist">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={index === activeTab}
                aria-controls={\`panel-\${tab.id}\`}
                onClick={() => setActiveTab(index)}
              >
                {tab.label}
              </button>
            ))}
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                role="tabpanel"
                id={\`panel-\${tab.id}\`}
                aria-labelledby={\`tab-\${tab.id}\`}
                hidden={index !== activeTab}
              >
                {tab.content}
              </div>
            ))}
          </div>
        );
      };
    `
  }
};
```

## 3. Testes de Acessibilidade

### 3.1 Automatizados
```typescript
// Exemplo de testes automatizados
const automatedTests = {
  axe: {
    description: 'Testes com Axe',
    example: `
      // Teste de componente
      describe('Component', () => {
        it('should be accessible', async () => {
          const { container } = render(<Component />);
          const results = await axe(container);
          expect(results.violations).toHaveLength(0);
        });
      });
      
      // Teste de página
      describe('Page', () => {
        it('should be accessible', async () => {
          const { container } = render(<Page />);
          const results = await axe(container);
          expect(results.violations).toHaveLength(0);
        });
      });
    `
  },
  
  jest: {
    description: 'Testes com Jest',
    example: `
      // Teste de atributos ARIA
      describe('Component', () => {
        it('should have correct ARIA attributes', () => {
          const { getByRole } = render(<Component />);
          const button = getByRole('button');
          expect(button).toHaveAttribute('aria-label', 'Label');
        });
      });
      
      // Teste de navegação
      describe('Navigation', () => {
        it('should be keyboard navigable', () => {
          const { getByRole } = render(<Navigation />);
          const menu = getByRole('menubar');
          fireEvent.keyDown(menu, { key: 'ArrowDown' });
          expect(menu).toHaveFocus();
        });
      });
    `
  }
};
```

### 3.2 Manuais
```typescript
// Exemplo de testes manuais
const manualTests = {
  keyboard: {
    description: 'Teste de Teclado',
    example: `
      // Checklist
      const keyboardChecklist = [
        'Navegação com Tab',
        'Ativação com Enter',
        'Navegação em menus',
        'Atalhos de teclado',
        'Foco visível',
        'Ordem de tabulação'
      ];
    `
  },
  
  screenReader: {
    description: 'Teste com Leitor de Tela',
    example: `
      // Checklist
      const screenReaderChecklist = [
        'Estrutura de cabeçalhos',
        'Textos alternativos',
        'Descrições ARIA',
        'Ordem de leitura',
        'Anúncios dinâmicos',
        'Navegação por landmarks'
      ];
    `
  }
};
```

## 4. Plano de Ação

### 4.1 Curto Prazo
1. Implementar atributos ARIA
2. Adicionar textos alternativos
3. Melhorar contraste
4. Testar com leitores de tela

### 4.2 Médio Prazo
1. Melhorar navegação
2. Implementar atalhos
3. Adicionar legendas
4. Otimizar formulários

### 4.3 Longo Prazo
1. Implementar PWA
2. Melhorar compatibilidade
3. Adicionar recursos avançados
4. Otimizar experiência

## 5. Conclusão

A acessibilidade é um componente fundamental do UnCliC Manager. As diretrizes e componentes implementados visam garantir uma experiência inclusiva para todos os usuários.

O plano de ação estabelecido permitirá evoluir continuamente a acessibilidade, garantindo que o sistema seja utilizável por pessoas com diferentes necessidades e capacidades. 