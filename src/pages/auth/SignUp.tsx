
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AsyncFeedback } from "@/components/ui/async-feedback";
import { LogIn, Mail, Lock, User } from "lucide-react";

const SignUp = () => {
  const { signup, user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    
    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem");
      setIsSubmitting(false);
      return;
    }
    
    try {
      await signup(email, password, fullName);
      
      // Let Index component handle the routing based on onboarding status
      navigate("/");
    } catch (error: any) {
      console.error("Erro de cadastro:", error);
      setErrorMessage(error.message || "Falha no cadastro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Se já estiver autenticado, redirecionar para o index que decidirá o fluxo
  if (isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Unclic Manager</CardTitle>
          <CardDescription>Crie sua conta para começar</CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <AsyncFeedback 
              status="error" 
              message="Erro de cadastro" 
              description={errorMessage}
              className="mb-4"
            />
          )}
          
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" /> Nome Completo
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="Seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isSubmitting || loading}
                className="transition-all duration-200"
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
                className="transition-all duration-200"
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
                className="transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" /> Confirmar Senha
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isSubmitting || loading}
                className="transition-all duration-200"
              />
            </div>
            <LoadingButton 
              type="submit" 
              className="w-full" 
              isLoading={isSubmitting || loading}
              icon={<LogIn className="h-4 w-4" />}
            >
              Cadastrar
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
              <LogIn className="h-4 w-4" />
              Entrar
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
