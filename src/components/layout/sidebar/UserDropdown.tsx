
import * as React from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Settings, User } from "lucide-react";

export function UserDropdown() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Use the logout function from auth context
      await logout();
      // Navigate to login
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "UN";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="mt-auto border-t">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-14 w-full items-center p-3 text-left transition-colors hover:bg-accent/50 focus:outline-none">
            <Avatar className="mr-2 h-8 w-8">
              <AvatarImage src="/images/barber-avatar.png" alt="Avatar" />
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <span className="flex-1 overflow-hidden">
              <span className="block truncate font-medium">
                {user?.name || "Usuário"}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {user?.email || ""}
              </span>
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56" forceMount>
          <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            {isLoggingOut ? (
              <LoadingButton isLoading variant="ghost" className="w-full justify-start p-0">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </LoadingButton>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
