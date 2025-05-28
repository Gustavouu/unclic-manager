
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log("RequireAuth - User:", user);
    console.log("RequireAuth - Loading:", loading);
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Verificando permissões..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // For now, skip role-based checks since user metadata structure is not clear
  // This can be enhanced later when user roles are properly defined
  if (allowedRoles && allowedRoles.length > 0) {
    console.log("Role-based access control not yet implemented");
  }

  return <>{children}</>;
}
