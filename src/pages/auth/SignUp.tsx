
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Toaster } from "sonner";
import { AsyncFeedback } from "@/components/ui/async-feedback";
import { Lock, Mail, User, ArrowLeft } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";

const SignUp = () => {
  const { signup, user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("As senhas não conferem");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      await signup(email, password, name);
      
      // After signup, navigate to index which will handle the routing
      navigate("/");
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      setErrorMessage(error.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Se já estiver autenticado, redirecionar para o index que decidirá o fluxo
  if (isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Toaster position="top-right" />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Unclic Manager</CardTitle>
          <CardDescription>Crie sua conta para começar</CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <AsyncFeedback 
              status="error" 
              message="Erro no cadastro" 
              description={errorMessage}
              className="mb-4"
            />
          )}
          
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" /> Nome
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting || loading}
              />
            </div>
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
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" /> Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting || loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" /> Confirmar senha
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isSubmitting || loading}
              />
              {passwordError && (
                <p className="text-sm text-red-600">{passwordError}</p>
              )}
            </div>
            <LoadingButton 
              type="submit" 
              className="w-full" 
              isLoading={isSubmitting || loading}
            >
              Criar conta
            </LoadingButton>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center w-full">
            <span className="text-sm text-gray-500">Já tem uma conta?</span>{" "}
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

export default SignUp;
