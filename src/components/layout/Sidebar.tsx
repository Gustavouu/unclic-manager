import * as React from "react";
import {
  CalendarRange,
  Dashboard as DashboardIcon,
  Package,
  Scissors,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import { MainNav } from "@/components/main-nav";
import { SidebarTrigger } from "@/components/sidebar/sidebar-trigger";
import { useMobile } from "@/hooks/use-mobile";
import { Icons } from "@/components/icons";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

function SidebarNav({ className, ...props }: SidebarNavProps) {
  return (
    <nav className="flex flex-col space-y-1" {...props}>
      {props.children}
    </nav>
  );
}

interface SidebarMenuAdvancedProps extends React.HTMLAttributes<HTMLElement> {
  icon: any;
  title: string;
  isLink?: boolean;
  to?: string;
  active?: boolean;
}

function SidebarMenuAdvanced({
  icon: Icon,
  title,
  isLink,
  to,
  active,
  ...props
}: SidebarMenuAdvancedProps) {
  return (
    <Button
      variant="ghost"
      className="justify-start px-4"
      active={active}
      asChild={isLink}
    >
      <a href={to}>
        <Icon className="mr-2 h-4 w-4" />
        <span>{title}</span>
      </a>
    </Button>
  );
}

interface SidebarGroupProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
}

function SidebarGroup({ title, ...props }: SidebarGroupProps) {
  return (
    <div className="pt-6 first:pt-0">
      <div className="mb-2 px-4 text-sm font-semibold opacity-60">{title}</div>
      <SidebarNav>{props.children}</SidebarNav>
    </div>
  );
}

interface SidebarMainProps extends React.HTMLAttributes<HTMLElement> {}

function SidebarMain({ className, ...props }: SidebarMainProps) {
  return (
    <div className="flex flex-col space-y-4 py-4" {...props}>
      {props.children}
    </div>
  );
}

interface SidebarProps extends React.ComponentProps<"div"> {}

export function Sidebar({ className }: React.ComponentProps<"div">) {
  const pathname = useLocation().pathname;
  const isMobile = useMobile();

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="hidden border-r bg-gray-100 dark:bg-neutral-950 md:block">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <MainNav className="mx-auto" />
        </div>
        <SidebarMain>
          <SidebarGroup title="Menu">
            <SidebarMenuAdvanced
              icon={DashboardIcon}
              title="Dashboard"
              isLink
              to="/dashboard"
              active={pathname === "/dashboard"}
            />
          </SidebarGroup>

          <SidebarGroup title="Gestão">
            <SidebarMenuAdvanced
              icon={CalendarRange}
              title="Agenda"
              isLink
              to="/appointments"
              active={pathname === "/appointments"}
            />
            <SidebarMenuAdvanced
              icon={UserRound}
              title="Clientes"
              isLink
              to="/clients"
              active={pathname === "/clients"}
            />
            <SidebarMenuAdvanced
              icon={Scissors}
              title="Serviços"
              isLink
              to="/services"
              active={pathname === "/services"}
            />
            <SidebarMenuAdvanced
              icon={Users}
              title="Profissionais"
              isLink
              to="/professionals"
              active={pathname === "/professionals"}
            />
            <SidebarMenuAdvanced
              icon={Package}
              title="Estoque"
              isLink
              to="/inventory"
              active={pathname === "/inventory"}
            />
            <SidebarMenuAdvanced
              icon={WalletCards}
              title="Financeiro"
              isLink
              to="/finance"
              active={pathname === "/finance"}
            />
          </SidebarGroup>

          <SidebarGroup title="Configurações">
            <Collapsible className="w-full">
              <div className="flex items-center justify-between px-4">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="justify-start">
                    <Icons.settings className="mr-2 h-4 w-4" />
                    <span>Avançado</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-2 px-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between rounded-md p-2">
                    <Label htmlFor="theme">Tema</Label>
                    <ThemeSwitcher />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        </SidebarMain>

        <div className="mt-auto border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex h-8 w-full p-0 px-3">
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarImage src="/images/barber-avatar.png" alt="Avatar" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-left font-normal">
                  <span className="font-semibold">Carlos Nicodemos</span>
                  <br />
                  <span className="text-muted-foreground">
                    carlos.nicodemos@gmail.com
                  </span>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" forceMount>
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Icons.sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Icons.moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Icons.sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Icons.moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Icons.laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MobileSidebar({ className }: React.ComponentProps<"div">) {
  const pathname = useLocation().pathname;
  const isMobile = useMobile();

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <SidebarTrigger />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-full flex-col border-r bg-white dark:bg-neutral-950 sm:max-w-xs"
      >
        <SheetHeader className="px-6">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-1 py-4">
          <SidebarMain>
            <SidebarGroup title="Menu">
              <SidebarMenuAdvanced
                icon={DashboardIcon}
                title="Dashboard"
                isLink
                to="/dashboard"
                active={pathname === "/dashboard"}
              />
            </SidebarGroup>

            <SidebarGroup title="Gestão">
              <SidebarMenuAdvanced
                icon={CalendarRange}
                title="Agenda"
                isLink
                to="/appointments"
                active={pathname === "/appointments"}
              />
              <SidebarMenuAdvanced
                icon={UserRound}
                title="Clientes"
                isLink
                to="/clients"
                active={pathname === "/clients"}
              />
              <SidebarMenuAdvanced
                icon={Scissors}
                title="Serviços"
                isLink
                to="/services"
                active={pathname === "/services"}
              />
              <SidebarMenuAdvanced
                icon={Users}
                title="Profissionais"
                isLink
                to="/professionals"
                active={pathname === "/professionals"}
              />
              <SidebarMenuAdvanced
                icon={Package}
                title="Estoque"
                isLink
                to="/inventory"
                active={pathname === "/inventory"}
              />
              <SidebarMenuAdvanced
                icon={WalletCards}
                title="Financeiro"
                isLink
                to="/finance"
                active={pathname === "/finance"}
              />
            </SidebarGroup>

            <SidebarGroup title="Configurações">
              <Collapsible className="w-full">
                <div className="flex items-center justify-between px-4">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="justify-start">
                      <Icons.settings className="mr-2 h-4 w-4" />
                      <span>Avançado</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-2 px-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between rounded-md p-2">
                      <Label htmlFor="theme">Tema</Label>
                      <ThemeSwitcher />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
          </SidebarMain>

          <div className="mt-auto border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-8 w-full p-0 px-3">
                  <Avatar className="mr-2 h-6 w-6">
                    <AvatarImage src="/images/barber-avatar.png" alt="Avatar" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="text-left font-normal">
                    <span className="font-semibold">Carlos Nicodemos</span>
                    <br />
                    <span className="text-muted-foreground">
                      carlos.nicodemos@gmail.com
                    </span>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" forceMount>
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configurações</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
