
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, isSameMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTenant } from '@/contexts/TenantContext';
import { Cake, Mail, Phone } from 'lucide-react';

export interface BirthdayClient {
  id: string;
  nome?: string;
  name?: string;
  email?: string;
  telefone?: string;
  phone?: string;
  data_nascimento?: string;
  birth_date?: string;
}

export function BirthdayClients() {
  const [birthdayClients, setBirthdayClients] = useState<BirthdayClient[]>([]);
  const [loading, setLoading] = useState(true);
  const { businessId } = useTenant();

  useEffect(() => {
    const fetchBirthdayClients = async () => {
      if (!businessId) return;
      
      setLoading(true);
      try {
        // First try the new clients table
        let { data: newData, error: newError } = await supabase
          .from('clients')
          .select('id, name, email, phone, birth_date')
          .eq('business_id', businessId);
        
        if (newError || !newData || newData.length === 0) {
          // Try legacy table
          const { data: legacyData, error: legacyError } = await supabase
            .from('clientes')
            .select('id, nome, email, telefone, data_nascimento')
            .eq('id_negocio', businessId);
            
          if (legacyError) {
            console.error('Error fetching birthday clients:', legacyError);
            setBirthdayClients([]);
            setLoading(false);
            return;
          }
          
          if (legacyData && legacyData.length > 0) {
            // Filter clients with birthdays in the current month
            const clientsWithBirthday = legacyData.filter(client => {
              if (!client.data_nascimento) return false;
              try {
                return isSameMonth(parseISO(client.data_nascimento), new Date());
              } catch (e) {
                return false;
              }
            });
            
            setBirthdayClients(clientsWithBirthday);
          } else {
            setBirthdayClients([]);
          }
        } else {
          // Filter clients with birthdays in the current month
          const clientsWithBirthday = newData.filter(client => {
            if (!client.birth_date) return false;
            try {
              return isSameMonth(parseISO(client.birth_date), new Date());
            } catch (e) {
              return false;
            }
          });
          
          setBirthdayClients(clientsWithBirthday);
        }
      } catch (error) {
        console.error('Error fetching birthday clients:', error);
        setBirthdayClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdayClients();
  }, [businessId]);

  const formatBirthDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return format(parseISO(dateStr), "dd 'de' MMMM", { locale: ptBR });
    } catch (e) {
      return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Aniversariantes do Mês</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando aniversariantes...</p>
        ) : birthdayClients.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum aniversariante este mês.</p>
        ) : (
          birthdayClients.map((client) => (
            <div key={client.id} className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  {(client.name || client.nome || '?').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="font-medium">{client.name || client.nome}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Cake className="mr-1 h-3 w-3" />
                  <span>{formatBirthDate(client.birth_date || client.data_nascimento)}</span>
                </div>
                <div className="flex gap-3">
                  {(client.email) && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Mail className="mr-1 h-3 w-3" />
                      <span>{client.email}</span>
                    </div>
                  )}
                  {(client.phone || client.telefone) && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Phone className="mr-1 h-3 w-3" />
                      <span>{client.phone || client.telefone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
