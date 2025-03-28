
import { Navigate } from "react-router-dom";

const Index = () => {
  // Verifica se o usuário está autenticado olhando para o localStorage
  const isAuthenticated = localStorage.getItem("accessToken") ? true : false;
  
  // Se autenticado, redireciona para o dashboard, senão para login
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default Index;
