
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Lock, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Unauthorized = () => {
  const { signOut } = useAuth();
  
  useEffect(() => {
    document.title = "Unauthorized Access | Unclic";
  }, []);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <div className="mx-auto bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Unauthorized Access</h1>
          <p className="text-gray-500 dark:text-gray-400">
            You don't have permission to access this resource.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-center">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="default" onClick={handleLogout} className="flex items-center justify-center">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
