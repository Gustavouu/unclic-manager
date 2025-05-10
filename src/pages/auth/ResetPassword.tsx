
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/loading-button";
import { AsyncFeedback } from "@/components/ui/async-feedback";
import { Toaster } from "sonner";
import { ArrowLeft, Send } from "lucide-react";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await resetPassword(email);
      setStatus('success');
    } catch (error: any) {
      console.error("Erro ao resetar senha:", error);
      setErrorMessage(error.message || "Erro ao solicitar redefinição de senha");
      setStatus('error');
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Toaster position="top-right" />
      <Card className="w-full max-w-md overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Redefinir senha</CardTitle>
          <CardDescription>
            {status === 'success'
              ? "Verifique seu email para instruções"
              : "Enviaremos um link para redefinir sua senha"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'success' ? (
            <AsyncFeedback 
              status="success" 
              message="Email enviado com sucesso"
              description={`Se houver uma conta associada ao email ${email}, você receberá um link para redefinir sua senha. Verifique também sua pasta de spam caso não encontre o email.`}
              className="py-8"
            />
          ) : status === 'error' ? (
            <AsyncFeedback 
              status="error" 
              message="Não foi possível enviar o email"
              description={errorMessage}
              className="mb-4"
            >
              <form onSubmit={handleResetPassword} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all duration-200"
                  />
                </div>
                <LoadingButton 
                  type="submit" 
                  className="w-full" 
                  isLoading={status === 'loading'}
                  icon={<Send className="h-4 w-4" />}
                >
                  Enviar instruções
                </LoadingButton>
              </form>
            </AsyncFeedback>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-200"
                />
              </div>
              <LoadingButton 
                type="submit" 
                className="w-full" 
                isLoading={status === 'loading'}
                icon={<Send className="h-4 w-4" />}
              >
                Enviar instruções
              </LoadingButton>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <LoadingButton
            variant="link"
            onClick={() => navigate("/login")}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Voltar para o login
          </LoadingButton>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
