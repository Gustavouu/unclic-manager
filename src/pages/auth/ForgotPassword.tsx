
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { AsyncFeedback } from "@/components/ui/async-feedback";
import { ArrowLeft, Mail, Send, AlertCircle } from "lucide-react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { cacheService } from "@/services/cacheService";

// Chave para rastreamento de tentativas de redefinição
const RESET_ATTEMPTS_KEY = 'password_reset_attempts';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [resetAttempts, setResetAttempts] = useState(0);
  const lastAttemptTime = useRef<number | null>(null);
  
  // Carregar número de tentativas anteriores do cache
  useEffect(() => {
    const loadAttempts = async () => {
      const attempts = await cacheService.get<{count: number, timestamp: number}>(RESET_ATTEMPTS_KEY);
      if (attempts) {
        setResetAttempts(attempts.count);
        lastAttemptTime.current = attempts.timestamp;
      }
    };
    
    loadAttempts();
  }, []);
  
  // Validar email em tempo real
  useEffect(() => {
    if (!email) {
      setIsEmailValid(true);
      return;
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);
  
  // Verificação de proteção contra tentativas excessivas
  const checkRateLimit = (): boolean => {
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos em ms
    const now = Date.now();
    
    // Se excedeu o limite de tentativas e está dentro do tempo de bloqueio
    if (resetAttempts >= MAX_ATTEMPTS && lastAttemptTime.current && 
        now - lastAttemptTime.current < LOCKOUT_TIME) {
      const remainingTime = Math.ceil((LOCKOUT_TIME - (now - lastAttemptTime.current)) / 60000);
      toast.error(`Muitas tentativas de recuperação`, {
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
    
    // Salvar tentativas no cache para persistência
    cacheService.set(RESET_ATTEMPTS_KEY, {
      count: resetAttempts + 1, 
      timestamp: now
    }, { expiration: 24 * 60 * 60 * 1000 }); // Expira em 24h
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de email
    if (!email) {
      setErrorMessage("Por favor, informe seu email");
      return;
    }
    
    if (!isEmailValid) {
      setErrorMessage("Por favor, informe um email válido");
      return;
    }
    
    // Rate limiting
    if (!checkRateLimit()) return;
    
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      // Call the resetPassword function from useAuth
      await resetPassword(email);
      
      // Update state to show success message
      setIsEmailSent(true);
      toast.success("Email enviado", {
        description: "Verifique sua caixa de entrada para redefinir sua senha"
      });
    } catch (error: any) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      
      // Mensagem de erro amigável, mesmo para emails que não existem
      // (por razões de segurança, não indicar se o email existe ou não)
      setErrorMessage("Se o email fornecido estiver cadastrado, você receberá instruções para redefinir sua senha.");
      
      toast.error("Erro ao processar solicitação", {
        description: "Verifique sua conexão e tente novamente"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Toaster position="top-right" />
        <Card className="w-full max-w-md overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
            <CardDescription>
              {isEmailSent 
                ? "Verifique seu email para as instruções de redefinição de senha"
                : "Informe seu email para receber um link de recuperação de senha"}
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
            
            {isEmailSent ? (
              <div className="text-center p-4">
                <div className="mb-4 p-4 bg-green-50 rounded-full inline-flex items-center justify-center">
                  <Mail className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-gray-600 mb-4">
                  Um email com instruções para redefinição de senha foi enviado para <strong>{email}</strong>.
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Caso não encontre o email em sua caixa de entrada, verifique sua pasta de spam.
                </p>
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEmailSent(false)}
                    className="flex-1"
                  >
                    Tentar outro email
                  </Button>
                  <Button 
                    onClick={() => navigate("/login")}
                    className="flex-1"
                  >
                    Voltar ao login
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </label>
                  <div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className={`transition-all duration-200 ${!isEmailValid && email ? "border-red-500" : ""}`}
                      autoComplete="email"
                    />
                    {!isEmailValid && email && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Email inválido
                      </p>
                    )}
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || !email || !isEmailValid}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full" />
                      Enviando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Enviar instruções
                    </div>
                  )}
                </Button>
                
                <div className="text-xs text-gray-500 mt-4">
                  <p>Por segurança, emails com instruções de recuperação de senha:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>São válidos por 1 hora</li>
                    <li>Só podem ser solicitados 5 vezes a cada 15 minutos</li>
                    <li>Contêm um link único que só pode ser usado uma vez</li>
                  </ul>
                </div>
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

export default ForgotPassword;
