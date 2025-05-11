
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Cake, PhoneCall, Mail, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

interface BirthdayClient {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  data_nascimento: string;
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
        const { data, error } = await supabase
          .from('clientes')
          .select('id, nome, telefone, email, data_nascimento')
          .eq('id_negocio', businessId)
          .not('data_nascimento', 'is', null)
          .filter('EXTRACT(MONTH FROM data_nascimento)', 'eq', currentMonth);
          
        if (error) throw error;
        setBirthdayClients(data || []);
      } catch (error) {
        console.error('Erro ao buscar aniversariantes do mês:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBirthdayClients();
  }, [businessId]);
  
  const formatBirthDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display flex items-center">
          <Cake className="mr-2 h-5 w-5 text-yellow-500" />
          Aniversariantes do Mês
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : birthdayClients.length > 0 ? (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {birthdayClients.map((client) => (
              <div key={client.id} className="flex items-center justify-between border-b pb-3">
                <div className="space-y-1">
                  <p className="font-medium">{client.nome}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{formatBirthDate(client.data_nascimento)}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {client.telefone && (
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <PhoneCall className="h-4 w-4" />
                      <span className="sr-only">Ligar</span>
                    </Button>
                  )}
                  {client.email && (
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
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
            <Cake className="h-12 w-12 mb-2" />
            <p>Nenhum aniversariante este mês</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
