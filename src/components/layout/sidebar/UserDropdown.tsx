
import * as React from "react";
import { Button } from "@/components/ui/button";
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

export function UserDropdown() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    // Use the logout function from auth context
    logout();
    // Navigate to login
    navigate("/login");
  };

  return (
    <div className="mt-auto border-t">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-14 w-full p-3">
            <Avatar className="mr-2 h-6 w-6">
              <AvatarImage src="/images/barber-avatar.png" alt="Avatar" />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <span className="text-left font-normal">
              <span className="font-semibold">{user?.name || "Salão Exemplo"}</span>
              <br />
              <span className="text-xs text-muted-foreground">
                {user?.email || "admin@exemplo.com"}
              </span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" forceMount>
          <DropdownMenuItem onClick={() => navigate("/settings")}>Perfil</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")}>Configurações</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
