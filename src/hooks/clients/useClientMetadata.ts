import { useMemo } from "react";
import { Client } from "./types";

export const useClientMetadata = (clients: Client[]) => {
  // Extract available cities
  const availableCities = useMemo(() => {
    const cities = clients
      .map(client => client.city)
      .filter((city): city is string => !!city);
    
    return [...new Set(cities)].sort();
  }, [clients]);
  
  // Extract available categories
  const availableCategories = useMemo(() => {
    const categories = clients
      .map(client => client.category)
      .filter((category): category is string => !!category);
    
    return [...new Set(categories)].sort();
  }, [clients]);
  
  // Extract available tags
  const availableTags = useMemo(() => {
    const allTags: string[] = [];
    
    // Collect all tags from all clients
    clients.forEach(client => {
      if (client.tags && client.tags.length > 0) {
        allTags.push(...client.tags);
      }
    });
    
    // Return unique tags, sorted alphabetically
    return [...new Set(allTags)].sort();
  }, [clients]);
  
  return {
    availableCities,
    availableCategories,
    availableTags
  };
};
