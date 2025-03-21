
import { useMemo } from "react";
import { Client } from "./types";

export const useClientMetadata = (clients: Client[]) => {
  // Extract available cities
  const availableCities = useMemo(() => 
    [...new Set(clients.map(client => client.city).filter(Boolean) as string[])],
    [clients]
  );

  // Extract available categories
  const availableCategories = useMemo(() => 
    [...new Set(clients.map(client => client.category).filter(Boolean) as string[])],
    [clients]
  );

  return {
    availableCities,
    availableCategories
  };
};
