
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Simple top bar with only essential elements */}
      <nav className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Logo/Platform name */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">
                Unclic Manager
              </h1>
            </div>
            
            {/* Right side - user info and actions */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Bem-vindo, {user?.email?.split('@')[0] || 'Usuário'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <main className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
