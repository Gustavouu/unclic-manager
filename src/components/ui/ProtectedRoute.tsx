
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
}

export const ProtectedRoute = ({ children, requiredPermissions = [] }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { canAccess, isLoading: permissionsLoading } = usePermissions();
  
  // While checking auth and permissions
  if (loading || permissionsLoading) {
    // You can show a loading spinner here if desired
    return <div>Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If permissions are required, check them
  if (requiredPermissions.length > 0 && !canAccess(requiredPermissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If user is authenticated and authorized, render the children
  return <>{children}</>;
};
