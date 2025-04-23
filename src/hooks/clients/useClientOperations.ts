import { useState, useEffect } from "react";
import { Client, FilterOptions } from "./types";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useClientOperations = () => {
  const { businessId } = useCurrentBusiness();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    spentRange: [0, 1000],
    lastVisitRange: [null, null],
    onlyActive: false,
    cities: [],
    categories: [],
    gender: null,
    // Novos filtros
    loyaltyPointsRange: [0, 1000],
    tags: [],
    hasMarketingConsent: false
  });

  // Buscar clientes do Supabase
  useEffect(() => {
    const fetchClients = async () => {
      if (!businessId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('clientes')
          .select('*, ultima_visita, valor_total_gasto, dados_fidelidade, preferencias_marketing, tags, data_cadastro')
          .eq('id_negocio', businessId);
          
        if (error) {
          throw error;
        }
        
        // Converter para o formato Client
        const formattedClients: Client[] = data.map(client => ({
          id: client.id,
          name: client.nome,
          email: client.email || '',
          phone: client.telefone || '',
          lastVisit: client.ultima_visita,
          totalSpent: client.valor_total_gasto || 0,
          gender: client.genero || '',
          category: client.preferencias ? (typeof client.preferencias === 'object' ? 
            (client.preferencias as any).categoria || 'Regular' : 'Regular') : 'Regular',
          city: client.cidade || '',
          // Novos campos
          loyaltyPoints: client.dados_fidelidade?.pontos || 0,
          memberSince: client.data_cadastro,
          birthdate: client.data_nascimento || null,
          marketingPreferences: {
            email: client.preferencias_marketing?.email || false,
            whatsapp: client.preferencias_marketing?.whatsapp || false,
            sms: client.preferencias_marketing?.sms || false
          },
          tags: client.tags || []
        }));
        
        setClients(formattedClients);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        toast.error("Erro ao carregar clientes");
      } finally {
        setLoading(false);
      }
    };
    
    if (businessId) {
      fetchClients();
    }
  }, [businessId]);

  // Add client
  const addClient = async (newClient: Omit<Client, 'id' | 'lastVisit' | 'totalSpent' | 'loyaltyPoints' | 'memberSince'>) => {
    if (!businessId) {
      toast.error("Sem negócio associado para adicionar cliente");
      return;
    }
    
    try {
      // Preparar dados para inserção
      const clientData = {
        id_negocio: businessId,
        nome: newClient.name,
        email: newClient.email,
        telefone: newClient.phone,
        genero: newClient.gender,
        cidade: newClient.city,
        preferencias: { categoria: newClient.category },
        data_nascimento: newClient.birthdate || null,
        preferencias_marketing: newClient.marketingPreferences || {
          email: false,
          whatsapp: false,
          sms: false
        },
        tags: newClient.tags || [],
        dados_fidelidade: {
          pontos: 0,
          nivel: 'Iniciante',
          ultimo_resgate: null
        }
      };
      
      const { data, error } = await supabase
        .from('clientes')
        .insert(clientData)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Adicionar cliente à lista local
      const clientWithId: Client = {
        id: data.id,
        name: data.nome,
        email: data.email || '',
        phone: data.telefone || '',
        lastVisit: null,
        totalSpent: 0,
        gender: data.genero || '',
        category: newClient.category,
        city: data.cidade || '',
        loyaltyPoints: 0,
        memberSince: new Date().toISOString(),
        birthdate: newClient.birthdate,
        marketingPreferences: newClient.marketingPreferences,
        tags: newClient.tags || []
      };
      
      setClients([...clients, clientWithId]);
      toast.success("Cliente adicionado com sucesso");
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      toast.error("Erro ao adicionar cliente");
    }
  };

  // Delete client
  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)
        .eq('id_negocio', businessId);
        
      if (error) {
        throw error;
      }
      
      setClients(clients.filter(client => client.id !== id));
      toast.success("Cliente removido com sucesso");
    } catch (error) {
      console.error("Erro ao remover cliente:", error);
      toast.error("Erro ao remover cliente");
    }
  };

  // Update client
  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      // Preparar dados para atualização
      const updateData = {
        ...(clientData.name && { nome: clientData.name }),
        ...(clientData.email && { email: clientData.email }),
        ...(clientData.phone && { telefone: clientData.phone }),
        ...(clientData.gender && { genero: clientData.gender }),
        ...(clientData.city && { cidade: clientData.city }),
        ...(clientData.category && { preferencias: { categoria: clientData.category } }),
        ...(clientData.birthdate && { data_nascimento: clientData.birthdate }),
        ...(clientData.marketingPreferences && { preferencias_marketing: clientData.marketingPreferences }),
        ...(clientData.tags && { tags: clientData.tags })
      };
      
      const { error } = await supabase
        .from('clientes')
        .update(updateData)
        .eq('id', id)
        .eq('id_negocio', businessId);
        
      if (error) {
        throw error;
      }
      
      // Atualizar cliente na lista local
      setClients(clients.map(client => 
        client.id === id ? { ...client, ...clientData } : client
      ));
      
      toast.success("Cliente atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Erro ao atualizar cliente");
    }
  };

  // Add loyalty points
  const addLoyaltyPoints = async (id: string, points: number) => {
    try {
      const client = clients.find(c => c.id === id);
      if (!client) {
        toast.error("Cliente não encontrado");
        return;
      }
      
      const currentPoints = client.loyaltyPoints || 0;
      const newPoints = currentPoints + points;
      
      const { error } = await supabase
        .from('clientes')
        .update({
          dados_fidelidade: {
            pontos: newPoints,
            nivel: determineLevel(newPoints),
            ultimo_resgate: null
          }
        })
        .eq('id', id)
        .eq('id_negocio', businessId);
        
      if (error) {
        throw error;
      }
      
      // Atualizar cliente na lista local
      setClients(clients.map(client => 
        client.id === id ? { ...client, loyaltyPoints: newPoints } : client
      ));
      
      toast.success(`${points} pontos adicionados com sucesso`);
    } catch (error) {
      console.error("Erro ao adicionar pontos de fidelidade:", error);
      toast.error("Erro ao adicionar pontos");
    }
  };

  // Update marketing preferences
  const updateMarketingPreferences = async (id: string, preferences: Partial<Client['marketingPreferences']>) => {
    try {
      const client = clients.find(c => c.id === id);
      if (!client) {
        toast.error("Cliente não encontrado");
        return;
      }
      
      const currentPreferences = client.marketingPreferences || {
        email: false,
        whatsapp: false,
        sms: false
      };
      
      const updatedPreferences = {
        ...currentPreferences,
        ...preferences
      };
      
      const { error } = await supabase
        .from('clientes')
        .update({
          preferencias_marketing: updatedPreferences
        })
        .eq('id', id)
        .eq('id_negocio', businessId);
        
      if (error) {
        throw error;
      }
      
      // Atualizar cliente na lista local
      setClients(clients.map(client => 
        client.id === id ? { ...client, marketingPreferences: updatedPreferences } : client
      ));
      
      toast.success("Preferências de marketing atualizadas");
    } catch (error) {
      console.error("Erro ao atualizar preferências de marketing:", error);
      toast.error("Erro ao atualizar preferências");
    }
  };

  // Add client tag
  const addClientTag = async (id: string, tag: string) => {
    try {
      const client = clients.find(c => c.id === id);
      if (!client) {
        toast.error("Cliente não encontrado");
        return;
      }
      
      const currentTags = client.tags || [];
      if (currentTags.includes(tag)) {
        return; // Tag já existe
      }
      
      const updatedTags = [...currentTags, tag];
      
      const { error } = await supabase
        .from('clientes')
        .update({
          tags: updatedTags
        })
        .eq('id', id)
        .eq('id_negocio', businessId);
        
      if (error) {
        throw error;
      }
      
      // Atualizar cliente na lista local
      setClients(clients.map(client => 
        client.id === id ? { ...client, tags: updatedTags } : client
      ));
      
      toast.success("Tag adicionada com sucesso");
    } catch (error) {
      console.error("Erro ao adicionar tag:", error);
      toast.error("Erro ao adicionar tag");
    }
  };

  // Remove client tag
  const removeClientTag = async (id: string, tag: string) => {
    try {
      const client = clients.find(c => c.id === id);
      if (!client) {
        toast.error("Cliente não encontrado");
        return;
      }
      
      const currentTags = client.tags || [];
      const updatedTags = currentTags.filter(t => t !== tag);
      
      const { error } = await supabase
        .from('clientes')
        .update({
          tags: updatedTags
        })
        .eq('id', id)
        .eq('id_negocio', businessId);
        
      if (error) {
        throw error;
      }
      
      // Atualizar cliente na lista local
      setClients(clients.map(client => 
        client.id === id ? { ...client, tags: updatedTags } : client
      ));
      
      toast.success("Tag removida com sucesso");
    } catch (error) {
      console.error("Erro ao remover tag:", error);
      toast.error("Erro ao remover tag");
    }
  };

  // Helper function to determine loyalty level
  const determineLevel = (points: number): string => {
    if (points >= 1000) return 'VIP';
    if (points >= 500) return 'Ouro';
    if (points >= 200) return 'Prata';
    return 'Bronze';
  };

  // Update filter options
  const updateFilterOptions = (newOptions: Partial<FilterOptions>) => {
    setFilterOptions({
      ...filterOptions,
      ...newOptions
    });
  };

  return {
    clients,
    setClients,
    loading,
    filterOptions,
    updateFilterOptions,
    addClient,
    deleteClient,
    updateClient,
    addLoyaltyPoints,
    updateMarketingPreferences,
    addClientTag,
    removeClientTag
  };
};
