
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2, 
  Scissors, 
  Users, 
  Clock, 
  Calendar, 
  DollarSign,
  Bell, 
  Link, 
  Lock, 
  Settings as SettingsIcon
} from "lucide-react";

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const settingsTabs: SettingsTab[] = [
  { id: "business", label: "Perfil do Negócio", icon: Building2 },
  { id: "services", label: "Serviços e Preços", icon: Scissors },
  { id: "staff", label: "Funcionários", icon: Users },
  { id: "hours", label: "Horários", icon: Clock },
  { id: "appointments", label: "Agendamentos", icon: Calendar },
  { id: "financial", label: "Financeiro", icon: DollarSign },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "integrations", label: "Integrações", icon: Link },
  { id: "permissions", label: "Permissões", icon: Lock },
  { id: "other", label: "Outras", icon: SettingsIcon },
];

// Split tabs into two rows
const firstRowTabs = settingsTabs.slice(0, 5);
const secondRowTabs = settingsTabs.slice(5);

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const SettingsTabs = ({ activeTab, onTabChange }: SettingsTabsProps) => {
  return (
    <div className="space-y-2">
      {/* First row of tabs */}
      <TabsList className="flex justify-start w-full p-1 border rounded-lg">
        {firstRowTabs.map((tab) => (
          <TabsTrigger 
            key={tab.id} 
            value={tab.id} 
            className="flex items-center gap-2 px-3 py-2 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            onClick={() => onTabChange(tab.id)}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      
      {/* Second row of tabs */}
      <TabsList className="flex justify-start w-full p-1 border rounded-lg">
        {secondRowTabs.map((tab) => (
          <TabsTrigger 
            key={tab.id} 
            value={tab.id} 
            className="flex items-center gap-2 px-3 py-2 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            onClick={() => onTabChange(tab.id)}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};
