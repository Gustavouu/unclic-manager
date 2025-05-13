
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { AsyncFeedback } from "@/components/ui/async-feedback";
import { ArrowLeft, Mail, Send } from "lucide-react";
import ErrorBoundary from "@/components/common/ErrorBoundary";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setErrorMessage(error.message || "Ocorreu um erro. Tente novamente mais tarde.");
      
      toast.error("Erro ao enviar email", {
        description: "Não foi possível enviar o email de redefinição de senha"
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
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="transition-all duration-200"
                    autoComplete="off"
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
                      Enviando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Enviar instruções
                    </div>
                  )}
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

export default ForgotPassword;
