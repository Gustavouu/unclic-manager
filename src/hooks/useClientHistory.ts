
import { useState, useEffect } from "react";
import { ServiceHistoryItem } from "@/components/clients/details/ServiceHistoryItem";
import { PurchaseHistoryItem } from "@/components/clients/details/PurchaseHistoryItem";
import { Client } from "@/hooks/useClientData";

export const useClientHistory = (clientId: string) => {
  const [client, setClient] = useState<Client | null>(null);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryItem[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulando carregamento de dados do cliente
    setIsLoading(true);
    
    // Dado o clientId, buscaríamos os dados do cliente do servidor
    // Aqui usaremos dados simulados
    setTimeout(() => {
      const mockClient = {
        id: clientId,
        name: clientId === "1" ? "Ana Silva" : 
              clientId === "2" ? "Carlos Oliveira" : 
              clientId === "3" ? "Mariana Costa" : 
              clientId === "4" ? "Pedro Santos" : "Juliana Pereira",
        email: clientId === "1" ? "ana.silva@email.com" : 
               clientId === "2" ? "carlos.oliveira@email.com" : 
               clientId === "3" ? "mariana.costa@email.com" : 
               clientId === "4" ? "pedro.santos@email.com" : "juliana.pereira@email.com",
        phone: clientId === "1" ? "(11) 98765-4321" : 
               clientId === "2" ? "(11) 91234-5678" : 
               clientId === "3" ? "(11) 99876-5432" : 
               clientId === "4" ? "(11) 98877-6655" : "(11) 97788-9900",
        lastVisit: clientId === "4" ? null : "2023-10-15",
        totalSpent: clientId === "1" ? 450.00 : 
                    clientId === "2" ? 275.50 : 
                    clientId === "3" ? 620.00 : 
                    clientId === "4" ? 0 : 380.75,
        gender: clientId === "1" || clientId === "3" || clientId === "5" ? "Feminino" : "Masculino",
        category: clientId === "1" ? "VIP" : 
                  clientId === "2" ? "Regular" : 
                  clientId === "3" ? "Premium" : 
                  clientId === "4" ? "Novo" : "Regular",
        city: clientId === "1" || clientId === "5" ? "São Paulo" : 
              clientId === "2" ? "Rio de Janeiro" : 
              clientId === "3" ? "Belo Horizonte" : "Curitiba",
      };
      
      setClient(mockClient);
      
      // Dados simulados para histórico de serviços
      const mockServiceHistory = [
        {
          id: "s1",
          date: "2023-10-15",
          serviceName: "Corte de Cabelo",
          price: 80.00,
          professional: "João Silva",
          duration: 60
        },
        {
          id: "s2",
          date: "2023-09-20",
          serviceName: "Manicure",
          price: 45.00,
          professional: "Maria Santos",
          duration: 45
        },
        {
          id: "s3",
          date: "2023-08-05",
          serviceName: "Tratamento Capilar",
          price: 120.00,
          professional: "Roberto Alves",
          duration: 90
        }
      ];
      
      // Dados simulados para histórico de compras
      const mockPurchaseHistory = [
        {
          id: "p1",
          date: "2023-10-15",
          productName: "Shampoo Profissional",
          quantity: 1,
          price: 65.00
        },
        {
          id: "p2",
          date: "2023-09-20",
          productName: "Condicionador",
          quantity: 1,
          price: 60.00
        },
        {
          id: "p3",
          date: "2023-08-05",
          productName: "Máscara Capilar",
          quantity: 2,
          price: 80.00
        }
      ];
      
      // Remover alguns itens para clientes específicos
      if (clientId === "4") {
        // Cliente novo sem histórico
        setServiceHistory([]);
        setPurchaseHistory([]);
      } else if (clientId === "5") {
        // Apenas alguns serviços
        setServiceHistory(mockServiceHistory.slice(0, 1));
        setPurchaseHistory([]);
      } else {
        setServiceHistory(mockServiceHistory);
        setPurchaseHistory(mockPurchaseHistory);
      }
      
      setIsLoading(false);
    }, 500);
  }, [clientId]);

  return {
    client,
    serviceHistory,
    purchaseHistory,
    isLoading
  };
};
