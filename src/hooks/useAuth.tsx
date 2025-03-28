
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      setLoading(true);
      try {
        // If using real Supabase Auth, use this:
        // const { data } = await supabase.auth.getUser();
        // if (data?.user) {
        //   setUser({
        //     id: data.user.id,
        //     email: data.user.email || "",
        //     name: data.user.user_metadata?.name || "",
        //   });
        // }

        // For demo purposes, check localStorage
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // If using real Supabase Auth, use this:
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // });
      // 
      // if (error) throw error;
      // 
      // if (data.user) {
      //   setUser({
      //     id: data.user.id,
      //     email: data.user.email || "",
      //     name: data.user.user_metadata?.name || "",
      //   });
      // }

      // For demo purposes
      const mockUser = {
        id: "123456",
        email: email,
        name: email.split("@")[0],
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // If using real Supabase Auth, use this:
      // const { data, error } = await supabase.auth.signUp({
      //   email,
      //   password,
      //   options: {
      //     data: {
      //       name,
      //     },
      //   },
      // });
      // 
      // if (error) throw error;
      // 
      // if (data.user) {
      //   setUser({
      //     id: data.user.id,
      //     email: data.user.email || "",
      //     name: name,
      //   });
      // }

      // For demo purposes
      const mockUser = {
        id: "123456",
        email: email,
        name: name,
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      toast.success("Conta criada com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // If using real Supabase Auth, use this:
    // supabase.auth.signOut();
    
    // For demo purposes
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
