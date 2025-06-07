
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Cake } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { normalizeClientData } from '@/utils/databaseUtils';

type ClientInfo = {
  id: string;
  name: string;
  image?: string;
  birthDate?: Date;
  lastVisit?: Date;
  status: 'active' | 'inactive';
};

export function BirthdayClients() {
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { businessId } = useTenant();

  useEffect(() => {
    const fetchTodaysBirthdays = async () => {
      if (!businessId) return;

      setLoading(true);
      try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();

        console.log('Fetching birthday clients for business:', businessId);

        // Use the migrated clients table
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('*')
          .eq('business_id', businessId);

        if (clientsError) {
          console.error('Error fetching clients:', clientsError);
          setClients([]);
        } else if (clientsData && clientsData.length > 0) {
          const normalizedClients = clientsData.map(normalizeClientData);
          
          const todaysBirthdays = normalizedClients.filter(client => {
            if (!client.birth_date) return false;
            const birthDate = new Date(client.birth_date);
            return birthDate.getMonth() + 1 === currentMonth && birthDate.getDate() === currentDay;
          });

          const birthdayClients = todaysBirthdays.map(client => ({
            id: client.id,
            name: client.name || 'Cliente',
            image: client.avatar,
            birthDate: client.birth_date ? new Date(client.birth_date) : undefined,
            lastVisit: client.last_visit ? new Date(client.last_visit) : undefined,
            status: (client.status as 'active' | 'inactive') || 'active'
          }));

          console.log('Found birthday clients:', birthdayClients.length);
          setClients(birthdayClients);
        } else {
          setClients([]);
        }
      } catch (error) {
        console.error('Error fetching birthday clients:', error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysBirthdays();
  }, [businessId]);

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Aniversariantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Carregando aniversariantes...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Cake className="h-5 w-5" />
          Aniversariantes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <div className="text-sm text-muted-foreground">Nenhum aniversariante hoje</div>
        ) : (
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={client.image} alt={client.name} />
                  <AvatarFallback>{client.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{client.name}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-pink-100 text-pink-800 hover:bg-pink-200">
                      Aniversário hoje
                    </Badge>
                    {client.lastVisit && (
                      <span className="text-xs text-muted-foreground">
                        Visita há {formatDistanceToNow(client.lastVisit, { locale: ptBR, addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
