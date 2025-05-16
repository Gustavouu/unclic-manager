
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AsyncFeedback } from "@/components/ui/async-feedback";
import { ArrowLeft, Mail } from "lucide-react";

const ResetPassword = () => {
  const { resetPassword, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      await resetPassword(email);
      setSuccessMessage("Email de recuperação enviado com sucesso. Verifique sua caixa de entrada.");
    } catch (error: any) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      setErrorMessage(error.message || "Falha ao enviar email de recuperação.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Se já estiver autenticado, redirecionar para o index
  if (isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
          <CardDescription>
            Informe seu email para receber instruções de recuperação de senha
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
          
          {successMessage && (
            <AsyncFeedback 
              status="success" 
              message="Sucesso" 
              description={successMessage}
              className="mb-4"
            />
          )}
          
          <form onSubmit={handleResetPassword} className="space-y-4">
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
              />
            </div>
            <LoadingButton 
              type="submit" 
              className="w-full" 
              isLoading={isSubmitting || loading}
            >
              Enviar instruções
            </LoadingButton>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center w-full">
            <button 
              onClick={() => navigate("/login")}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1 mx-auto mt-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para login
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
