
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { AsyncFeedback } from "@/components/ui/async-feedback";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import ErrorBoundary from "@/components/common/ErrorBoundary";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isResetComplete, setIsResetComplete] = useState(false);
  
  // Verifique se o usuário tem um token de redefinição válido
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        toast.error("Link inválido ou expirado", {
          description: "Por favor, solicite um novo link de redefinição de senha"
        });
        
        // Redirecionar para a página de recuperação de senha após um breve delay
        setTimeout(() => {
          navigate("/forgot-password");
        }, 2000);
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação simples
    if (password.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem");
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
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="transition-all duration-200"
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-gray-500">
                    A senha deve ter pelo menos 6 caracteres
                  </p>
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
                    className="transition-all duration-200"
                    autoComplete="new-password"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
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
