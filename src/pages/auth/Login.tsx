
import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/common/Logo";
import { Toaster } from "sonner";
import { useAuth } from "@/hooks/useAuth"; // Add this import

const Login = () => {
  const { login, loading } = useAuth(); // Use the main useAuth hook
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md mb-6">
        <Logo className="h-10 mx-auto" />
      </div>
      
      <AuthForm 
        initialTab="login" 
        onLogin={login}
        isLoading={loading}
      />
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Unclic Manager. Todos os direitos reservados.
      </p>
      
      <Toaster position="top-right" />
    </div>
  );
};

export default Login;
