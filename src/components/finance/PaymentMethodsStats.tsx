
import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface PaymentMethodsStatsProps {
  isLoading: boolean;
}

interface PaymentMethodStat {
  name: string;
  value: number;
  color: string;
}

export function PaymentMethodsStats({ isLoading }: PaymentMethodsStatsProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodStat[]>([]);
  
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const { data, error } = await supabase
          .from('transacoes')
          .select('metodo_pagamento, valor')
          .eq('tipo', 'receita')
          .eq('status', 'approved');
        
        if (error) throw error;
        
        // Agrupar e somar por método de pagamento
        const methods: Record<string, number> = {};
        data.forEach(transaction => {
          const method = transaction.metodo_pagamento || 'outro';
          methods[method] = (methods[method] || 0) + Number(transaction.valor);
        });
        
        // Transformar em array para o gráfico
        const methodColors: Record<string, string> = {
          credit_card: '#4f46e5',
          debit_card: '#3b82f6', 
          pix: '#0ea5e9',
          bank_slip: '#6366f1',
          cash: '#8b5cf6',
          outro: '#a3a3a3'
        };
        
        const methodNames: Record<string, string> = {
          credit_card: 'Cartão de Crédito',
          debit_card: 'Cartão de Débito',
          pix: 'PIX',
          bank_slip: 'Boleto',
          cash: 'Dinheiro',
          outro: 'Outro'
        };
        
        const methodsArray = Object.entries(methods).map(([key, value]) => ({
          name: methodNames[key] || key,
          value,
          color: methodColors[key] || '#a3a3a3'
        }));
        
        setPaymentMethods(methodsArray);
      } catch (error) {
        console.error("Erro ao buscar métodos de pagamento:", error);
      }
    };
    
    if (!isLoading) {
      fetchPaymentMethods();
    }
  }, [isLoading]);
  
  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }
  
  // Se não houver dados, mostrar mensagem
  if (paymentMethods.length === 0) {
    return <div className="h-[200px] flex items-center justify-center text-muted-foreground">Nenhum pagamento registrado</div>;
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded-md shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={paymentMethods}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            labelLine={false}
          >
            {paymentMethods.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
