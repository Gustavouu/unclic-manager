
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";

interface OnboardingRedirectProps {
  children: ReactNode;
}

export const OnboardingRedirect = ({ children }: OnboardingRedirectProps) => {
  const { needsOnboarding, loading, error } = useNeedsOnboarding();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (error) {
    console.error("Erro ao verificar status de onboarding:", error);
  }
  
  // Redirecionar para onboarding se necessário
  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // Caso contrário, continuar para a rota solicitada
  return <>{children}</>;
};
