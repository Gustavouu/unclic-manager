
import { useState } from "react";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientStats } from "@/components/clients/ClientStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClients } from "@/hooks/useClients";
import { ClientsFiltersSheet } from "@/components/clients/ClientsFiltersSheet";
import { ClientsFilters } from "@/components/clients/ClientsFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Clients = () => {
  const { clients, isLoading } = useClients();
  const [showFilters, setShowFilters] = useState(false);
  const [filteredClients, setFilteredClients] = useState(clients);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="space-y-6">
      <ClientsHeader />
      
      <ClientStats clients={filteredClients} />
      
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b bg-white">
          <CardTitle className="text-lg">Gerenciamento de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
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
                    isLoading={isLoading} 
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
                    clients={clients.filter(client => client.status === "active")} 
                    onFilteredClientsChange={setFilteredClients} 
                  />
                </div>
                
                <div className="flex-1">
                  <ClientsTable 
                    clients={filteredClients.filter(client => client.status === "active")} 
                    isLoading={isLoading} 
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
                    clients={clients.filter(client => client.status === "inactive")} 
                    onFilteredClientsChange={setFilteredClients} 
                  />
                </div>
                
                <div className="flex-1">
                  <ClientsTable 
                    clients={filteredClients.filter(client => client.status === "inactive")} 
                    isLoading={isLoading} 
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
