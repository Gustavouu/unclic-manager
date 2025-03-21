
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";

const RequireAuth = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Get the page title based on the current path
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('appointments')) return 'Agendamentos';
    if (path.includes('clients')) return 'Clientes';
    if (path.includes('professionals')) return 'Colaboradores';
    if (path.includes('services')) return 'Serviços';
    
    return 'Unclic';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <AppLayout title={getPageTitle()}>
      <Outlet />
    </AppLayout>
  );
};

export default RequireAuth;
