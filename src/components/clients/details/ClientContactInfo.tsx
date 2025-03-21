
import { Mail, Phone, MapPin } from "lucide-react";
import { Client } from "@/hooks/useClientData";

interface ClientContactInfoProps {
  client: Client;
}

export const ClientContactInfo = ({ client }: ClientContactInfoProps) => {
  return (
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
  );
};
