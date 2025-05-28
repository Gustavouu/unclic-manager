import { ReactNode } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Shield, AlertTriangle, FileText, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SecurityNavItem {
  name: string;
  path: string;
  icon: ReactNode;
}

const securityNavigation: SecurityNavItem[] = [
  { 
    name: 'Visão Geral', 
    path: '/admin/security',
    icon: <Shield className="h-5 w-5" />
  },
  { 
    name: 'Alertas', 
    path: '/admin/security/alerts',
    icon: <AlertTriangle className="h-5 w-5" />
  },
  { 
    name: 'Logs', 
    path: '/admin/security/logs',
    icon: <FileText className="h-5 w-5" />
  },
  { 
    name: 'Configurações', 
    path: '/admin/security/settings',
    icon: <Settings className="h-5 w-5" />
  },
];

export function SecurityLayout() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link to="/admin/security" className="text-xl font-bold text-red-600">
                  Painel de Segurança
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">
                Logado como: {user?.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {securityNavigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive(item.path)
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
} 