
import React from "react";
import { Bell, Search, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  breadcrumb?: { label: string; path?: string }[];
}

export const Header = ({ breadcrumb = [] }: HeaderProps) => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <header className="sticky top-0 z-30 flex flex-col border-b border-border/50 py-2 px-4 md:px-6 bg-white backdrop-blur-sm">
      <div className="flex items-center justify-between h-12">
        <div className="flex items-center gap-4">
          {breadcrumb.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumb.map((item, index) => {
                  if (index === breadcrumb.length - 1) {
                    return (
                      <BreadcrumbItem key={index}>
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      </BreadcrumbItem>
                    );
                  }
                  
                  return (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        <BreadcrumbLink href={item.path || '#'}>{item.label}</BreadcrumbLink>
                      </BreadcrumbItem>
                      {index < breadcrumb.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          )}
          
          {!isMobile && (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="w-full pl-9 bg-muted/40 border-muted focus-visible:ring-primary"
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell size={18} className="text-muted-foreground" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 ml-2 p-1 pr-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : 'GH'}
                  </AvatarFallback>
                </Avatar>
                {!isMobile && (
                  <>
                    <span className="text-sm font-medium">{user?.name || "Gustavo Henriqueq"}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>Perfil</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Assinatura</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
