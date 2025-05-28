
import React, { useEffect, useState } from "react";
import { OnboardingProvider } from "@/contexts/onboarding/OnboardingContext";
import { Toaster } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loader } from "@/components/ui/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Import the actual Onboarding component inside the provider
const OnboardingContent = React.lazy(() => 
  import("@/components/onboarding/Onboarding").then(module => ({
    default: module.Onboarding
  }))
);

const OnboardingPage = () => {
  const { user, loading } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error">("checking");
  const [retryCount, setRetryCount] = useState(0);
  
  // Define page title
  useEffect(() => {
    document.title = "Configuração Inicial | Unclic";
  }, []);
  
  // Check Supabase connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple query to check database connection
        const { data, error } = await supabase.from('businesses').select('id').limit(1);
        
        if (error && error.code === '42P01') {
          console.error("Table 'businesses' doesn't exist:", error);
          setConnectionStatus("error");
          toast.error("A tabela 'businesses' não existe no banco de dados");
        } else if (error) {
          console.error("Database connection error:", error);
          setConnectionStatus("error");
          toast.error(`Erro ao conectar ao banco de dados: ${error.message}`);
        } else {
          console.log("Successfully connected to database");
          setConnectionStatus("connected");
        }
      } catch (err) {
        console.error("Failed to connect to Supabase:", err);
        setConnectionStatus("error");
        toast.error("Falha ao conectar ao Supabase");
      }
    };
    
    if (user && !loading) {
      checkConnection();
    }
  }, [user, loading, retryCount]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader size="lg" text="Carregando..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Show error if database connection failed
  if (connectionStatus === "error") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Erro de conexão</AlertTitle>
            <AlertDescription className="mt-2">
              Não foi possível conectar ao banco de dados. Por favor, tente novamente mais tarde ou entre em contato com o suporte.
            </AlertDescription>
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setConnectionStatus("checking");
                  setRetryCount(prev => prev + 1);
                }}
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar novamente
              </Button>
            </div>
          </Alert>
        </div>
      </div>
    );
  }
  
  // Show loading state while checking connection
  if (connectionStatus === "checking") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader size="lg" text="Verificando conexão com o banco de dados..." />
      </div>
    );
  }

  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-slate-50 py-8">
        <React.Suspense 
          fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
              <Loader size="lg" text="Carregando onboarding..." />
            </div>
          }
        >
          <OnboardingContent />
        </React.Suspense>
        <Toaster position="top-right" />
      </div>
    </OnboardingProvider>
  );
};

export default OnboardingPage;
