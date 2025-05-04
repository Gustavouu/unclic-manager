
import { cn } from "@/lib/utils";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Clock,
  Scissors,
  Users,
  CalendarDays,
  DollarSign,
  Bell,
  Link,
  UserCog,
  Settings2
} from "lucide-react";

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

interface SettingsTabItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs: SettingsTabItem[] = [
    { id: "business", label: "Perfil do Negócio", icon: Building },
    { id: "services", label: "Serviços e Preços", icon: Scissors },
    { id: "staff", label: "Funcionários", icon: Users },
    { id: "hours", label: "Horários", icon: Clock },
    { id: "appointments", label: "Agendamentos", icon: CalendarDays },
    { id: "financial", label: "Financeiro", icon: DollarSign },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "integrations", label: "Integrações", icon: Link },
    { id: "permissions", label: "Permissões", icon: UserCog },
    { id: "other", label: "Outros", icon: Settings2 },
  ];

  return (
    <div className="border-b">
      <div className="overflow-x-auto">
        <TabsList className="h-auto p-0 bg-transparent flex flex-nowrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none focus:outline-none focus:ring-0 whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-primary border-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
    </div>
  );
};
