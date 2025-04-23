# Sistema de Autenticação - UnCliC Manager

Este documento descreve o sistema de autenticação implementado no UnCliC Manager, utilizando o Supabase Auth como provedor.

## Sumário

- [Visão Geral](#visão-geral)
- [Fluxo de Autenticação](#fluxo-de-autenticação)
- [Implementação](#implementação)
  - [Hooks](#hooks)
  - [Componentes](#componentes)
  - [Rotas Protegidas](#rotas-protegidas)
- [Tipos de Autenticação](#tipos-de-autenticação)
- [Gerenciamento de Sessão](#gerenciamento-de-sessão)
- [Funções de Autorização](#funções-de-autorização)
- [Segurança](#segurança)
- [Exemplos de Uso](#exemplos-de-uso)

## Visão Geral

O UnCliC Manager utiliza o Supabase Auth para gerenciar autenticação e autorização de usuários. O sistema implementa:

- Login com email e senha
- Registro de novos usuários
- Recuperação de senha
- Persistência de sessão
- Rotas protegidas
- Controle de acesso baseado em perfis

## Fluxo de Autenticação

O fluxo de autenticação segue estas etapas:

1. **Registro de Usuário**:
   - Usuário fornece email, senha e dados básicos
   - Sistema valida os dados
   - Supabase cria o registro do usuário
   - Um registro correspondente é criado na tabela `usuarios` com o ID do Supabase

2. **Login**:
   - Usuário fornece credenciais
   - Sistema valida com o Supabase
   - Sessão é criada e token JWT é armazenado
   - Usuário é redirecionado para a dashboard

3. **Autorização**:
   - O token JWT contém claims com o ID do usuário e perfil de acesso
   - Componente `RequireAuth` verifica a sessão para rotas protegidas
   - Políticas RLS no Supabase controlam acesso aos dados baseado no perfil

4. **Logout**:
   - Sessão é encerrada
   - Tokens são removidos
   - Usuário é redirecionado para a página de login

## Implementação

### Hooks

#### useAuth

Hook central para gerenciar a autenticação, fornece funções e estados:

```typescript
const {
  user,           // Usuário atual
  session,        // Sessão atual
  isLoading,      // Estado de carregamento
  signIn,         // Função de login
  signUp,         // Função de registro
  signOut,        // Função de logout
  resetPassword,  // Recuperação de senha
  isAuthenticated // Estado de autenticação
} = useAuth();
```

Implementação:

```typescript
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error(error);
      }
      
      setSession(data.session);
      setUser(data.session?.user || null);
      setIsLoading(false);
    };

    getSession();

    // Configurar listener para mudanças na autenticação
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      throw error;
    }
    
    setIsLoading(false);
  };

  const signUp = async (email: string, password: string, userData: any) => {
    setIsLoading(true);
    
    // Criar usuário no auth
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          nome_completo: userData.nome_completo,
          id_negocio: userData.id_negocio
        }
      }
    });
    
    if (authError) {
      throw authError;
    }
    
    // Criar entrada correspondente na tabela usuarios
    if (authData.user) {
      const { error: dbError } = await supabase
        .from('usuarios')
        .insert({
          id: authData.user.id,
          email: email,
          nome_completo: userData.nome_completo,
          id_negocio: userData.id_negocio,
          funcao: userData.funcao || 'admin'
        });
      
      if (dbError) {
        // Rollback - excluir o usuário criado no auth
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw dbError;
      }
    }
    
    setIsLoading(false);
  };

  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    setIsLoading(false);
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      throw error;
    }
    
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
```

### Componentes

#### RequireAuth

Componente que protege rotas, redirecionando usuários não autenticados:

```typescript
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RequireAuthProps {
  children: JSX.Element;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    // Redireciona para login, mantendo a url original para retornar após login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
```

#### LoginForm

Componente de formulário de login:

```typescript
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obter redirecionamento original, caso exista
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
```

### Rotas Protegidas

Implementação no App.tsx:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth';
import { AuthProvider } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Rotas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

## Tipos de Autenticação

O sistema suporta diferentes métodos de autenticação:

1. **Email/Senha**: Método padrão implementado
2. **OAuth Provedores**: Preparado para integrar com:
   - Google
   - Facebook
   - Apple

## Gerenciamento de Sessão

O Supabase gerencia as sessões com:

- Tokens JWT armazenados de forma segura
- Tokens de refresh para renovação automática
- Limites de tempo configuráveis
- Opção para persistência de sessão entre visitas

## Funções de Autorização

O sistema implementa verificações de permissão baseadas nos perfis de usuário:

```typescript
// Hook para verificar permissões
export function usePermissions() {
  const { user } = useAuth();
  
  const checkPermission = async (permission: string): Promise<boolean> => {
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('perfis_acesso')
      .select('*')
      .eq('id_usuario', user.id)
      .single();
      
    if (error || !data) return false;
    
    // Administradores têm todas as permissões
    if (data.e_administrador) return true;
    
    // Verificar permissão específica
    return !!data[permission];
  };
  
  return { checkPermission };
}

// Exemplo de uso
const { checkPermission } = usePermissions();
const canAccessFinance = await checkPermission('acesso_financeiro');
```

## Segurança

O sistema implementa várias camadas de segurança:

1. **Hashing de senhas**: Gerenciado pelo Supabase Auth
2. **Proteção contra ataques de força bruta**: Limitação de tentativas de login
3. **HTTPS**: Toda comunicação é criptografada
4. **Tempo de expiração de tokens**: Configurable no Supabase
5. **Validação de entrada**: Validação de dados de entrada em todos os formulários
6. **Headers de segurança**: Implementados para prevenir ataques comuns

## Exemplos de Uso

### Login de Usuário

```typescript
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn('usuario@exemplo.com', 'senha123');
      console.log('Login bem-sucedido!');
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  return (
    <button onClick={handleLogin}>Login</button>
  );
}
```

### Verificação de Estado de Autenticação

```typescript
import { useAuth } from '../hooks/useAuth';

function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <div>Você precisa estar logado para ver esta página.</div>;
  }

  return (
    <div>
      <h1>Perfil</h1>
      <p>Email: {user?.email}</p>
      <p>ID: {user?.id}</p>
    </div>
  );
}
```

### Logout de Usuário

```typescript
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <button onClick={handleLogout}>Sair</button>
  );
}
``` 