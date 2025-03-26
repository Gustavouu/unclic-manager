
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { ReactNode } from "react";

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
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
      if (path.includes('/details/')) {
        const clientId = path.split('/details/')[1];
        return [
          ...baseBreadcrumb, 
          { label: 'Clientes', path: '/clients' },
          { label: 'Detalhes do Cliente' }
        ];
      }
      return [...baseBreadcrumb, { label: 'Clientes' }];
    }
    if (path.includes('professionals')) {
      if (path.includes('/details/')) {
        const profId = path.split('/details/')[1];
        return [
          ...baseBreadcrumb,
          { label: 'Colaboradores', path: '/professionals' },
          { label: 'Detalhes do Colaborador' }
        ];
      }
      return [...baseBreadcrumb, { label: 'Colaboradores' }];
    }
    if (path.includes('inventory')) {
      if (path.includes('/details/')) {
        const productId = path.split('/details/')[1];
        return [
          ...baseBreadcrumb,
          { label: 'Estoque', path: '/inventory' },
          { label: 'Detalhes do Produto' }
        ];
      }
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
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout breadcrumb={getBreadcrumbItems()}>
      {children}
    </AppLayout>
  );
};

export default RequireAuth;
