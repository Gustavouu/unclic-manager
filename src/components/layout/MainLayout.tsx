
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import type { Permission } from '@/types/user';

interface NavItem {
  name: string;
  path: string;
  requiredPermission?: Permission;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Business', path: '/business', requiredPermission: 'manage_business' },
  { name: 'Professionals', path: '/professionals', requiredPermission: 'manage_professionals' },
  { name: 'Services', path: '/services', requiredPermission: 'manage_services' },
  { name: 'Appointments', path: '/appointments', requiredPermission: 'view_appointments' },
  { name: 'Clients', path: '/clients', requiredPermission: 'view_clients' },
  { name: 'Settings', path: '/settings', requiredPermission: 'view_settings' },
];

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const { user, hasPermission } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
                  Unclic Manager
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
                    return null;
                  }
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                        isActive(item.path)
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
