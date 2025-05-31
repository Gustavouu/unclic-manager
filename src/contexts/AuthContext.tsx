
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/auth/authService';
import { AuthContextType, UserSession } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      setUser(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    return await login(email, password);
  };

  const signup = async (email: string, password: string, userData?: any) => {
    setLoading(true);
    try {
      const result = await authService.signUp(email, password, userData);
      setUser(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email);
  };

  const value: AuthContextType = {
    user,
    login,
    signIn,
    signup,
    logout,
    resetPassword,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
