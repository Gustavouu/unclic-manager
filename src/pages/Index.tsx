
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components/ui/loader";

const Index = () => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    document.title = "Unclic Manager";
  }, []);
  
  console.log('Index page - user:', user?.id, 'loading:', loading);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" text="Carregando..." />
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    console.log('Index: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, redirect to dashboard
  console.log('Index: User authenticated, redirecting to dashboard');
  return <Navigate to="/dashboard" replace />;
};

export default Index;
