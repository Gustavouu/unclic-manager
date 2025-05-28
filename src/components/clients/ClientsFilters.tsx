
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client } from "@/types/client";

interface ClientsFiltersProps {
  clients: Client[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  cityFilter: string;
  setCityFilter: (city: string) => void;
  spentFilter: string;
  setSpentFilter: (spent: string) => void;
  onClearFilters: () => void;
}

export function ClientsFilters({
  clients,
  searchTerm,
  setSearchTerm,
  cityFilter,
  setCityFilter,
  spentFilter,
  setSpentFilter,
  onClearFilters
}: ClientsFiltersProps) {
  // Get unique cities from clients
  const uniqueCities = [...new Set(clients.map(client => client.city).filter(Boolean))];

  const filteredClients = clients.filter(client => {
    const matchesSearch = !searchTerm || 
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = !cityFilter || client.city === cityFilter;

    const matchesSpent = !spentFilter || (() => {
      const totalSpent = client.total_spent || 0;
      switch (spentFilter) {
        case 'low': return totalSpent < 100;
        case 'medium': return totalSpent >= 100 && totalSpent < 500;
        case 'high': return totalSpent >= 500;
        default: return true;
      }
    })();

    return matchesSearch && matchesCity && matchesSpent;
  });

  // Filter clients who visited in the last 30 days
  const recentClients = clients.filter(client => {
    if (!client.last_visit) return false;
    const lastVisit = new Date(client.last_visit);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastVisit >= thirtyDaysAgo;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Buscar por nome, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por cidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as cidades</SelectItem>
            {uniqueCities.map(city => (
              <SelectItem key={city} value={city || ''}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={spentFilter} onValueChange={setSpentFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por gasto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os gastos</SelectItem>
            <SelectItem value="low">Até R$ 100</SelectItem>
            <SelectItem value="medium">R$ 100 - R$ 500</SelectItem>
            <SelectItem value="high">Acima de R$ 500</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={onClearFilters}>
          Limpar Filtros
        </Button>
      </div>
      
      <div className="text-sm text-gray-600">
        Mostrando {filteredClients.length} de {clients.length} clientes
        {recentClients.length > 0 && (
          <span className="ml-2">• {recentClients.length} visitaram nos últimos 30 dias</span>
        )}
      </div>
    </div>
  );
}
