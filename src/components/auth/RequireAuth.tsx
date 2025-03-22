
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
    if (path.includes('inventory')) return 'Estoque';
    if (path.includes('finance')) return 'Financeiro';
    if (path.includes('services')) return 'Serviços';
    if (path.includes('messages')) return 'Mensagens';
    if (path.includes('reports')) return 'Relatórios';
    if (path.includes('settings')) return 'Configurações';
    if (path.includes('help')) return 'Ajuda';
    
    return 'Unclic';
  };
  
  // Get breadcrumb items based on the current path
  const getBreadcrumbItems = () => {
    const path = location.pathname;
    const baseBreadcrumb = [{ label: 'Início', path: '/dashboard' }];
    
    if (path.includes('dashboard')) {
      return [...baseBreadcrumb, { label: 'Dashboard' }];
    }
    if (path.includes('appointments')) {
      return [...baseBreadcrumb, { label: 'Agendamentos' }];
    }
    if (path.includes('clients')) {
      return [...baseBreadcrumb, { label: 'Clientes' }];
    }
    if (path.includes('professionals')) {
      return [...baseBreadcrumb, { label: 'Colaboradores' }];
    }
    if (path.includes('inventory')) {
      return [...baseBreadcrumb, { label: 'Estoque' }];
    }
    if (path.includes('finance')) {
      return [...baseBreadcrumb, { label: 'Financeiro' }];
    }
    if (path.includes('services')) {
      return [...baseBreadcrumb, { label: 'Serviços' }];
    }
    if (path.includes('messages')) {
      return [...baseBreadcrumb, { label: 'Mensagens' }];
    }
    if (path.includes('reports')) {
      return [...baseBreadcrumb, { label: 'Relatórios' }];
    }
    if (path.includes('settings')) {
      return [...baseBreadcrumb, { label: 'Configurações' }];
    }
    if (path.includes('help')) {
      return [...baseBreadcrumb, { label: 'Ajuda' }];
    }
    
    return baseBreadcrumb;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <AppLayout title={getPageTitle()} breadcrumb={getBreadcrumbItems()}>
      <Outlet />
    </AppLayout>
  );
};

export default RequireAuth;
