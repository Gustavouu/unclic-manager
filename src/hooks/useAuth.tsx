
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem("accessToken");
    
    if (token) {
      // For demo purposes, create a fake user based on token existence
      setUser({
        id: "demo-user-id",
        email: "admin@exemplo.com",
        name: "Salão Exemplo"
      });
    }
    
    // Set a fake token for demo purposes if none exists
    if (!token) {
      localStorage.setItem("accessToken", "demo-token");
      setUser({
        id: "demo-user-id",
        email: "admin@exemplo.com",
        name: "Salão Exemplo"
      });
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set token in localStorage
      localStorage.setItem("accessToken", "demo-token");
      
      // Set user
      setUser({
        id: "demo-user-id",
        email,
        name: "Salão Exemplo"
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set token in localStorage
      localStorage.setItem("accessToken", "demo-token");
      
      // Set user
      setUser({
        id: "demo-user-id",
        email,
        name
      });
      
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
