
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ClientInfoCard } from "./details/ClientInfoCard";
import { ClientContactInfo } from "./details/ClientContactInfo";
import { ClientStats } from "./details/ClientStats";
import { ClientHistoryTabs } from "./details/ClientHistoryTabs";
import { ClientDetailsLoadingState } from "./details/ClientDetailsLoadingState";
import { ClientDetailsErrorState } from "./details/ClientDetailsErrorState";
import { useClientHistory } from "@/hooks/useClientHistory";

interface ClientDetailsProps {
  clientId: string;
  onClose: () => void;
}

export const ClientDetails = ({ clientId, onClose }: ClientDetailsProps) => {
  const { client, serviceHistory, purchaseHistory, isLoading } = useClientHistory(clientId);

  if (isLoading) {
    return <ClientDetailsLoadingState onClose={onClose} />;
  }

  if (!client) {
    return <ClientDetailsErrorState onClose={onClose} />;
  }

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
          <ClientInfoCard client={client} />

          {/* Detalhes de contato */}
          <ClientContactInfo client={client} />

          {/* Estatísticas do cliente */}
          <ClientStats 
            lastVisit={client.lastVisit} 
            totalSpent={client.totalSpent} 
          />

          <Separator />

          {/* Histórico de serviços e compras */}
          <ClientHistoryTabs 
            serviceHistory={serviceHistory}
            purchaseHistory={purchaseHistory}
          />
        </div>
      </CardContent>
    </Card>
  );
};
