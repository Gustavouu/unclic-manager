
import { useState } from "react";

export interface Client {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  genero?: string;
  data_nascimento?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  ultima_visita?: string;
  valor_total_gasto?: number;
  total_agendamentos?: number;
  notas?: string;
  preferencias?: { [key: string]: any };
  criado_em: string;
  atualizado_em: string;
}

interface CreateClientData {
  nome: string;
  email?: string;
  telefone?: string;
  [key: string]: any;
}

export function useClients() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      nome: "João Silva",
      email: "joao.silva@email.com",
      telefone: "(11) 98765-4321",
      genero: "Masculino",
      cidade: "São Paulo",
      estado: "SP",
      ultima_visita: new Date().toISOString(),
      valor_total_gasto: 250,
      total_agendamentos: 3,
      criado_em: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      atualizado_em: new Date().toISOString()
    },
    {
      id: "2",
      nome: "Maria Oliveira",
      email: "maria.oliveira@email.com",
      telefone: "(11) 91234-5678",
      genero: "Feminino",
      cidade: "São Paulo",
      estado: "SP",
      ultima_visita: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      valor_total_gasto: 450,
      total_agendamentos: 5,
      criado_em: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      atualizado_em: new Date().toISOString()
    },
    {
      id: "3",
      nome: "Carlos Santos",
      email: "carlos.santos@email.com",
      telefone: "(21) 98888-7777",
      genero: "Masculino",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      ultima_visita: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      valor_total_gasto: 150,
      total_agendamentos: 2,
      criado_em: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      atualizado_em: new Date().toISOString()
    },
    {
      id: "4",
      nome: "Ana Souza",
      email: "ana.souza@email.com",
      telefone: "(31) 97777-6666",
      genero: "Feminino",
      cidade: "Belo Horizonte",
      estado: "MG",
      ultima_visita: null,
      valor_total_gasto: 0,
      total_agendamentos: 0,
      criado_em: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      atualizado_em: new Date().toISOString()
    },
    {
      id: "5",
      nome: "Pedro Almeida",
      email: "pedro.almeida@email.com",
      telefone: "(11) 96666-5555",
      genero: "Masculino",
      cidade: "Campinas",
      estado: "SP",
      ultima_visita: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      valor_total_gasto: 350,
      total_agendamentos: 4,
      criado_em: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      atualizado_em: new Date().toISOString()
    }
  ]);
  
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
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        cidade: data.cidade,
        estado: data.estado,
        genero: data.genero,
        valor_total_gasto: 0,
        total_agendamentos: 0,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
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
  
  const updateClient = async (id: string, data: Partial<Client>): Promise<Client | null> => {
    try {
      setIsLoading(true);
      
      // Mock implementation - in real app, this would call an API
      console.log(`Updating client ${id}:`, data);
      
      let updatedClient: Client | undefined;
      
      setClients(prev => {
        const updated = prev.map(client => {
          if (client.id === id) {
            updatedClient = {
              ...client,
              ...data,
              atualizado_em: new Date().toISOString()
            };
            return updatedClient;
          }
          return client;
        });
        
        return updated;
      });
      
      return updatedClient || null;
    } catch (err) {
      console.error("Error updating client:", err);
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
    createClient,
    updateClient
  };
}
