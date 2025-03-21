
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarDays, 
  Package2, 
  CircleDollarSign, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  X,
  Scissors,
  ShoppingBag,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Client } from "@/hooks/useClientData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ClientDetailsProps {
  clientId: string;
  onClose: () => void;
}

// Tipos para histórico de serviços/compras
type ServiceHistoryItem = {
  id: string;
  date: string;
  serviceName: string;
  price: number;
  professional: string;
  duration: number;
};

type PurchaseHistoryItem = {
  id: string;
  date: string;
  productName: string;
  quantity: number;
  price: number;
};

export const ClientDetails = ({ clientId, onClose }: ClientDetailsProps) => {
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

  // Format date to display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nunca visitou";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800';
      case 'Premium':
        return 'bg-blue-100 text-blue-800';
      case 'Regular':
        return 'bg-green-100 text-green-800';
      case 'Novo':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="w-32 h-6 bg-muted animate-pulse rounded-md"></div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-muted animate-pulse rounded-full"></div>
              <div className="space-y-2">
                <div className="w-24 h-4 bg-muted animate-pulse rounded-md"></div>
                <div className="w-32 h-3 bg-muted animate-pulse rounded-md"></div>
              </div>
            </div>
            <div className="w-full h-32 bg-muted animate-pulse rounded-md"></div>
            <div className="w-full h-48 bg-muted animate-pulse rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!client) {
    return (
      <Card className="h-full shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Cliente não encontrado</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p>Não foi possível encontrar os detalhes deste cliente.</p>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>Detalhes do Cliente</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Informações básicas do cliente */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Avatar className="h-16 w-16 border">
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {getInitials(client.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{client.name}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge className={getCategoryColor(client.category)} variant="outline">
                  {client.category}
                </Badge>
                {client.gender && (
                  <Badge variant="outline" className="bg-muted/50">
                    {client.gender}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Detalhes de contato */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
            {client.city && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{client.city}</span>
              </div>
            )}
          </div>

          {/* Estatísticas do cliente */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
              <CalendarDays className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">Última visita</span>
              <span className="font-medium mt-1">
                {formatDate(client.lastVisit)}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
              <CircleDollarSign className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs text-muted-foreground">Total gasto</span>
              <span className="font-medium mt-1">
                {formatCurrency(client.totalSpent)}
              </span>
            </div>
          </div>

          <Separator />

          {/* Histórico de serviços e compras */}
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="services" className="flex items-center gap-1">
                <Scissors className="h-3.5 w-3.5" />
                <span>Serviços</span>
              </TabsTrigger>
              <TabsTrigger value="purchases" className="flex items-center gap-1">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Compras</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="services" className="space-y-4">
              {serviceHistory.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Nenhum serviço encontrado</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {serviceHistory.map((service) => (
                    <div key={service.id} className="p-3 bg-muted/20 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{service.serviceName}</h4>
                        <span className="text-sm font-medium text-primary">
                          {formatCurrency(service.price)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {service.professional}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          <span>{formatDate(service.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{service.duration} min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="purchases" className="space-y-4">
              {purchaseHistory.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Nenhuma compra encontrada</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {purchaseHistory.map((purchase) => (
                    <div key={purchase.id} className="p-3 bg-muted/20 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{purchase.productName}</h4>
                        <span className="text-sm font-medium text-primary">
                          {formatCurrency(purchase.price)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          <span>{formatDate(purchase.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package2 className="h-3 w-3" />
                          <span>Qtd: {purchase.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
