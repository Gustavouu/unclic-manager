
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components/ui/loader";

const Index = () => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    document.title = "Unclic Manager";
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" text="Carregando..." />
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, redirect to home (which will be Dashboard)
  return <Navigate to="/" replace />;
};

export default Index;
