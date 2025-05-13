
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Client } from "@/hooks/useClients";
import { CheckIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientsFiltersProps {
  clients: Client[];
  onFilteredClientsChange: (clients: Client[]) => void;
}

export function ClientsFilters({ clients, onFilteredClientsChange }: ClientsFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(10000);
  const [lastVisit, setLastVisit] = useState<string>("all");
  
  // Get unique cities
  const cities = Array.from(
    new Set(
      clients
        .map((client) => client.cidade)
        .filter(Boolean)
    )
  ).sort();
  
  // Get max amount spent
  const maxAmountPossible = Math.max(
    ...clients.map((client) => client.valor_total_gasto || 0)
  );
  
  useEffect(() => {
    // Filter clients based on selected filters
    let filtered = clients;
    
    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          client.nome.toLowerCase().includes(term) ||
          (client.email && client.email.toLowerCase().includes(term)) ||
          (client.telefone && client.telefone.includes(term))
      );
    }
    
    // City filter
    if (selectedCity) {
      filtered = filtered.filter(
        (client) => client.cidade === selectedCity
      );
    }
    
    // Amount filter
    filtered = filtered.filter(
      (client) =>
        (client.valor_total_gasto || 0) >= minAmount &&
        (client.valor_total_gasto || 0) <= maxAmount
    );
    
    // Last visit filter
    if (lastVisit !== "all") {
      const now = new Date();
      const daysAgo = parseInt(lastVisit);
      const cutoffDate = new Date();
      cutoffDate.setDate(now.getDate() - daysAgo);
      
      filtered = filtered.filter((client) => {
        if (!client.ultima_visita) return lastVisit === "never";
        
        const visitDate = new Date(client.ultima_visita);
        return lastVisit === "never" 
          ? false 
          : visitDate >= cutoffDate;
      });
    }
    
    onFilteredClientsChange(filtered);
  }, [clients, searchTerm, selectedCity, minAmount, maxAmount, lastVisit, onFilteredClientsChange]);
  
  const handleReset = () => {
    setSearchTerm("");
    setSelectedCity("");
    setMinAmount(0);
    setMaxAmount(maxAmountPossible);
    setLastVisit("all");
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <SearchIcon size={16} className="absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Nome, email ou telefone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as cidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city || "unknown"}>
                  {city || "Sem cidade"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="amount">Valor gasto</Label>
            <span className="text-xs text-muted-foreground">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(minAmount)} - {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(maxAmount)}
            </span>
          </div>
          <Slider
            id="amount"
            min={0}
            max={maxAmountPossible}
            step={100}
            value={[minAmount, maxAmount]}
            onValueChange={([min, max]) => {
              setMinAmount(min);
              setMaxAmount(max);
            }}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastVisit">Última visita</Label>
          <Select value={lastVisit} onValueChange={setLastVisit}>
            <SelectTrigger id="lastVisit">
              <SelectValue placeholder="Todas as visitas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as visitas</SelectItem>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="never">Nunca visitou</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <button
          onClick={handleReset}
          className="text-sm text-primary hover:underline flex items-center justify-center w-full mt-2"
        >
          Limpar filtros
        </button>
      </CardContent>
    </Card>
  );
}
