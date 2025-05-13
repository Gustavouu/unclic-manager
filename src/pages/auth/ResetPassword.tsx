
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { AsyncFeedback } from "@/components/ui/async-feedback";
import { ArrowLeft, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { Progress } from "@/components/ui/progress";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isResetComplete, setIsResetComplete] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [resetAttempts, setResetAttempts] = useState(0);
  const lastAttemptTime = useRef<number | null>(null);
  
  // Parâmetros da URL para validação adicional
  const queryParams = new URLSearchParams(location.search);
  const redirectToken = queryParams.get('token');
  
  // Verificar se o usuário tem um token de redefinição válido
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      // Se não há sessão e também não há token na URL, redirecionar
      if (!data.session && !redirectToken) {
        toast.error("Link inválido ou expirado", {
          description: "Por favor, solicite um novo link de redefinição de senha"
        });
        
        // Redirecionar para a página de recuperação de senha após um breve delay
        setTimeout(() => {
          navigate("/forgot-password");
        }, 2000);
        return;
      }
      
      setSessionChecked(true);
      
      // Se há um token na URL, tentar processá-lo
      if (redirectToken) {
        try {
          // Processar o token de redirecionamento (específico da implementação)
          console.log("Processando token de redirecionamento");
          // Adicione aqui o processamento do token, se necessário
        } catch (error) {
          console.error("Erro ao processar token:", error);
        }
      }
    };
    
    checkSession();
  }, [navigate, redirectToken]);
  
  // Calcular força da senha
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Comprimento mínimo
    if (password.length >= 6) strength += 20;
    if (password.length >= 10) strength += 10;
    
    // Complexidade
    if (/[A-Z]/.test(password)) strength += 20; // Maiúsculas
    if (/[a-z]/.test(password)) strength += 10; // Minúsculas
    if (/[0-9]/.test(password)) strength += 20; // Números
    if (/[^A-Za-z0-9]/.test(password)) strength += 20; // Caracteres especiais
    
    setPasswordStrength(strength);
  }, [password]);
  
  // Verificação de proteção contra tentativas excessivas
  const checkRateLimit = (): boolean => {
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos em ms
    const now = Date.now();
    
    // Se excedeu o limite de tentativas e está dentro do tempo de bloqueio
    if (resetAttempts >= MAX_ATTEMPTS && lastAttemptTime.current && 
        now - lastAttemptTime.current < LOCKOUT_TIME) {
      const remainingTime = Math.ceil((LOCKOUT_TIME - (now - lastAttemptTime.current)) / 60000);
      toast.error(`Muitas tentativas de redefinição`, {
        description: `Por favor, tente novamente em ${remainingTime} minutos`
      });
      return false;
    }
    
    // Se passou o tempo de bloqueio, resetar o contador
    if (lastAttemptTime.current && now - lastAttemptTime.current >= LOCKOUT_TIME) {
      setResetAttempts(1);
    } else {
      setResetAttempts(prev => prev + 1);
    }
    
    lastAttemptTime.current = now;
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting
    if (!checkRateLimit()) return;
    
    // Validação robusta de senha
    if (password.length < 8) {
      setErrorMessage("A senha deve ter pelo menos 8 caracteres");
      return;
    }
    
    if (!/[A-Z]/.test(password)) {
      setErrorMessage("A senha deve conter pelo menos uma letra maiúscula");
      return;
    }
    
    if (!/[0-9]/.test(password)) {
      setErrorMessage("A senha deve conter pelo menos um número");
      return;
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
      setErrorMessage("A senha deve conter pelo menos um caractere especial");
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem");
      return;
    }
    
    if (passwordStrength < 60) {
      setErrorMessage("A senha não é forte o suficiente");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      // Atualizar a senha do usuário
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      // Mostrar sucesso
      setIsResetComplete(true);
      toast.success("Senha atualizada com sucesso", {
        description: "Você pode fazer login com sua nova senha"
      });
      
      // Limpar as tentativas de redefinição
      setResetAttempts(0);
      lastAttemptTime.current = null;
      
      // Redirecionar para a página de login após alguns segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);
      setErrorMessage(error.message || "Ocorreu um erro ao redefinir sua senha. Tente novamente.");
      
      toast.error("Erro ao redefinir senha", {
        description: "Não foi possível atualizar sua senha"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Processar cor e mensagem baseadas na força da senha
  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500";
    if (passwordStrength < 60) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  const getPasswordStrengthText = () => {
    if (!password) return "";
    if (passwordStrength < 30) return "Fraca";
    if (passwordStrength < 60) return "Média";
    return "Forte";
  };
  
  // Se ainda estamos verificando a sessão, mostrar loading
  if (!sessionChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin mx-auto mb-4 w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-gray-600">Verificando sua sessão...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Toaster position="top-right" />
        <Card className="w-full max-w-md overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
            <CardDescription>
              {isResetComplete 
                ? "Sua senha foi alterada com sucesso"
                : "Crie uma nova senha para sua conta"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <AsyncFeedback 
                status="error" 
                message="Erro" 
                description={errorMessage}
                className="mb-4"
              />
            )}
            
            {isResetComplete ? (
              <div className="text-center p-4">
                <div className="mb-4 p-4 bg-green-50 rounded-full inline-flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-gray-600 mb-4">
                  Sua senha foi redefinida com sucesso. Você será redirecionado para a página de login em instantes.
                </p>
                <Button 
                  onClick={() => navigate("/login")}
                  className="w-full"
                >
                  Ir para o login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Nova senha
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="transition-all duration-200 pr-10"
                      autoComplete="new-password"
                    />
                    {password && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs">
                        <span className={`${
                          passwordStrength < 30 ? 'text-red-500' : 
                          passwordStrength < 60 ? 'text-yellow-500' : 
                          'text-green-500'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Indicador de força de senha */}
                  {password && (
                    <div className="space-y-1">
                      <Progress
                        value={passwordStrength}
                        max={100}
                        className={`h-1 ${getPasswordStrengthColor()}`}
                      />
                      <ul className="text-xs text-gray-500 space-y-1 mt-2">
                        <li className="flex items-center gap-1">
                          <div className={`w-3 h-3 rounded-full ${password.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}></div>
                          Pelo menos 8 caracteres
                        </li>
                        <li className="flex items-center gap-1">
                          <div className={`w-3 h-3 rounded-full ${/[A-Z]/.test(password) ? "bg-green-500" : "bg-gray-300"}`}></div>
                          Uma letra maiúscula
                        </li>
                        <li className="flex items-center gap-1">
                          <div className={`w-3 h-3 rounded-full ${/[0-9]/.test(password) ? "bg-green-500" : "bg-gray-300"}`}></div>
                          Um número
                        </li>
                        <li className="flex items-center gap-1">
                          <div className={`w-3 h-3 rounded-full ${/[^A-Za-z0-9]/.test(password) ? "bg-green-500" : "bg-gray-300"}`}></div>
                          Um caractere especial
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Confirmar nova senha
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className={`transition-all duration-200 ${
                      confirmPassword && password !== confirmPassword ? "border-red-500" : ""
                    }`}
                    autoComplete="new-password"
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> As senhas não coincidem
                    </p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || !password || password !== confirmPassword}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full" />
                      Processando...
                    </div>
                  ) : "Redefinir senha"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="link" 
              onClick={() => navigate("/login")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default ResetPassword;
