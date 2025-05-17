
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Cake, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";

interface ClientWithBirthday {
  id: string;
  name?: string;
  nome?: string; // For legacy data
  photo_url?: string;
  foto_url?: string; // For legacy data
  birth_date?: string;
  data_nascimento?: string; // For legacy data
  daysUntilBirthday?: number;
}

export function BirthdayClients() {
  const [clients, setClients] = useState<ClientWithBirthday[]>([]);
  const [loading, setLoading] = useState(true);
  const { businessId } = useTenant();

  useEffect(() => {
    const fetchBirthdayClients = async () => {
      if (!businessId) return;
      
      setLoading(true);
      try {
        // Try new clients table first
        const { data: newData, error: newError } = await supabase
          .from('clients')
          .select('id, name, photo_url, birth_date')
          .eq('business_id', businessId);
          
        if (!newError && newData && newData.length > 0) {
          processClients(newData, 'birth_date', 'name', 'photo_url');
        } else {
          // Try legacy clientes table
          try {
            // Check if the legacy table exists first
            const { data: checkData, error: checkError } = await supabase
              .from('negocios')  // Just to check if legacy schema exists
              .select('id')
              .limit(1);
              
            if (!checkError) {
              // Legacy schema might exist, try the clients table
              const { data: legacyData, error: legacyError } = await supabase
                .from('clients') // Use 'clients' instead of 'clientes'
                .select('id, nome, foto_url, data_nascimento')
                .eq('id_negocio', businessId);
                
              if (!legacyError && legacyData && legacyData.length > 0) {
                processClients(legacyData, 'data_nascimento', 'nome', 'foto_url');
              } else {
                setClients([]);
              }
            } else {
              setClients([]);
            }
          } catch (err) {
            console.error("Error checking legacy tables:", err);
            setClients([]);
          }
        }
      } catch (error) {
        console.error('Error fetching birthday clients:', error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    const processClients = (
      data: any[], 
      birthDateField: string, 
      nameField: string,
      photoField: string
    ) => {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentDay = today.getDate();
      
      // Filter clients with birthdays in the next 30 days
      const clientsWithBirthdays = data
        .filter(client => {
          if (!client[birthDateField]) return false;
          
          const birthDate = new Date(client[birthDateField]);
          const birthMonth = birthDate.getMonth();
          const birthDay = birthDate.getDate();
          
          // Calculate days until next birthday
          let nextBirthdayYear = today.getFullYear();
          if (birthMonth < currentMonth || (birthMonth === currentMonth && birthDay < currentDay)) {
            // Birthday already passed this year, calculate for next year
            nextBirthdayYear += 1;
          }
          
          const nextBirthday = new Date(nextBirthdayYear, birthMonth, birthDay);
          const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          client.daysUntilBirthday = daysUntil;
          
          // Return true if birthday is within the next 30 days
          return daysUntil <= 30;
        })
        .sort((a, b) => {
          // Sort by days until birthday (ascending)
          return (a.daysUntilBirthday || 999) - (b.daysUntilBirthday || 999);
        })
        .slice(0, 5); // Take only the closest 5 birthdays
      
      // Map to standardized format
      setClients(clientsWithBirthdays.map(client => ({
        id: client.id,
        name: client[nameField],
        nome: client.nome,
        photo_url: client[photoField],
        foto_url: client.foto_url,
        birth_date: client[birthDateField],
        data_nascimento: client.data_nascimento,
        daysUntilBirthday: client.daysUntilBirthday
      })));
    };

    fetchBirthdayClients();
  }, [businessId]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Cake className="h-5 w-5 mr-2" />
          Aniversários em Breve
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              </div>
            ))}
          </div>
        ) : clients.length > 0 ? (
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="flex items-center space-x-4">
                <Avatar className={cn("h-10 w-10",
                  client.daysUntilBirthday === 0 ? "ring-2 ring-offset-2 ring-red-500" : "")}>
                  <AvatarImage src={client.photo_url || client.foto_url} alt={client.name || client.nome || ""} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{client.name || client.nome}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-3 w-3 mr-1" /> 
                    {client.daysUntilBirthday === 0 ? (
                      <span className="text-red-500 font-medium">Hoje!</span>
                    ) : (
                      `Em ${client.daysUntilBirthday} dias`
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <Cake className="h-10 w-10 mx-auto text-muted-foreground/60" />
            <p className="text-muted-foreground mt-2">Nenhum aniversário nos próximos 30 dias</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
