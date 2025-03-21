
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/hooks/useClientData";

interface ClientInfoCardProps {
  client: Client;
}

export const ClientInfoCard = ({ client }: ClientInfoCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
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

  return (
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
  );
};
