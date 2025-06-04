
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useOptimizedTenant } from '@/contexts/OptimizedTenantContext';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, User } from 'lucide-react';

export const Header = () => {
  const { currentBusiness } = useOptimizedTenant();
  const { user } = useAuth();

  return (
    <header className="border-b bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">
              {currentBusiness?.name || 'Unclic Manager'}
            </h1>
            <p className="text-sm text-gray-500">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
