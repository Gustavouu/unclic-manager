
import { useState } from "react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
  [key: string]: any;
}

export function useClients() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  
  const findClientByEmail = async (email: string): Promise<Client | null> => {
    try {
      setIsLoading(true);
      
      // Mock implementation - in real app, this would query a database
      console.log(`Searching for client with email: ${email}`);
      
      const mockClient = clients.find(client => client.email === email);
      
      return mockClient || null;
    } catch (err) {
      console.error("Error finding client:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const createClient = async (data: CreateClientData): Promise<Client | null> => {
    try {
      setIsLoading(true);
      
      // Mock implementation - in real app, this would call an API
      console.log("Creating new client:", data);
      
      const newClient: Client = {
        id: `client-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone
      };
      
      setClients(prev => [...prev, newClient]);
      
      return newClient;
    } catch (err) {
      console.error("Error creating client:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    clients,
    isLoading,
    error,
    findClientByEmail,
    createClient
  };
}
