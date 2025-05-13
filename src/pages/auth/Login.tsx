
import { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { AsyncFeedback } from "@/components/ui/async-feedback";
import { LogIn, Lock, Mail, UserPlus } from "lucide-react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { handleApiError } from "@/utils/errorHandler";
import { sanitizeInput } from "@/utils/sanitize";

const Login = () => {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Get the return URL from location state, or default to "/"
  const from = location.state?.from?.pathname || "/";
  
  useEffect(() => {
    document.title = "Login | Unclic Manager";
  }, []);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    
    // Validação básica
    const sanitizedEmail = sanitizeInput(email);
    if (!sanitizedEmail || !password) {
      setErrorMessage("Email e senha são obrigatórios.");
      setIsSubmitting(false);
      return;
    }
    
    try {
      await signIn(sanitizedEmail, password);
      
      // Show success message
      toast.success("Login realizado com sucesso", {
        description: "Você será redirecionado em instantes...",
      });
      
      // Navigate to the return URL or dashboard
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (error: any) {
      // Usar o tratador de erros padronizado
      const errorDetails = handleApiError(error);
      setErrorMessage(errorDetails.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Se já estiver autenticado, redirecionar para o index que decidirá o fluxo
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <ErrorBoundary
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600">Erro ao carregar tela de login</h2>
              <p className="mt-2 text-gray-600">
                Não foi possível carregar a tela de login. Por favor, tente novamente.
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Recarregar página
              </button>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Toaster position="top-right" />
        <Card className="w-full max-w-md overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Unclic Manager</CardTitle>
            <CardDescription>Entre para acessar sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <AsyncFeedback 
                status="error" 
                message="Erro de autenticação" 
                description={errorMessage}
                className="mb-4"
              />
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting || loading}
                  className="transition-all duration-200"
                  autoComplete="username" // Melhor prática para autocompletar
                  aria-invalid={errorMessage ? "true" : "false"}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Senha
                  </label>
                  <button 
                    type="button" 
                    onClick={() => navigate("/reset-password")}
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting || loading}
                  className="transition-all duration-200"
                  autoComplete="current-password" // Melhor prática para autocompletar
                  aria-invalid={errorMessage ? "true" : "false"}
                />
              </div>
              <LoadingButton 
                type="submit" 
                className="w-full" 
                isLoading={isSubmitting || loading}
                icon={<LogIn className="h-4 w-4" />}
              >
                Entrar
              </LoadingButton>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center w-full">
              <span className="text-sm text-gray-500">Não tem uma conta?</span>{" "}
              <button 
                onClick={() => navigate("/signup")}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1 mx-auto mt-1"
              >
                <UserPlus className="h-4 w-4" />
                Cadastre-se
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default Login;
