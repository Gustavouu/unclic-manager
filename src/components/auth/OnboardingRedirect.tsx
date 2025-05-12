
import { ReactNode } from "react";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface OnboardingRedirectProps {
  children: ReactNode;
}

export const OnboardingRedirect = ({ children }: OnboardingRedirectProps) => {
  const { needsOnboarding, loading } = useNeedsOnboarding();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Show a notification instead of forced redirect
    if (!loading && needsOnboarding) {
      toast.info("Algumas configurações do seu negócio estão pendentes", {
        action: {
          label: "Configurar agora",
          onClick: () => navigate("/onboarding")
        },
        duration: 8000,
        id: "onboarding-redirect-notification"
      });
    }
  }, [needsOnboarding, loading, navigate]);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  
  // Always continue to the requested route, no redirects
  return <>{children}</>;
};
