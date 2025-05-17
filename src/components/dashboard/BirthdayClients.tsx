
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Cake } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { normalizeClientData, tableExists } from '@/utils/databaseUtils';

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
        // Get current month and day
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
        const currentDay = today.getDate();

        let birthdayClients: ClientInfo[] = [];

        // First, try to check if clients table exists and fetch from there
        const clientsTableExists = await tableExists('clients');
        
        if (clientsTableExists) {
          const { data: clientsData, error: clientsError } = await supabase
            .from('clients')
            .select('*')
            .eq('business_id', businessId);

          if (clientsError) {
            console.error('Error fetching clients:', clientsError);
          } else if (clientsData && clientsData.length > 0) {
            // Find clients with birthdays today
            const todaysBirthdays = clientsData.filter(client => {
              if (!client.birth_date && !client.data_nascimento) return false;
              const birthDate = new Date(client.birth_date || client.data_nascimento);
              return birthDate.getMonth() + 1 === currentMonth && birthDate.getDate() === currentDay;
            });

            birthdayClients = todaysBirthdays.map(client => ({
              id: client.id,
              name: client.name || client.nome || 'Cliente',
              image: client.avatar || client.image_url || undefined,
              birthDate: client.birth_date ? new Date(client.birth_date) : 
                        client.data_nascimento ? new Date(client.data_nascimento) : undefined,
              lastVisit: client.last_visit ? new Date(client.last_visit) : 
                      client.ultima_visita ? new Date(client.ultima_visita) : undefined,
              status: client.status || 'active'
            }));
          }
        }

        // If no data found, try the clientes table
        if (birthdayClients.length === 0) {
          const clientesExists = await tableExists('clientes');
          
          if (clientesExists) {
            const { data: clientesData, error: clientesError } = await supabase
              .from('clientes')
              .select('*')
              .eq('id_negocio', businessId);

            if (clientesError) {
              console.error('Error fetching clientes:', clientesError);
            } else if (clientesData && clientesData.length > 0) {
              // Find clients with birthdays today
              const todaysBirthdays = clientesData.filter(cliente => {
                if (!cliente.data_nascimento) return false;
                const birthDate = new Date(cliente.data_nascimento);
                return birthDate.getMonth() + 1 === currentMonth && birthDate.getDate() === currentDay;
              });

              const mappedClients = todaysBirthdays.map(cliente => ({
                id: cliente.id,
                name: cliente.nome || 'Cliente',
                image: cliente.avatar || cliente.url_avatar,
                birthDate: cliente.data_nascimento ? new Date(cliente.data_nascimento) : undefined,
                lastVisit: cliente.ultima_visita ? new Date(cliente.ultima_visita) : undefined,
                status: cliente.status || 'active'
              }));

              birthdayClients = [...birthdayClients, ...mappedClients];
            }
          }
        }

        setClients(birthdayClients);
      } catch (error) {
        console.error('Error fetching birthday clients:', error);
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
