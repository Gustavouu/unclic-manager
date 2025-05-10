
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";

type User = {
  id: string;
  email: string;
  name: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        
        if (data?.user) {
          console.log("Usuário autenticado:", data.user);
          setUser({
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.user_metadata?.name || "",
          });
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        // Limpa o usuário em caso de erro
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Configura o listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Evento de autenticação:", event, session);
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || "",
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    checkUser();

    // Cleanup do listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Tentando login com:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Erro de autenticação:", error);
        throw error;
      }
      
      if (data.user) {
        console.log("Login bem-sucedido:", data.user);
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          name: data.user.user_metadata?.name || "",
        });
        
        toast.success("Login realizado com sucesso!");
      }
    } catch (error: any) {
      console.error("Erro de login:", error);
      toast.error(error.message || "Erro ao fazer login. Verifique suas credenciais.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      console.log("Tentando cadastro com:", email, name);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        console.error("Erro no cadastro:", error);
        throw error;
      }
      
      if (data.user) {
        console.log("Cadastro bem-sucedido:", data.user);
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          name: name,
        });
        
        // Criar registro de usuário no banco
        const { error: userError } = await supabase
          .from('usuarios')
          .insert([
            { 
              id: data.user.id,
              email: data.user.email || "",
              nome_completo: name,
              status: 'ativo'
            },
          ]);
          
        if (userError) {
          console.error("Erro ao criar registro de usuário:", userError);
          toast.error("Conta criada, mas houve um erro ao configurar o perfil.");
        } else {
          toast.success("Conta criada com sucesso!");
        }
      }
    } catch (error: any) {
      console.error("Erro de cadastro:", error);
      toast.error(error.message || "Erro ao criar conta. Tente novamente.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Realizando logout");
      // Logout do Supabase
      await supabase.auth.signOut();
      
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      console.log("Solicitando redefinição de senha para:", email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error("Erro ao solicitar redefinição de senha:", error);
        throw error;
      }
      
    } catch (error: any) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  
  return context;
};
