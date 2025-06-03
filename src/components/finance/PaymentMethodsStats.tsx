
import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

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
  const { businessId } = useCurrentBusiness();
  
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const { data, error } = await supabase
          .from('financial_transactions')
          .select('paymentMethod, amount')
          .eq('type', 'INCOME')
          .eq('status', 'PAID')
          .eq('tenantId', businessId);
        
        if (error) throw error;
        
        // Agrupar e somar por método de pagamento
        const methods: Record<string, number> = {};
        data.forEach(transaction => {
          const method = transaction.paymentMethod || 'OTHER';
          methods[method] = (methods[method] || 0) + Number(transaction.amount);
        });
        
        // Transformar em array para o gráfico
        const methodColors: Record<string, string> = {
          CREDIT_CARD: '#4f46e5',
          DEBIT_CARD: '#3b82f6', 
          PIX: '#0ea5e9',
          BANK_SLIP: '#6366f1',
          CASH: '#8b5cf6',
          OTHER: '#a3a3a3'
        };
        
        const methodNames: Record<string, string> = {
          CREDIT_CARD: 'Cartão de Crédito',
          DEBIT_CARD: 'Cartão de Débito',
          PIX: 'PIX',
          BANK_SLIP: 'Boleto',
          CASH: 'Dinheiro',
          OTHER: 'Outro'
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
    
    if (!isLoading && businessId) {
      fetchPaymentMethods();
    }
  }, [isLoading, businessId]);
  
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
