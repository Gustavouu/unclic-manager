
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, User, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const UserDropdown: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <div className="border-t p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start h-auto p-2">
            <div className="flex items-center gap-3 w-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate">Usuário Demo</p>
                <p className="text-xs text-muted-foreground truncate">admin@unclic.app</p>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-background border shadow-lg"
          sideOffset={8}
        >
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => navigate('/profile')}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            Perfil
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => navigate('/settings')}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4" />
            Ajuda
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
