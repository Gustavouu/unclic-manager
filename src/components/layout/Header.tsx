
import React, { useState } from "react";
import { Bell, Calendar, ChevronDown } from "lucide-react";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface HeaderProps {
  breadcrumb?: { label: string; path?: string }[];
}

export const Header = ({ breadcrumb = [] }: HeaderProps) => {
  const isMobile = useMobile();
  
  return (
    <header className="flex flex-col border-b border-border/50 py-4 px-6 bg-background/50 backdrop-blur-sm">
      <div className="flex items-center justify-between h-8">
        <div>
          {breadcrumb.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumb.map((item, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <BreadcrumbSeparator />}
                    {index === breadcrumb.length - 1 ? (
                      <BreadcrumbItem>
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      </BreadcrumbItem>
                    ) : (
                      <BreadcrumbItem>
                        <BreadcrumbLink href={item.path || '#'}>{item.label}</BreadcrumbLink>
                      </BreadcrumbItem>
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        
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
      </div>
    </header>
  );
};
