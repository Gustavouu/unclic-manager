
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Cake, PhoneCall, Mail, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

interface BirthdayClient {
  id: string;
  nome?: string;
  name?: string;
  telefone?: string;
  phone?: string;
  email?: string;
  data_nascimento?: string;
  birth_date?: string;
}

export function BirthdayClients() {
  const [loading, setLoading] = useState<boolean>(true);
  const [birthdayClients, setBirthdayClients] = useState<BirthdayClient[]>([]);
  const { businessId } = useCurrentBusiness();
  
  useEffect(() => {
    const fetchBirthdayClients = async () => {
      if (!businessId) return;
      
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // JS months are 0-indexed
      
      try {
        setLoading(true);
        
        // First try the clients table (new schema)
        let { data, error } = await supabase
          .from('clients')
          .select('id, name, phone, email, birth_date')
          .eq('business_id', businessId);
          
        if (error || !data || data.length === 0) {
          // Try legacy clients
          console.log('Trying to fetch from legacy clients table');
          const { data: legacyData, error: legacyError } = await supabase
            .from('clients')
            .select('id, nome, telefone, email, data_nascimento')
            .eq('id_negocio', businessId);
            
          if (legacyError) {
            console.error('Error fetching birthday clients:', legacyError);
            setBirthdayClients([]);
            setLoading(false);
            return;
          }
          
          data = legacyData;
        }
        
        // Filter for clients with birthdays in the current month
        const currentMonthClients = data?.filter(client => {
          const birthDate = client.birth_date || client.data_nascimento;
          if (!birthDate) return false;
          
          const birthMonth = new Date(birthDate).getMonth() + 1;
          return birthMonth === currentMonth;
        }) || [];
        
        setBirthdayClients(currentMonthClients);
      } catch (error) {
        console.error('Erro ao buscar aniversariantes do mês:', error);
        setBirthdayClients([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBirthdayClients();
  }, [businessId]);
  
  const formatBirthDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display flex items-center">
          <Cake className="mr-2 h-5 w-5 text-yellow-500" />
          Aniversariantes do Mês
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : birthdayClients.length > 0 ? (
          <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2">
            {birthdayClients.map((client) => (
              <div 
                key={client.id} 
                className="flex items-center justify-between border-l-2 border-yellow-400 bg-yellow-50/50 p-3 rounded-r-md"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="font-medium truncate">{client.name || client.nome}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{formatBirthDate(client.birth_date || client.data_nascimento)}</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-2">
                  {(client.telefone || client.phone) && (
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-yellow-100 text-yellow-600">
                      <PhoneCall className="h-4 w-4" />
                      <span className="sr-only">Ligar</span>
                    </Button>
                  )}
                  {client.email && (
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-yellow-100 text-yellow-600">
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Email</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <div className="bg-yellow-100 p-3 rounded-full mb-3">
              <Cake className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="font-medium">Nenhum aniversariante este mês</p>
            <p className="text-xs mt-1">Seus clientes com aniversário neste mês aparecerão aqui</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
