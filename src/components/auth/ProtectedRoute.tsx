import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { Permission } from '@/types/user';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: Permission[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, isLoading, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      if (!user) {
        setIsAuthorized(false);
        setIsCheckingPermissions(false);
        return;
      }

      if (requiredPermissions.length === 0) {
        setIsAuthorized(true);
        setIsCheckingPermissions(false);
        return;
      }

      try {
        const hasAllPermissions = await Promise.all(
          requiredPermissions.map((permission) => hasPermission(permission))
        );

        setIsAuthorized(hasAllPermissions.every((has) => has));
      } catch (error) {
        console.error('Error checking permissions:', error);
        setIsAuthorized(false);
      } finally {
        setIsCheckingPermissions(false);
      }
    };

    checkPermissions();
  }, [user, requiredPermissions, hasPermission]);

  useEffect(() => {
    if (!isLoading && !isCheckingPermissions && !isAuthorized) {
      navigate(redirectTo);
    }
  }, [isLoading, isCheckingPermissions, isAuthorized, navigate, redirectTo]);

  if (isLoading || isCheckingPermissions) {
    return <div>Loading...</div>; // TODO: Replace with a proper loading component
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
} 