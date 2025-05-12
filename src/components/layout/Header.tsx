import React from "react";
import { Bell, ChevronDown } from "lucide-react";
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
import { useNavigate, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  breadcrumb?: { label: string; path?: string }[];
}

export const Header = ({ breadcrumb }: HeaderProps = {}) => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();
  
  const getBreadcrumb = () => {
    // If breadcrumb prop is provided, use it
    if (breadcrumb) return breadcrumb;
    
    // Otherwise generate from pathname
    const path = pathname.split('/').filter(Boolean);
    
    const breadcrumbItems = [
      { label: "Início", path: "/" }
    ];
    
    // Mapeamento de rotas para nomes em português
    const routeTranslations: Record<string, string> = {
      'appointments': 'Agendamentos',
      'clients': 'Clientes',
      'services': 'Serviços',
      'professionals': 'Profissionais',
      'inventory': 'Estoque',
      'finance': 'Financeiro',
      'reports': 'Relatórios',
      'settings': 'Configurações',
      'payments': 'Pagamentos'
    };
    
    if (path.length > 0) {
      path.forEach((segment, index) => {
        const segmentPath = `/${path.slice(0, index + 1).join('/')}`;
        // Usar a tradução se disponível, ou capitalize a primeira letra
        const label = routeTranslations[segment] || 
          (segment.charAt(0).toUpperCase() + segment.slice(1));
        
        breadcrumbItems.push({
          label,
          path: segmentPath
        });
      });
    }
    
    return breadcrumbItems;
  };
  
  const currentBreadcrumb = getBreadcrumb();
  
  const handleLogout = () => {
    signOut();
    navigate("/login");
  };
  
  // Get user name from user metadata
  const getUserName = () => {
    // Check if user has name in user_metadata
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    // Otherwise use email without domain
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return "Usuário";
  };
  
  const userName = getUserName();
  
  return (
    <header className="sticky top-0 z-30 flex flex-col border-b border-border/50 py-2 px-4 md:px-6 bg-background/80 backdrop-blur-sm transition-all duration-200">
      <div className="flex items-center justify-between h-12">
        <div className="flex items-center gap-6 overflow-hidden">
          {currentBreadcrumb.length > 0 && (
            <Breadcrumb className="flex">
              <BreadcrumbList>
                {currentBreadcrumb.map((item, index) => {
                  if (index === currentBreadcrumb.length - 1) {
                    return (
                      <BreadcrumbItem key={index}>
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      </BreadcrumbItem>
                    );
                  }
                  
                  return (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        <BreadcrumbLink href={item.path}>{item.label}</BreadcrumbLink>
                      </BreadcrumbItem>
                      {index < currentBreadcrumb.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full relative"
            aria-label="Notificações"
          >
            <Bell size={18} className="text-muted-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 ml-2 p-1 pr-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {userName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {!isMobile && (
                  <>
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {userName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "usuario@exemplo.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings/account")}>Perfil</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>Configurações</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/billing")}>Assinatura</DropdownMenuItem>
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
