
import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Por favor, insira seu email.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await resetPassword(email);
      setIsEmailSent(true);
      toast.success("Email de recuperação enviado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      toast.error(error.message || "Erro ao enviar email de recuperação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md mb-6">
        <Logo className="h-10 mx-auto" />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Recuperar Senha</CardTitle>
          <CardDescription className="text-center">
            {!isEmailSent 
              ? "Insira seu email para receber instruções de recuperação de senha" 
              : "Verifique sua caixa de entrada"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!isEmailSent ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar instruções"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto text-green-500 h-16 w-16 mb-4" />
              <p>
                Se houver uma conta associada ao email <strong>{email}</strong>, você receberá instruções para redefinir sua senha.
              </p>
              <p className="text-sm text-muted-foreground">
                Verifique também sua pasta de spam caso não encontre o email.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button variant="ghost" asChild>
            <Link to="/login" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Voltar para o login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
