
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ReportStatistics } from "@/hooks/reports/useReportsData";

interface ServicePopularityChartProps {
  dateRange: string;
  stats: ReportStatistics;
}

export function ServicePopularityChart({ dateRange, stats }: ServicePopularityChartProps) {
  const data = stats.servicePopularity;
  
  // If there's no data, show a placeholder
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-md border border-gray-200">
        <p className="text-gray-500">Não existem dados suficientes para este período</p>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`${value} agendamentos`, "Quantidade"]}
          labelFormatter={(label) => `Serviço: ${label}`}
        />
        <Bar dataKey="count" fill="#3b82f6" name="Agendamentos" />
      </BarChart>
    </ResponsiveContainer>
  );
}
