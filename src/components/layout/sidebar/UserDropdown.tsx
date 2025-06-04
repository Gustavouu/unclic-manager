
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserDropdown() {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  const userInitials = user.email?.substring(0, 2).toUpperCase() || "U";
  const userName = user.user_metadata?.name || user.email || "Usuário";

  return (
    <div className="p-4 border-t">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start gap-2 h-auto p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-sm">
              <span className="font-medium">{userName}</span>
              <span className="text-xs text-muted-foreground truncate">
                {user.email}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
