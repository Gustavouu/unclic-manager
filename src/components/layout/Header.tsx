
import { useState } from "react";
import { Bell, Search, Calendar, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

export const Header = ({ title }: { title: string }) => {
  const [searchValue, setSearchValue] = useState("");
  const isMobile = useIsMobile();
  
  return (
    <header className="flex items-center justify-between border-b border-border/50 py-4 px-6 bg-background/50 backdrop-blur-sm h-16">
      <div>
        <h1 className="text-xl font-display font-medium">{title}</h1>
      </div>
      
      {!isMobile && (
        <div className="relative max-w-md w-full mx-6">
          <Input
            placeholder="Pesquisar..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 h-10 bg-muted/70 border-none focus-visible:ring-primary/30"
          />
          <Search className="absolute left-3 top-2.5 text-muted-foreground w-5 h-5" />
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="rounded-full border-none bg-muted/70">
          <Bell size={19} className="text-muted-foreground" />
        </Button>
        
        <Button variant="outline" size="icon" className="rounded-full border-none bg-muted/70">
          <Calendar size={19} className="text-muted-foreground" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 ml-2 p-1 pr-2 hover:bg-muted/70">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">SA</AvatarFallback>
              </Avatar>
              {!isMobile && (
                <>
                  <span className="text-sm font-medium">Salão Exemplo</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem>Assinatura</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
