
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Sample financial data
const financialData = [
  { day: "Dom", value: 0 },
  { day: "Seg", value: 110 },
  { day: "Ter", value: 80 },
  { day: "Qua", value: 95 },
  { day: "Qui", value: 120 },
  { day: "Sex", value: 85 },
  { day: "Sáb", value: 30 },
];

export const FinancialChart = () => {
  const formatCurrency = (value: number) => 
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
  const totalRevenue = financialData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card className="animated-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Movimentação Financeira</CardTitle>
            <CardDescription>Visão semanal de receitas</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-semibold">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={financialData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f6f95" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f6f95" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                hide={true}
                domain={[0, 'dataMax + 30']}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), "Receita"]} 
                labelFormatter={(label) => `${label}`}
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  padding: "0.5rem",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4f6f95"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
