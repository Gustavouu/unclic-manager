
import { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { AsyncFeedback } from "@/components/ui/async-feedback";
import { LogIn, Lock, Mail, UserPlus, AlertTriangle } from "lucide-react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { handleApiError } from "@/utils/errorHandler";
import { sanitizeInput } from "@/utils/sanitize";
import { ValidatedForm } from "@/components/ui/validated-form";
import { z } from "zod";
import { generateNonce } from "@/utils/securityHeaders";

// Login form schema
const loginSchema = z.object({
  email: z.string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(255, "Email muito longo"),
  password: z.string()
    .min(1, "Senha é obrigatória")
    .max(72, "Senha muito longa") // bcrypt limit
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [loginBlockedUntil, setLoginBlockedUntil] = useState<Date | null>(null);
  // Security nonce for additional layer of protection
  const [formNonce] = useState(() => generateNonce());
  
  // Get the return URL from location state, or default to "/"
  const from = location.state?.from?.pathname || "/";
  
  useEffect(() => {
    document.title = "Login | Unclic Manager";
    
    // Check for saved login attempts
    const savedAttempts = sessionStorage.getItem('login_attempts');
    const blockedUntil = sessionStorage.getItem('login_blocked_until');
    
    if (savedAttempts) {
      setLoginAttempts(parseInt(savedAttempts, 10));
    }
    
    if (blockedUntil) {
      const blockedDate = new Date(blockedUntil);
      if (blockedDate > new Date()) {
        setLoginBlockedUntil(blockedDate);
      } else {
        // Reset if block has expired
        sessionStorage.removeItem('login_blocked_until');
      }
    }
  }, []);
  
  // Update login attempts in session storage
  useEffect(() => {
    if (loginAttempts > 0) {
      sessionStorage.setItem('login_attempts', loginAttempts.toString());
    }
  }, [loginAttempts]);
  
  // Block login after too many attempts
  useEffect(() => {
    if (loginAttempts >= 5 && !loginBlockedUntil) {
      const blockDuration = Math.min(Math.pow(2, loginAttempts - 5) * 60 * 1000, 30 * 60 * 1000);
      const blockedUntil = new Date(Date.now() + blockDuration);
      setLoginBlockedUntil(blockedUntil);
      sessionStorage.setItem('login_blocked_until', blockedUntil.toISOString());
      
      toast.error("Muitas tentativas de login", {
        description: `Por segurança, o login está temporariamente bloqueado. Tente novamente em ${Math.ceil(blockDuration / 60000)} minutos.`
      });
    }
  }, [loginAttempts, loginBlockedUntil]);
  
  // Countdown timer for login block
  useEffect(() => {
    if (!loginBlockedUntil) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      if (loginBlockedUntil <= now) {
        setLoginBlockedUntil(null);
        sessionStorage.removeItem('login_blocked_until');
        setLoginAttempts(0);
        sessionStorage.removeItem('login_attempts');
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [loginBlockedUntil]);
  
  const handleLogin = async (data: LoginFormData) => {
    // Check if login is blocked
    if (loginBlockedUntil && loginBlockedUntil > new Date()) {
      const remainingMinutes = Math.ceil((loginBlockedUntil.getTime() - Date.now()) / 60000);
      toast.error("Login temporariamente bloqueado", {
        description: `Tente novamente em ${remainingMinutes} minutos`
      });
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      await signIn(data.email, data.password);
      
      // Reset login attempts on success
      setLoginAttempts(0);
      sessionStorage.removeItem('login_attempts');
      
      // Show success message
      toast.success("Login realizado com sucesso", {
        description: "Você será redirecionado em instantes...",
      });
      
      // Navigate to the return URL or dashboard
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (error: any) {
      // Increment failed login attempts
      setLoginAttempts(prev => prev + 1);
      
      // Usar o tratador de erros padronizado
      const errorDetails = handleApiError(error);
      setErrorMessage(errorDetails.message);
      
      // Log security event if multiple failures
      if (loginAttempts >= 3) {
        try {
          // Log suspicious activity
          const securityEvent = {
            event_type: 'multiple_failed_logins',
            details: {
              attempts: loginAttempts + 1,
              email: data.email,
              ip_address: null // Will be populated by server
            },
            user_agent: navigator.userAgent
          };
          
          // Fire and forget
          fetch('/api/security-log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(securityEvent)
          }).catch(console.error);
        } catch (logError) {
          console.error("Failed to log security event:", logError);
        }
      }
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
            
            {loginBlockedUntil && loginBlockedUntil > new Date() && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4 flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Login temporariamente bloqueado</h3>
                  <p className="text-sm text-yellow-700">
                    Por segurança, após várias tentativas incorretas, o login foi bloqueado. 
                    Tente novamente em{" "}
                    {Math.ceil((loginBlockedUntil.getTime() - Date.now()) / 60000)} minutos.
                  </p>
                </div>
              </div>
            )}
            
            <ValidatedForm 
              schema={loginSchema} 
              onSubmit={handleLogin} 
              className="space-y-4"
              throttleTime={2000} // 2 seconds between submissions
            >
              <input type="hidden" name="form_nonce" value={formNonce} />
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  disabled={isSubmitting || loading || (loginBlockedUntil !== null && loginBlockedUntil > new Date())}
                  className="transition-all duration-200"
                  autoComplete="username" // Melhor prática para autocompletar
                  aria-invalid={errorMessage ? "true" : "false"}
                  maxLength={255}
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
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isSubmitting || loading || (loginBlockedUntil !== null && loginBlockedUntil > new Date())}
                  className="transition-all duration-200"
                  autoComplete="current-password" // Melhor prática para autocompletar
                  aria-invalid={errorMessage ? "true" : "false"}
                  maxLength={72}
                />
              </div>
              <LoadingButton 
                type="submit" 
                className="w-full" 
                isLoading={isSubmitting || loading}
                icon={<LogIn className="h-4 w-4" />}
                disabled={loginBlockedUntil !== null && loginBlockedUntil > new Date()}
              >
                Entrar
              </LoadingButton>
            </ValidatedForm>
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
