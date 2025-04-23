import { useMemo } from "react";
import { Client, FilterOptions } from "./types";

export const useClientFilters = (
  clients: Client[],
  searchTerm: string,
  filterOptions: FilterOptions
) => {
  // Filter clients based on search term and filter options
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      // Filtro por termo de pesquisa
      const matchesSearch = searchTerm === "" || 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm);
      
      if (!matchesSearch) return false;
      
      // Filtro por faixa de gastos
      const matchesSpent = client.totalSpent >= filterOptions.spentRange[0] && 
                          client.totalSpent <= filterOptions.spentRange[1];
      
      if (!matchesSpent) return false;
      
      // Filtro por clientes ativos
      if (filterOptions.onlyActive && client.lastVisit === null) {
        return false;
      }
      
      // Filtro por data da última visita
      if (filterOptions.lastVisitRange[0] || filterOptions.lastVisitRange[1]) {
        if (!client.lastVisit) return false;
        
        const lastVisitDate = new Date(client.lastVisit);
        const startDate = filterOptions.lastVisitRange[0] 
          ? new Date(filterOptions.lastVisitRange[0]) 
          : null;
        const endDate = filterOptions.lastVisitRange[1] 
          ? new Date(filterOptions.lastVisitRange[1]) 
          : null;
        
        if (startDate && lastVisitDate < startDate) return false;
        if (endDate) {
          // Ajustar a data final para incluir o fim do dia
          const adjustedEndDate = new Date(endDate);
          adjustedEndDate.setHours(23, 59, 59, 999);
          if (lastVisitDate > adjustedEndDate) return false;
        }
      }
      
      // Filtro por cidades
      if (filterOptions.cities.length > 0 && client.city && 
          !filterOptions.cities.includes(client.city)) {
        return false;
      }
      
      // Filtro por categorias
      if (filterOptions.categories.length > 0 && client.category && 
          !filterOptions.categories.includes(client.category)) {
        return false;
      }
      
      // Filtro por gênero
      if (filterOptions.gender && client.gender !== filterOptions.gender) {
        return false;
      }
      
      // Filtro por pontos de fidelidade
      if (filterOptions.loyaltyPointsRange && client.loyaltyPoints !== undefined) {
        const [min, max] = filterOptions.loyaltyPointsRange;
        if (client.loyaltyPoints < min || client.loyaltyPoints > max) {
          return false;
        }
      }
      
      // Filtro por tags
      if (filterOptions.tags && filterOptions.tags.length > 0) {
        // Verifica se o cliente tem pelo menos uma das tags selecionadas
        if (!client.tags || !filterOptions.tags.some(tag => client.tags?.includes(tag))) {
          return false;
        }
      }
      
      // Filtro por consentimento de marketing
      if (filterOptions.hasMarketingConsent && client.marketingPreferences) {
        // Verifica se o cliente consentiu com pelo menos um tipo de marketing
        const { email, whatsapp, sms } = client.marketingPreferences;
        if (!email && !whatsapp && !sms) {
          return false;
        }
      }
      
      return true;
    });
  }, [clients, searchTerm, filterOptions]);

  return filteredClients;
};
