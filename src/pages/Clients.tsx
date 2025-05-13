
import { useState } from "react";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClients, Client } from "@/hooks/useClients";
import { ClientsFiltersSheet } from "@/components/clients/ClientsFiltersSheet";
import { ClientsFilters } from "@/components/clients/ClientsFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCheck, Clock, Phone } from "lucide-react";
import { StatsCard } from "@/components/common/StatsCard";
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";

const Clients = () => {
  const { clients, loading } = useClients();
  const [showFilters, setShowFilters] = useState(false);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clientsForActiveTab = activeTab === 'all' 
    ? filteredClients
    : filteredClients.filter(client => {
        // Assuming clients may have a status field or we default to 'active'
        const clientStatus = client.status || 'active'; 
        return clientStatus === activeTab;
      });

  // Calculate stats for cards
  const activeClients = clients.filter(client => client.status !== 'inactive').length;
  const newClientsThisMonth = clients.filter(client => {
    const createdDate = client.criado_em ? new Date(client.criado_em) : null;
    if (!createdDate) return false;
    
    const now = new Date();
    return createdDate.getMonth() === now.getMonth() && 
           createdDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6">
      <ClientsHeader />
      
      <ResponsiveGrid columns={{ default: 1, sm: 4 }} gap="md" equalHeight>
        <StatsCard
          title="Total de Clientes"
          value={clients.length.toString()}
          icon={<Users size={18} />}
          iconColor="text-blue-600 bg-blue-50"
          borderColor="border-l-blue-600"
        />
        
        <StatsCard
          title="Clientes Ativos"
          value={activeClients.toString()}
          icon={<UserCheck size={18} />}
          iconColor="text-green-600 bg-green-50"
          borderColor="border-l-green-600"
          description={`${Math.round((activeClients / clients.length) * 100) || 0}% do total`}
        />
        
        <StatsCard
          title="Novos Clientes"
          value={newClientsThisMonth.toString()}
          icon={<Clock size={18} />}
          iconColor="text-amber-600 bg-amber-50"
          borderColor="border-l-amber-600"
          description="Este mês"
        />
        
        <StatsCard
          title="Taxa de Contato"
          value="80%"
          icon={<Phone size={18} />}
          iconColor="text-purple-600 bg-purple-50"
          borderColor="border-l-purple-600"
          description="Resposta"
        />
      </ResponsiveGrid>
      
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b bg-white">
          <CardTitle className="text-lg">Gerenciamento de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
              <TabsList className="bg-slate-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Ativos
                </TabsTrigger>
                <TabsTrigger value="inactive" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Inativos
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <div className="flex flex-col lg:flex-row">
                <div className="hidden lg:block w-64 shrink-0 border-r p-4">
                  <h3 className="text-sm font-medium mb-4">Filtros</h3>
                  <ClientsFilters 
                    clients={clients} 
                    onFilteredClientsChange={setFilteredClients} 
                  />
                </div>
                
                <div className="flex-1">
                  <ClientsTable 
                    clients={filteredClients} 
                    isLoading={loading} 
                    showFiltersButton
                    onToggleFilters={toggleFilters}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="active" className="mt-0">
              <div className="flex flex-col lg:flex-row">
                <div className="hidden lg:block w-64 shrink-0 border-r p-4">
                  <h3 className="text-sm font-medium mb-4">Filtros</h3>
                  <ClientsFilters 
                    clients={clientsForActiveTab} 
                    onFilteredClientsChange={setFilteredClients} 
                  />
                </div>
                
                <div className="flex-1">
                  <ClientsTable 
                    clients={clientsForActiveTab} 
                    isLoading={loading} 
                    showFiltersButton
                    onToggleFilters={toggleFilters}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="inactive" className="mt-0">
              <div className="flex flex-col lg:flex-row">
                <div className="hidden lg:block w-64 shrink-0 border-r p-4">
                  <h3 className="text-sm font-medium mb-4">Filtros</h3>
                  <ClientsFilters 
                    clients={clientsForActiveTab} 
                    onFilteredClientsChange={setFilteredClients} 
                  />
                </div>
                
                <div className="flex-1">
                  <ClientsTable 
                    clients={clientsForActiveTab} 
                    isLoading={loading} 
                    showFiltersButton
                    onToggleFilters={toggleFilters}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <ClientsFiltersSheet 
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        clients={clients}
        onFilteredClientsChange={setFilteredClients}
      />
    </div>
  );
};

export default Clients;
